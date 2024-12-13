// import { Component } from '@angular/core';
// import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
// import { HttpClient } from '@angular/common/http';
// import { Router } from '@angular/router';
// import { CommonModule } from '@angular/common';

// interface LoginResponse {
//   id: number;
//   username: string;
//   role: 'ADMIN' | 'PROPERTY_OWNER';
//   propertyOwnerId?: number;
// }

// @Component({
//   selector: 'app-login',
//   standalone: true,
//   imports: [CommonModule, ReactiveFormsModule, FormsModule],
//   templateUrl: './login.component.html',
//   styleUrls: ['./login.component.scss']
// })
// export class LoginComponent {
//   loginForm = new FormGroup({
//     username: new FormControl('', Validators.required),
//     password: new FormControl('', Validators.required),
//   });

//   errorMessage: string | null = null;

//   constructor(private http: HttpClient, private router: Router) {}

//   onLogin() {
//     if (this.loginForm.valid) {
//       this.http.post<LoginResponse>('http://localhost:8080/api/login', this.loginForm.value)
//         .subscribe({
//           next: (res) => {
//             localStorage.setItem('user', JSON.stringify(res));
//             if (res.role === 'ADMIN') {
//               this.router.navigate(['/admin-home']);
//             } else {
//               this.router.navigate(['/owner-home']);
//             }
//           },
//           error: (err) => {
//             console.error('Login error', err);
//             this.errorMessage = "Invalid login credentials.";
//           }
//         });
//     }
//   }
// }
// src/app/auth/login/login.component.ts

import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { User, UserService } from '../shared/services/user.service';





interface LoginResponse {
  id: number;
  username: string;
  role: 'ADMIN' | 'PROPERTY_OWNER';
  propertyOwnerId?: number;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

  errorMessage: string | null = null;

  constructor(
    private http: HttpClient,
    private router: Router,
    private userService: UserService
  ) {}

  onLogin() {
    if (this.loginForm.valid) {
      this.http.post<LoginResponse>('http://localhost:8080/api/login', this.loginForm.value)
        .subscribe({
          next: (res) => {
            const user: User = {
              id: res.id,
              username: res.username,
              role: res.role,
              propertyOwnerId: res.propertyOwnerId,
            };
            this.userService.setUser(user);
            if (res.role === 'ADMIN') {
              this.router.navigate(['/admin-home']);
            } else {
              this.router.navigate(['/owner-home']);
            }
          },
          error: (err) => {
            console.error('Login error', err);
            this.errorMessage = "Invalid login credentials.";
          }
        });
    }
  }
}
