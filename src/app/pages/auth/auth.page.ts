import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { ElectionService } from '../../services/election.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class AuthPage {
  router = inject(Router);
  electionService = inject(ElectionService);

  isLogin = false;
  userData = {
    full_name: '',
    email: '',
    password: ''
  };

  toggleMode() {
    this.isLogin = !this.isLogin;
  }

  onSubmit() {
    if (this.isLogin) {
      this.electionService.login({
        email: this.userData.email,
        password: this.userData.password
      }).subscribe({
        next: (res) => {
          localStorage.setItem('user', JSON.stringify(res));
          this.router.navigate(['/voting']);
        },
        error: (err) => {
          console.error('Login error', err);
          alert(err.error.detail || 'Login failed');
        }
      });
    } else {
      this.electionService.register(this.userData).subscribe({
        next: (res) => {
          alert('Registration successful! Please login.');
          this.isLogin = true;
        },
        error: (err) => {
          console.error('Registration error', err);
          alert(err.error.detail || 'Registration failed');
        }
      });
    }
  }
}
