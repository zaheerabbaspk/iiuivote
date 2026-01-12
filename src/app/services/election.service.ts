import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { Candidate } from '../models/election.model';

@Injectable({
    providedIn: 'root'
})
export class ElectionService {
    private http = inject(HttpClient);
    private apiUrl = environment.apiUrl;

    getCandidates(): Observable<Candidate[]> {
        return this.http.get<any[]>(`${this.apiUrl}/candidates`).pipe(
            map(data => data.map(c => ({
                id: c.id.toString(),
                name: c.name,
                department: c.position || '',
                description: c.party || '',
                votes: c.votes_count || 0,
                imageUrl: c.image_url || '',
                color: '#2563eb'
            })))
        );
    }

    submitVote(userId: number, candidateId: number): Observable<any> {
        return this.http.post(`${this.apiUrl}/vote`, { user_id: userId, candidate_id: candidateId });
    }

    getResults(): Observable<Candidate[]> {
        return this.http.get<any[]>(`${this.apiUrl}/results`).pipe(
            map(data => data.map(c => ({
                id: c.candidate_id?.toString() || c.id?.toString(),
                name: c.name,
                department: c.position || '',
                description: c.party || '',
                votes: c.votes_count || 0,
                imageUrl: c.image_url || '',
                color: '#2563eb'
            })))
        );
    }

    register(userData: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/register`, userData);
    }

    login(credentials: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/login`, credentials);
    }
}