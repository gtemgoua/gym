import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { ShellComponent } from './pages/shell/shell.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { MembersComponent } from './pages/members/members.component';
import { PlansComponent } from './pages/plans/plans.component';
import { ClassesComponent } from './pages/classes/classes.component';
import { AttendanceComponent } from './pages/attendance/attendance.component';
import { BookingsComponent } from './pages/bookings/bookings.component';
import { LeadsComponent } from './pages/leads/leads.component';
import { BillingComponent } from './pages/billing/billing.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: ShellComponent,
    canActivateChild: [AuthGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'members', component: MembersComponent },
      { path: 'plans', component: PlansComponent },
      { path: 'classes', component: ClassesComponent },
      { path: 'bookings', component: BookingsComponent },
      { path: 'attendance', component: AttendanceComponent },
      { path: 'leads', component: LeadsComponent },
      { path: 'billing', component: BillingComponent }
    ],
  },
  { path: '**', redirectTo: 'dashboard' }
];
