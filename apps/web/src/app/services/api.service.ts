import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface LoginDto {
  email: string;
  password: string;
}

export interface LoginPayload {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api';

  login(dto: LoginDto): Observable<LoginPayload> {
    return this.http.post<LoginPayload>(`${this.baseUrl}/auth/login`, dto);
  }

  fetchCurrentUser(): Observable<LoginPayload['user']> {
    return this.http.get<LoginPayload['user']>(`${this.baseUrl}/auth/me`);
  }

  getTodayDashboard(): Observable<any> {
    return this.http.get(`${this.baseUrl}/analytics/dashboard/today`);
  }

  getKpiMetrics(): Observable<any> {
    return this.http.get(`${this.baseUrl}/analytics/metrics`);
  }

  listMembers(): Observable<any> {
    return this.http.get(`${this.baseUrl}/members`);
  }

  listPlans(): Observable<any> {
    return this.http.get(`${this.baseUrl}/plans`);
  }

  listClasses(): Observable<any> {
    return this.http.get(`${this.baseUrl}/classes`);
  }

  listBookings(): Observable<any> {
    return this.http.get(`${this.baseUrl}/bookings`);
  }

  listAttendance(): Observable<any> {
    return this.http.get(`${this.baseUrl}/attendance`);
  }

  listLeads(): Observable<any> {
    return this.http.get(`${this.baseUrl}/leads`);
  }

  listInvoices(): Observable<any> {
    return this.http.get(`${this.baseUrl}/billing/invoices`);
  }
}
