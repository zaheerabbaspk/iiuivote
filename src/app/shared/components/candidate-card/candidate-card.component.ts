import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { checkmarkCircle, personCircleOutline } from 'ionicons/icons';
import { Candidate } from '../../../models/election.model';
import { SafeUrlPipe } from '../../pipes/safe-url.pipe';

@Component({
    selector: 'app-candidate-card',
    standalone: true,
    imports: [CommonModule, IonIcon, SafeUrlPipe],
    templateUrl: './candidate-card.component.html',
})
export class CandidateCardComponent {
    candidate = input.required<Candidate>();
    selected = input<boolean>(false);
    select = output<string>();

    constructor() {
        addIcons({ checkmarkCircle, personCircleOutline });
    }

    onSelect() {
        this.select.emit(this.candidate().id);
    }
}
