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
        this.electionService.getCandidates().subscribe({
            next: (data) => {
                // Map API data to UI model
                const mapped = data.map((c: any) => ({
                    id: c.id.toString(),
                    name: c.name,
                    department: c.position,
                    description: '',
                    imageUrl: `https://i.pravatar.cc/150?u=${c.id}`,
                    votes: c.votes_count,
                    color: '#2563eb'
                }));
                this.candidates.set(mapped);
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
            console.log('Casting vote for:', selectedId);
            // In a real app, get user_id from auth state
            const userId = 1; // Placeholder for now
            this.electionService.submitVote(userId, parseInt(selectedId)).subscribe({
                next: () => {
                    this.router.navigate(['/results']);
                },
                error: (err) => {
                    console.error('Error casting vote', err);
                    alert(err.error.detail || 'Failed to submit vote');
                }
            });
        }
    }
}
