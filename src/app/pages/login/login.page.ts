import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ElectionService } from '../../services/election.service';
import {
    IonContent,
    IonIcon,
    IonSpinner
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
        IonIcon,
        IonSpinner
    ]
})
export class LoginPage implements OnInit {
    private router = inject(Router);
    private electionService = inject(ElectionService);
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
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]]
        });
    }

    ngOnInit() { }

    toggleTokenVisibility() {
        this.showToken = !this.showToken;
    }

    async onLogin() {
        if (this.loginForm.valid) {
            this.isLoading = true;
            const credentials = this.loginForm.value; // { email, password }

            this.electionService.login(credentials).subscribe({
                next: (response: any) => {
                    this.isLoading = false;
                    console.log('Login successful:', response);

                    if (response.access_token) {
                        localStorage.setItem('token', response.access_token);
                    }
                    localStorage.setItem('user', JSON.stringify(response));

                    this.router.navigate(['/voting']);
                },
                error: (err: any) => {
                    this.isLoading = false;
                    console.error('Login failed', err);
                    alert('Login failed. Please check your credentials.');
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
