import { Component, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IonContent, IonIcon, IonBadge, IonButton, IonSpinner } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBack, arrowForward, checkmarkCircle, listOutline, personOutline, chevronForwardOutline, schoolOutline } from 'ionicons/icons';
import { ElectionService } from '../../services/election.service';
import { Candidate, Election } from '../../models/election.model';
import { CandidateCardComponent } from '../../shared/components/candidate-card/candidate-card.component';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-voting',
    standalone: true,
    imports: [CommonModule, IonContent, IonIcon, IonBadge, IonButton, IonSpinner, CandidateCardComponent],
    templateUrl: './voting.page.html',
})
export class VotingPage {
    private electionService = inject(ElectionService);
    private router = inject(Router);

    elections = toSignal(this.electionService.elections$, { initialValue: [] });
    allCandidates = toSignal(this.electionService.candidates$, { initialValue: [] });

    selectedElection = signal<Election | null>(null);
    filteredCandidates = signal<Candidate[]>([]);

    // Track selections: { electionId: candidateId }
    selections = signal<Record<string, string>>({});

    isLoading = signal<boolean>(false);
    isSubmitted = signal<boolean>(false);

    // Derived signal for payload
    selectionCount = computed(() => Object.keys(this.selections()).length);

    constructor() {
        addIcons({ arrowBack, arrowForward, checkmarkCircle, listOutline, personOutline, chevronForwardOutline, schoolOutline });
    }

    selectElection(election: Election) {
        if (this.isSubmitted()) return;
        this.selectedElection.set(election);
        const candidates = this.allCandidates().filter(c => c.election_id === election.id);
        this.filteredCandidates.set(candidates);
    }

    clearSelection() {
        this.selectedElection.set(null);
        this.filteredCandidates.set([]);
    }

    selectCandidate(candidateId: string) {
        const election = this.selectedElection();
        if (election) {
            this.selections.update(s => ({
                ...s,
                [election.id]: candidateId
            }));
        }
    }

    getSelectedCandidateId() {
        const election = this.selectedElection();
        return election ? (this.selections()[election.id] || null) : null;
    }

    getSelectedCandidateName() {
        const id = this.getSelectedCandidateId();
        return this.filteredCandidates().find(c => c.id === id)?.name;
    }

    getSelectionForElection(electionId: string) {
        const candidateId = this.selections()[electionId];
        if (!candidateId) return null;
        return this.allCandidates().find(c => c.id === candidateId);
    }

    castVotes() {
        const candidateIds = Object.values(this.selections());
        if (candidateIds.length === 0) return;

        this.isLoading.set(true);

        // If only 1 selection, send as single ID, otherwise as array
        const payload = candidateIds.length === 1 ? candidateIds[0] : candidateIds;

        this.electionService.submitVote(payload).subscribe({
            next: (res) => {
                this.isLoading.set(false);
                this.isSubmitted.set(true);
                alert('Your votes have been cast successfully!');
                this.router.navigate(['/results']);
            },
            error: (err) => {
                this.isLoading.set(false);
                console.error('Error submitting vote', err);
                alert(err.error?.detail || 'Failed to submit vote. You might have already voted.');
            }
        });
    }
}
