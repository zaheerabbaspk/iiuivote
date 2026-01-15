import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Candidate } from '../../../models/election.model';

@Component({
    selector: 'app-result-card',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './result-card.component.html',
})
export class ResultCardComponent {
    candidate = input.required<Candidate>();
    totalVotes = input.required<number>();
    rank = input<number>();

    percentage = computed(() => {
        if (this.totalVotes() === 0) return 0;
        return ((this.candidate().votes ?? 0) / this.totalVotes()) * 100;
    });
}
