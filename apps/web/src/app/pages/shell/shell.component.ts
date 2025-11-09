import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

const NAV = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Members', path: '/members' },
  { label: 'Plans', path: '/plans' },
  { label: 'Classes', path: '/classes' },
  { label: 'Bookings', path: '/bookings' },
  { label: 'Attendance', path: '/attendance' },
  { label: 'Leads', path: '/leads' },
  { label: 'Billing', path: '/billing' }
];

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.css'],
})
export class ShellComponent {
  private readonly auth = inject(AuthService);
  readonly user = this.auth.user;
  readonly nav = NAV;

  signOut(): void {
    this.auth.logout();
    location.assign('/login');
  }
}
