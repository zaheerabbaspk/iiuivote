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

    // Track selections: { "electionId_position": candidateId }
    selections = signal<Record<string, number>>({});

    isLoading = signal<boolean>(false);
    isSubmitted = signal<boolean>(false);

    // Derived signal for grouped candidates
    candidatesByPosition = computed(() => {
        const election = this.selectedElection();
        if (!election) return [];

        return election.positions.map(pos => ({
            name: pos,
            candidates: election.candidates.filter(c => c.position === pos)
        }));
    });

    // Total selections across all elections/positions
    selectionCount = computed(() => Object.keys(this.selections()).length);

    constructor() {
        addIcons({ arrowBack, arrowForward, checkmarkCircle, listOutline, personOutline, chevronForwardOutline, schoolOutline });
    }

    selectElection(election: Election) {
        if (this.isSubmitted()) return;
        this.selectedElection.set(election);
        this.filteredCandidates.set(election.candidates);
    }

    clearSelection() {
        this.selectedElection.set(null);
        this.filteredCandidates.set([]);
    }

    selectCandidate(candidate: Candidate) {
        const election = this.selectedElection();
        if (election) {
            this.selections.update(s => ({
                ...s,
                [`${election.id}_${candidate.position}`]: candidate.id
            }));
        }
    }

    isCandidateSelected(candidate: Candidate): boolean {
        const election = this.selectedElection();
        if (!election) return false;
        return this.selections()[`${election.id}_${candidate.position}`] === candidate.id;
    }

    getSelectedCandidateName(position: string) {
        const election = this.selectedElection();
        if (!election) return null;
        const candidateId = this.selections()[`${election.id}_${position}`];
        return election.candidates.find(c => c.id === candidateId)?.name;
    }

    getSelectionCountForElection(electionId: number): number {
        return Object.keys(this.selections()).filter(key => key.startsWith(`${electionId}_`)).length;
    }

    hasSelectionsForElection(electionId: number): boolean {
        return this.getSelectionCountForElection(electionId) > 0;
    }

    castVotes() {
        const candidateIds = Object.values(this.selections());
        if (candidateIds.length === 0) return;

        this.isLoading.set(true);

        this.electionService.submitVote(candidateIds).subscribe({
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
