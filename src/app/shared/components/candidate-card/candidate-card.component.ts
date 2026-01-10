import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { checkmarkCircle } from 'ionicons/icons';
import { Candidate } from '../../../models/election.model';

@Component({
    selector: 'app-candidate-card',
    standalone: true,
    imports: [CommonModule, IonIcon],
    templateUrl: './candidate-card.component.html',
})
export class CandidateCardComponent {
    candidate = input.required<Candidate>();
    selected = input<boolean>(false);
    select = output<string>();

    constructor() {
        addIcons({ checkmarkCircle });
    }

    onSelect() {
        this.select.emit(this.candidate().id);
    }
}
