import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon } from '@ionic/angular/standalone';

@Component({
    selector: 'app-stat-card',
    standalone: true,
    imports: [CommonModule, IonIcon],
    templateUrl: './stat-card.component.html',
})
export class StatCardComponent {
    label = input.required<string>();
    value = input.required<string | number | null>();
    icon = input.required<string>();

    colorClass = input<string>('text-blue-600 bg-blue-50');
    dotColor = input<string>('bg-green-500');
    isLive = input<boolean>(false);
}
