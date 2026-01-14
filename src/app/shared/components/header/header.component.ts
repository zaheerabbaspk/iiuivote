import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { IonHeader, IonToolbar, IonIcon, IonButton } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { statsChartOutline, fingerPrintOutline, logOutOutline } from 'ionicons/icons';

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [
        CommonModule,
        RouterLink,
        RouterLinkActive,
        IonHeader,
        IonToolbar,
        IonIcon,
        IonButton
    ],
    templateUrl: './header.component.html',
})
export class HeaderComponent {
    private router = inject(Router);

    constructor() {
        addIcons({ statsChartOutline, fingerPrintOutline, logOutOutline });
    }

    logout() {
        localStorage.removeItem('user');
        this.router.navigate(['/login']);
    }
}
