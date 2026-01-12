import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBack, arrowForward } from 'ionicons/icons';
import { Candidate } from '../../models/election.model';
import { ElectionService } from '../../services/election.service';
import { CandidateCardComponent } from '../../shared/components/candidate-card/candidate-card.component';

@Component({
    selector: 'app-voting',
    standalone: true,
    imports: [CommonModule, IonContent, IonIcon, CandidateCardComponent],
    templateUrl: './voting.page.html',
})
export class VotingPage {
    router = inject(Router);
    electionService = inject(ElectionService);
    candidates = signal<Candidate[]>([]);

    selectedId = signal<string | null>(null);

    constructor() {
        addIcons({ arrowBack, arrowForward });
        this.loadCandidates();
    }

    loadCandidates() {
        console.log('VotingPage: loadCandidates triggered');
        this.electionService.getCandidates().subscribe({
            next: (data) => {
                console.log('VotingPage: Data received from service:', data);
                this.candidates.set(data);
            },
            error: (err) => console.error('Error loading candidates', err)
        });
    }

    selectCandidate(id: string) {
        this.selectedId.set(id);
    }

    getSelectedCandidate() {
        return this.candidates().find(c => c.id === this.selectedId());
    }

    castVote() {
        const selectedId = this.selectedId();
        if (selectedId) {
            const userStr = localStorage.getItem('user');
            if (!userStr) {
                alert('Session expired. Please login again.');
                this.router.navigate(['/login']);
                return;
            }

            const user = JSON.parse(userStr);
            const userId = user.id;

            console.log('Casting vote for candidate:', selectedId, 'by user:', userId);

            this.electionService.submitVote(userId, parseInt(selectedId)).subscribe({
                next: () => {
                    this.router.navigate(['/results']);
                },
                error: (err) => {
                    console.error('Error casting vote', err);
                    alert(err.error?.detail || 'Failed to submit vote. You might have already voted.');
                }
            });
        }
    }
}
