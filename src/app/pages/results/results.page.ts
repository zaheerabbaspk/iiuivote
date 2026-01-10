import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { refreshOutline, shareSocialOutline, peopleOutline, trendingUpOutline, timeOutline, checkboxOutline } from 'ionicons/icons';
import { Candidate, ElectionStats } from '../../models/election.model';
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
    electionService = inject(ElectionService);
    candidates = signal<Candidate[]>([]);

    stats = signal<ElectionStats>({
        totalVotes: 0,
        voterTurnout: 0,
        eligibleVoters: 5420,
        timeRemaining: '0h 0m',
        lastUpdated: new Date().toLocaleTimeString()
    });

    totalVotesCount = computed(() => {
        return this.candidates().reduce((acc, curr) => acc + curr.votes, 0);
    });

    sortedCandidates = computed(() => {
        return [...this.candidates()].sort((a, b) => b.votes - a.votes);
    });

    constructor() {
        addIcons({ refreshOutline, shareSocialOutline, peopleOutline, trendingUpOutline, timeOutline, checkboxOutline });
    }

    ngOnInit() {
        this.loadResults();
    }

    loadResults() {
        this.electionService.getResults().subscribe({
            next: (data) => {
                const mapped = data.map((c: any) => ({
                    id: c.candidate_id.toString(),
                    name: c.name,
                    department: c.position,
                    description: c.position,
                    imageUrl: `https://i.pravatar.cc/150?u=${c.candidate_id}`,
                    votes: c.votes_count,
                    color: '#2563eb'
                }));
                this.candidates.set(mapped);

                const total = mapped.reduce((acc, curr) => acc + curr.votes, 0);
                this.stats.update(s => ({
                    ...s,
                    totalVotes: total,
                    voterTurnout: parseFloat(((total / s.eligibleVoters) * 100).toFixed(1)),
                    lastUpdated: new Date().toLocaleTimeString()
                }));
            },
            error: (err) => console.error('Error loading results', err)
        });
    }

    refreshResults() {
        this.loadResults();
    }
}
