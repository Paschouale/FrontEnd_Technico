import { Component, OnInit, Renderer2 } from '@angular/core';
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
export class LoginComponent implements OnInit {
  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(3)]),
    password: new FormControl('', [Validators.required, Validators.minLength(4)]),
    rememberMe: new FormControl(false)
  });

  errorMessage: string | null = null;
  isLoading: boolean = false;
  hidePassword: boolean = true;

  // Define background icons
  backgroundIcons = [
    { class: 'bi bi-house' },
    { class: 'bi bi-tools' },
    { class: 'bi bi-building' },
    { class: 'bi bi-wrench' },
    { class: 'bi bi-geo-alt' },
    { class: 'bi bi-gear' },
    { class: 'bi bi-house-add' },
    { class: 'bi bi-house' },
    { class: 'bi bi-tools' },
    { class: 'bi bi-building' },
    { class: 'bi bi-wrench' },
    { class: 'bi bi-geo-alt' },
    { class: 'bi bi-gear' },
    { class: 'bi bi-house-add' },
    { class: 'bi bi-cup-straw' },
  ];

  private draggingIcon: HTMLElement | null = null;
  private offsetX: number = 0;
  private offsetY: number = 0;

  constructor(
    private http: HttpClient,
    private router: Router,
    private userService: UserService,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    // Load remembered username if available
    const rememberedUsername = localStorage.getItem('rememberedUsername');
    if (rememberedUsername) {
      this.loginForm.patchValue({
        username: rememberedUsername,
        rememberMe: true
      });
    }
  }

  onLogin(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = null;

      const loginData = {
        username: this.loginForm.value.username,
        password: this.loginForm.value.password
      };

      this.http.post<LoginResponse>('http://localhost:8080/api/login', loginData)
        .subscribe({
          next: (res) => {
            this.isLoading = false;
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

            // Handle Remember Me
            if (this.loginForm.value.rememberMe) {
              localStorage.setItem('rememberedUsername', res.username);
              // Implement additional logic as needed, such as storing tokens
            } else {
              localStorage.removeItem('rememberedUsername');
            }
          },
          error: (err) => {
            console.error('Login error', err);
            this.isLoading = false;
            this.errorMessage = "Invalid login credentials.";
          }
        });
    } else {
      this.errorMessage = "Please fill in all required fields correctly.";
    }
  }

  /**
   * Triggers the bounce animation on the clicked icon.
   * @param event The click event.
   */
  triggerBounce(event: Event): void {
    const target = event.target as HTMLElement | null;
    if (!target || target.tagName.toLowerCase() !== 'i') return; // Ensure the clicked element is an <i> element

    target.classList.add('bounce');

    // Remove the 'bounce' class after animation ends to allow re-triggering
    target.addEventListener('animationend', () => {
      target.classList.remove('bounce');
    }, { once: true });
  }

  /**
   * Handles the mousedown event to start dragging.
   * @param event The mouse event.
   */
  onDragStart(event: MouseEvent): void {
    event.preventDefault();
    const target = event.target as HTMLElement | null;

    if (!target || target.tagName.toLowerCase() !== 'i') return; // Ensure the target is an <i> element

    this.draggingIcon = target;
    this.offsetX = event.clientX - target.getBoundingClientRect().left;
    this.offsetY = event.clientY - target.getBoundingClientRect().top;

    // Temporarily disable animation
    this.renderer.setStyle(this.draggingIcon, 'animation', 'none');
    this.renderer.setStyle(this.draggingIcon, 'transition', 'none');

    // Add event listeners for dragging
    this.renderer.listen('document', 'mousemove', this.onDragMove.bind(this));
    this.renderer.listen('document', 'mouseup', this.onDragEnd.bind(this));
  }

  /**
   * Handles the touchstart event to start dragging.
   * @param event The touch event.
   */
  onTouchStart(event: TouchEvent): void {
    event.preventDefault();
    const touch = event.touches[0];
    const target = touch.target as HTMLElement | null;

    if (!target || target.tagName.toLowerCase() !== 'i') return; // Ensure the target is an <i> element

    this.draggingIcon = target;
    this.offsetX = touch.clientX - target.getBoundingClientRect().left;
    this.offsetY = touch.clientY - target.getBoundingClientRect().top;

    // Temporarily disable animation
    this.renderer.setStyle(this.draggingIcon, 'animation', 'none');
    this.renderer.setStyle(this.draggingIcon, 'transition', 'none');

    // Add event listeners for dragging
    this.renderer.listen('document', 'touchmove', this.onTouchMove.bind(this));
    this.renderer.listen('document', 'touchend', this.onTouchEnd.bind(this));
  }

  /**
   * Handles the mousemove event to drag the icon.
   * @param event The mouse event.
   */
  onDragMove(event: MouseEvent): void {
    if (!this.draggingIcon) return;

    const newLeft = event.clientX - this.offsetX;
    const newTop = event.clientY - this.offsetY;

    // Constrain within viewport
    const clampedLeft = Math.max(0, Math.min(newLeft, window.innerWidth - this.draggingIcon.offsetWidth));
    const clampedTop = Math.max(0, Math.min(newTop, window.innerHeight - this.draggingIcon.offsetHeight));

    this.renderer.setStyle(this.draggingIcon, 'left', `${clampedLeft}px`);
    this.renderer.setStyle(this.draggingIcon, 'top', `${clampedTop}px`);
    this.renderer.setStyle(this.draggingIcon, 'transform', 'translate(0, 0)');
  }

  /**
   * Handles the touchmove event to drag the icon.
   * @param event The touch event.
   */
  onTouchMove(event: TouchEvent): void {
    if (!this.draggingIcon) return;
    const touch = event.touches[0];

    const newLeft = touch.clientX - this.offsetX;
    const newTop = touch.clientY - this.offsetY;

    // Constrain within viewport
    const clampedLeft = Math.max(0, Math.min(newLeft, window.innerWidth - this.draggingIcon.offsetWidth));
    const clampedTop = Math.max(0, Math.min(newTop, window.innerHeight - this.draggingIcon.offsetHeight));

    this.renderer.setStyle(this.draggingIcon, 'left', `${clampedLeft}px`);
    this.renderer.setStyle(this.draggingIcon, 'top', `${clampedTop}px`);
    this.renderer.setStyle(this.draggingIcon, 'transform', 'translate(0, 0)');
  }

  /**
   * Handles the mouseup event to end dragging.
   * @param event The mouse event.
   */
  onDragEnd(event: MouseEvent): void {
    if (!this.draggingIcon) return;

    // Re-enable animation
    this.renderer.setStyle(this.draggingIcon, 'animation', '');
    this.renderer.setStyle(this.draggingIcon, 'transition', 'transform 0.3s, color 0.3s');

    this.draggingIcon = null;
  }

  /**
   * Handles the touchend event to end dragging.
   * @param event The touch event.
   */
  onTouchEnd(event: TouchEvent): void {
    if (!this.draggingIcon) return;

    // Re-enable animation
    this.renderer.setStyle(this.draggingIcon, 'animation', '');
    this.renderer.setStyle(this.draggingIcon, 'transition', 'transform 0.3s, color 0.3s');

    this.draggingIcon = null;
  }

  /**
   * Toggles the visibility of the password input.
   */
  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  }