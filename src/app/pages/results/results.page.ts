import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonIcon, IonBadge } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { refreshOutline, shareSocialOutline, peopleOutline, trendingUpOutline, timeOutline, checkboxOutline, chevronDownOutline } from 'ionicons/icons';
import { Candidate, ElectionStats, ElectionResult } from '../../models/election.model';
import { ResultCardComponent } from '../../shared/components/result-card/result-card.component';
import { StatCardComponent } from '../../shared/components/stat-card/stat-card.component';
import { ElectionService } from '../../services/election.service';

@Component({
    selector: 'app-results',
    standalone: true,
    imports: [CommonModule, IonContent, IonIcon, IonBadge, ResultCardComponent, StatCardComponent],
    templateUrl: './results.page.html',
})
export class ResultsPage implements OnInit {
    private electionService = inject(ElectionService);

    allElectionResults = signal<ElectionResult[]>([]);
    selectedElectionId = signal<number | null>(null);
    lastUpdated = signal<string>(new Date().toLocaleTimeString());

    selectedElection = computed(() => {
        return this.allElectionResults().find(e => e.electionId === this.selectedElectionId());
    });

    resultsByPosition = computed(() => {
        const election = this.selectedElection();
        if (!election || !election.resultsByPosition) return [];

        return election.resultsByPosition.map(pos => ({
            name: pos.positionName,
            candidates: pos.candidates.map(c => ({
                id: Number(c.id || c.candidate_id),
                name: c.name,
                position: c.position || c.department,
                party: c.party || c.description,
                image: c.image_url || c.imageUrl || c.image,
                votes: Number(c.vote_count || c.votes || 0),
                color: c.color || this.getRandomColor()
            })).sort((a, b) => (b.votes ?? 0) - (a.votes ?? 0)),
            totalVotes: pos.candidates.reduce((acc, curr) => acc + Number(curr.vote_count || curr.votes || 0), 0)
        }));
    });

    stats = computed<ElectionStats>(() => {
        const results = this.resultsByPosition();
        // For total votes, we might want to sum all votes cast across all positions, 
        // OR just the total unique voters if that data was available. 
        // Given the payload, summing votes in the first position is usually what people mean by "Total Votes Cast" 
        // in a multi-choice election, or we sum them all. Let's sum unique votes per position for transparency.
        const total = results.reduce((acc, curr) => acc + curr.candidates.reduce((a, b) => a + (b.votes ?? 0), 0), 0);
        const eligibleVoters = 5420;

        return {
            totalVotes: results.length > 0 ? results[0].totalVotes : 0, // Showing votes from first position as representative
            voterTurnout: parseFloat((((results.length > 0 ? results[0].totalVotes : 0) / eligibleVoters) * 100).toFixed(1)),
            eligibleVoters: eligibleVoters,
            timeRemaining: 'Ended',
            lastUpdated: this.lastUpdated()
        };
    });

    totalVotesCount = computed(() => {
        const results = this.resultsByPosition();
        return results.length > 0 ? results[0].totalVotes : 0;
    });

    constructor() {
        addIcons({ refreshOutline, shareSocialOutline, peopleOutline, trendingUpOutline, timeOutline, checkboxOutline, chevronDownOutline });
    }

    ngOnInit() {
        this.loadResults();
    }

    loadResults() {
        this.electionService.getResults().subscribe({
            next: (data: ElectionResult[]) => {
                this.allElectionResults.set(data);
                this.lastUpdated.set(new Date().toLocaleTimeString());

                if (!this.selectedElectionId() && data.length > 0) {
                    this.selectedElectionId.set(data[0].electionId);
                }
            },
            error: (err) => console.error('Error loading results', err)
        });
    }

    onElectionChange(event: any) {
        this.selectedElectionId.set(Number(event.target.value));
    }

    getRandomColor() {
        const colors = ['#428cff', '#3dc2ff', '#5260ff', '#2dd36f', '#ffc409'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    refreshResults() {
        this.loadResults();
    }
}
