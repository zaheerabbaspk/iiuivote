import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IonHeader, IonToolbar, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { statsChartOutline, fingerPrintOutline } from 'ionicons/icons';

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [CommonModule, RouterLink, RouterLinkActive, IonHeader, IonToolbar, IonIcon],
    templateUrl: './header.component.html',
})
export class HeaderComponent {
    constructor() {
        addIcons({ statsChartOutline, fingerPrintOutline });
    }
}
