import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Candidate } from '../models/election.model';

@Injectable({
    providedIn: 'root'
})
export class ElectionService {
    private http = inject(HttpClient);
    private apiUrl = environment.apiUrl;

    getCandidates(): Observable<Candidate[]> {
        return this.http.get<Candidate[]>(`${this.apiUrl}/candidates`);
    }

    submitVote(userId: number, candidateId: number): Observable<any> {
        return this.http.post(`${this.apiUrl}/vote`, { user_id: userId, candidate_id: candidateId });
    }

    getResults(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/results`);
    }

    register(userData: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/register`, userData);
    }

    login(credentials: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/login`, credentials);
    }
}
