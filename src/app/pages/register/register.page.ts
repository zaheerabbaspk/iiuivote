import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ElectionService } from '../../services/election.service';
import {
    IonContent,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    IonIcon,
    IonSpinner
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { personOutline, mailOutline, lockClosedOutline, eyeOutline, eyeOffOutline, logInOutline } from 'ionicons/icons';

@Component({
    selector: 'app-register',
    templateUrl: './register.page.html',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink, IonContent, IonItem, IonLabel, IonInput, IonButton, IonIcon, IonSpinner]
})
export class RegisterPage {
    private fb = inject(FormBuilder);
    private electionService = inject(ElectionService);
    private router = inject(Router);

    registerForm: FormGroup;
    isLoading = false;
    showPassword = false;

    constructor() {
        addIcons({ personOutline, mailOutline, lockClosedOutline, eyeOutline, eyeOffOutline, logInOutline });

        this.registerForm = this.fb.group({
            full_name: ['', [Validators.required, Validators.minLength(3)]],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]]
        });
    }

    togglePassword() {
        this.showPassword = !this.showPassword;
    }

    async onRegister() {
        if (this.registerForm.valid) {
            this.isLoading = true;
            this.electionService.register(this.registerForm.value).subscribe({
                next: (res: any) => {
                    this.isLoading = false;
                    alert('Registration successful! Please login.');
                    this.router.navigate(['/login']);
                },
                error: (err: any) => {
                    this.isLoading = false;
                    console.error(err);
                    alert(err.error?.detail || 'Registration failed');
                }
            });
        } else {
            this.registerForm.markAllAsTouched();
        }
    }
}
