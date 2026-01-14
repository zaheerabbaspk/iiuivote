import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { Candidate, Election } from '../models/election.model';

@Injectable({
    providedIn: 'root'
})
export class ElectionService {
    private http = inject(HttpClient);
    private apiUrl = environment.apiUrl;

    private electionsSubject = new BehaviorSubject<Election[]>([]);
    private candidatesSubject = new BehaviorSubject<Candidate[]>([]);

    elections$ = this.electionsSubject.asObservable();
    candidates$ = this.candidatesSubject.asObservable();

    constructor() {
        // Recover session from local storage if existing
        const savedData = localStorage.getItem('sessionData');
        if (savedData) {
            try {
                this.setSessionData(JSON.parse(savedData));
            } catch (e) {
                console.error('Error parsing session data', e);
            }
        }
    }

    login(token: string): Observable<any> {
        return this.http.post(`${this.apiUrl}/access-token`, { token }).pipe(
            map((res: any) => {
                if (res.status === 'success') {
                    this.setSessionData(res);
                }
                return res;
            })
        );
    }

    register(user: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/register`, user);
    }

    setSessionData(data: any) {
        localStorage.setItem('sessionData', JSON.stringify(data));
        if (data.accessToken) {
            localStorage.setItem('token', data.accessToken);
        }
        if (data.votingToken) {
            localStorage.setItem('votingToken', data.votingToken);
        }
        if (data.user) {
            localStorage.setItem('user', JSON.stringify(data.user));
        }

        if (data.authorizedElections) {
            this.electionsSubject.next(data.authorizedElections);
        }

        if (data.candidates) {
            const mappedCandidates: Candidate[] = data.candidates.map((c: any) => ({
                id: c.id?.toString(),
                name: c.name,
                department: c.position,
                description: c.party,
                imageUrl: c.image_url || c.image,
                election_id: c.election_id?.toString(),
                votes: c.votes || 0,
                color: c.color || '#428cff'
            }));
            this.candidatesSubject.next(mappedCandidates);
        }
    }

    getCandidatesByElection(electionId: string): Observable<Candidate[]> {
        return this.candidates$.pipe(
            map(candidates => candidates.filter(c => c.election_id === electionId))
        );
    }

    submitVote(candidateIds: string | string[]): Observable<any> {
        const token = localStorage.getItem('votingToken');
        const payload: any = { token };

        if (Array.isArray(candidateIds)) {
            payload.candidateIds = candidateIds.map(id => Number(id));
        } else {
            payload.candidateId = Number(candidateIds);
        }

        return this.http.post(`${this.apiUrl}/vote`, payload);
    }

    getResults(): Observable<any> {
        const token = localStorage.getItem('votingToken');
        const url = token ? `${this.apiUrl}/results?token=${token}` : `${this.apiUrl}/results`;
        return this.http.get<any>(url);
    }

    logout() {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('votingToken');
        localStorage.removeItem('sessionData');
        this.electionsSubject.next([]);
        this.candidatesSubject.next([]);
    }
}
