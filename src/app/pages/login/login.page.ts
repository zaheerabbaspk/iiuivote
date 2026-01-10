import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
    IonContent,
    IonButton,
    IonInput,
    IonItem,
    IonLabel,
    IonIcon,
    IonText,
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
        IonButton,
        IonInput,
        IonItem,
        IonLabel,
        IonIcon,
        IonText,
        IonSpinner
    ]
})
export class LoginPage implements OnInit {
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
            universityId: ['', [Validators.required, Validators.minLength(3)]],
            accessToken: ['', [Validators.required, Validators.minLength(6)]]
        });
    }

    ngOnInit() { }

    toggleTokenVisibility() {
        this.showToken = !this.showToken;
    }

    async onLogin() {
        if (this.loginForm.valid) {
            this.isLoading = true;
            // Simulate API call
            setTimeout(() => {
                this.isLoading = false;
                console.log('Login attempt with:', this.loginForm.value);
            }, 2000);
        } else {
            this.markFormGroupTouched(this.loginForm);
        }
    }

    private markFormGroupTouched(formGroup: FormGroup) {
        Object.values(formGroup.controls).forEach(control => {
            control.markAsTouched();
            if ((control as any).controls) {
                this.markFormGroupTouched(control as any);
            }
        });
    }
}
