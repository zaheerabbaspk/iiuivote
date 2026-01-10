import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { refreshOutline, shareSocialOutline, peopleOutline, trendingUpOutline, timeOutline, checkboxOutline } from 'ionicons/icons';
import { Candidate, ElectionStats } from '../../models/election.model';
import { ResultCardComponent } from '../../shared/components/result-card/result-card.component';
import { StatCardComponent } from '../../shared/components/stat-card/stat-card.component';

@Component({
    selector: 'app-results',
    standalone: true,
    imports: [CommonModule, IonContent, IonIcon, ResultCardComponent, StatCardComponent],
    templateUrl: './results.page.html',
})
export class ResultsPage {
    candidates = signal<Candidate[]>([
        {
            id: '1',
            name: 'Sarah Mitchell',
            department: 'Business Administration',
            description: 'Business Administration',
            imageUrl: 'https://i.pravatar.cc/150?u=sarah',
            votes: 343,
            color: '#2563eb'
        },
        {
            id: '2',
            name: 'James Chen',
            department: 'Computer Science',
            description: 'Computer Science',
            imageUrl: 'https://i.pravatar.cc/150?u=james',
            votes: 291,
            color: '#059669'
        },
        {
            id: '3',
            name: 'Aisha Patel',
            department: 'Social Sciences',
            description: 'Social Sciences',
            imageUrl: 'https://i.pravatar.cc/150?u=aisha',
            votes: 256,
            color: '#dc2626'
        }
    ]);

    stats = signal<ElectionStats>({
        totalVotes: 1090,
        voterTurnout: 20.1,
        eligibleVoters: 5420,
        timeRemaining: '0h 0m',
        lastUpdated: '17:44:08'
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

    refreshResults() {
        console.log('Refreshing results...');
        // Logic to refresh data
    }
}
