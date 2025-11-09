import { Injectable, Signal, computed, effect, signal } from '@angular/core';
import { ApiService, LoginDto } from './api.service';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly currentUserSignal = signal<null | { id: string; name: string; email: string; role: string }>(null);
  readonly user: Signal<null | { id: string; name: string; email: string; role: string }> = this.currentUserSignal.asReadonly();
  readonly isLoggedIn = computed(() => !!this.currentUserSignal());

  constructor(private readonly api: ApiService) {
    const token = localStorage.getItem('auth_token');
    if (token) {
      this.api.fetchCurrentUser().subscribe({
        next: (user) => this.currentUserSignal.set(user),
        error: () => this.logout(),
      });
    }
  }

  login(dto: LoginDto) {
    return this.api.login(dto).pipe(
      tap((payload) => {
        localStorage.setItem('auth_token', payload.token);
        this.currentUserSignal.set(payload.user);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('auth_token');
    this.currentUserSignal.set(null);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('auth_token');
  }
}
