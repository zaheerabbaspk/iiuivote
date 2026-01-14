import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { refreshOutline, shareSocialOutline, peopleOutline, trendingUpOutline, timeOutline, checkboxOutline, chevronDownOutline } from 'ionicons/icons';
import { Candidate, ElectionStats, ElectionResult } from '../../models/election.model';
import { ResultCardComponent } from '../../shared/components/result-card/result-card.component';
import { StatCardComponent } from '../../shared/components/stat-card/stat-card.component';
import { ElectionService } from '../../services/election.service';

@Component({
    selector: 'app-results',
    standalone: true,
    imports: [CommonModule, IonContent, IonIcon, ResultCardComponent, StatCardComponent],
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

    candidates = computed<Candidate[]>(() => {
        const election = this.selectedElection();
        if (!election) return [];

        return election.candidates.map(c => ({
            id: (c.id || c.candidate_id)?.toString(),
            name: c.name,
            department: c.position || c.department,
            description: c.party || c.description,
            imageUrl: c.image_url || c.imageUrl || c.image,
            votes: Number(c.vote_count || c.votes || 0),
            color: c.color || this.getRandomColor(),
            election_id: (c.election_id || election.electionId).toString()
        }));
    });

    stats = computed<ElectionStats>(() => {
        const mappedCandidates = this.candidates();
        const total = mappedCandidates.reduce((acc, curr) => acc + curr.votes, 0);
        const eligibleVoters = 5420;

        return {
            totalVotes: total,
            voterTurnout: parseFloat(((total / eligibleVoters) * 100).toFixed(1)),
            eligibleVoters: eligibleVoters,
            timeRemaining: '0h 0m',
            lastUpdated: this.lastUpdated()
        };
    });

    totalVotesCount = computed(() => {
        return this.candidates().reduce((acc, curr) => acc + curr.votes, 0);
    });

    sortedCandidates = computed(() => {
        return [...this.candidates()].sort((a, b) => b.votes - a.votes);
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
