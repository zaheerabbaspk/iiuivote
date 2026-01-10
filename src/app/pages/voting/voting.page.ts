import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBack, arrowForward } from 'ionicons/icons';
import { Candidate } from '../../models/election.model';
import { CandidateCardComponent } from '../../shared/components/candidate-card/candidate-card.component';
import { Router } from '@angular/router';

@Component({
    selector: 'app-voting',
    standalone: true,
    imports: [CommonModule, IonContent, IonIcon, CandidateCardComponent],
    templateUrl: './voting.page.html',
})
export class VotingPage {
    router = inject(Router);
    candidates = signal<Candidate[]>([
        {
            id: '1',
            name: 'Sarah Mitchell',
            department: 'Business Administration',
            description: 'Committed to enhancing student welfare, improving campus facilities, and fostering a more inclusive university environment.',
            imageUrl: 'https://i.pravatar.cc/150?u=sarah',
            votes: 343,
            color: '#2563eb'
        },
        {
            id: '2',
            name: 'James Chen',
            department: 'Computer Science',
            description: 'Focused on mental health support, sustainable campus initiatives, and stronger industry partnerships for better career opportunities.',
            imageUrl: 'https://i.pravatar.cc/150?u=james',
            votes: 291,
            color: '#059669'
        },
        {
            id: '3',
            name: 'Aisha Patel',
            department: 'Social Sciences',
            description: 'Advocating for affordable education, improved study spaces, and a vibrant cultural exchange program across all departments.',
            imageUrl: 'https://i.pravatar.cc/150?u=aisha',
            votes: 256,
            color: '#dc2626'
        }
    ]);

    selectedId = signal<string | null>(null);

    constructor() {
        addIcons({ arrowBack, arrowForward });
    }

    selectCandidate(id: string) {
        this.selectedId.set(id);
    }

    getSelectedCandidate() {
        return this.candidates().find(c => c.id === this.selectedId());
    }

    castVote() {
        if (this.selectedId()) {
            console.log('Casting vote for:', this.selectedId());
            // Logic for casting vote
            this.router.navigate(['/results']);
        }
    }
}
