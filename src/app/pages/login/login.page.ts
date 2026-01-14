import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
    IonContent,
    IonButton,
    IonInput,
    IonItem,
    IonLabel,
    IonIcon,
    IonText,
    IonSpinner,
    IonInputOtp
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
    eyeOutline,
    eyeOffOutline,
    arrowForwardOutline,
    shieldCheckmarkOutline,
    personOutline,
    lockClosedOutline
} from 'ionicons/icons';
import { ElectionService } from '../../services/election.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        IonContent,
        IonButton,
        IonInput,
        IonItem,
        IonLabel,
        IonIcon,
        IonText,
        IonSpinner,
        IonInputOtp
    ]
})
export class LoginPage implements OnInit {
    private electionService = inject(ElectionService);
    private router = inject(Router);
    loginForm: FormGroup;
    showToken = false;
    isLoading = false;

    constructor(private fb: FormBuilder) {
        addIcons({
            eyeOutline,
            eyeOffOutline,
            arrowForwardOutline,
            shieldCheckmarkOutline,
            personOutline,
            lockClosedOutline
        });

        this.loginForm = this.fb.group({
            accessToken: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]]
        });
    }

    ngOnInit() { }

    toggleTokenVisibility() {
        this.showToken = !this.showToken;
    }

    async onLogin() {
        if (this.loginForm.valid) {
            this.isLoading = true;
            this.electionService.login(this.loginForm.value.accessToken).subscribe({
                next: (res: any) => {
                    this.isLoading = false;
                    if (res.status === 'success') {
                        this.router.navigate(['/voting']);
                    } else {
                        alert(res.message || 'Login failed');
                    }
                },
                error: (err: any) => {
                    this.isLoading = false;
                    console.error('Login error:', err);
                    alert(err.error?.detail || 'Invalid access token. Please try again.');
                }
            });
        } else {
            this.markFormGroupTouched(this.loginForm);
        }
    }

    // lp
    private markFormGroupTouched(formGroup: FormGroup) {
        Object.values(formGroup.controls).forEach(control => {
            control.markAsTouched();
            if ((control as any).controls) {
                this.markFormGroupTouched(control as any);
            }
        });
    }
}
