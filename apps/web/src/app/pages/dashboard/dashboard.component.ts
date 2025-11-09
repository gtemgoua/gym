import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  private readonly api = inject(ApiService);

  isLoading = true;
  today: any;
  metrics: any;

  ngOnInit(): void {
    this.load();
  }

  private load(): void {
    this.isLoading = true;
    this.api.getTodayDashboard().subscribe((data) => {
      this.today = data;
    });
    this.api.getKpiMetrics().subscribe((data) => {
      this.metrics = data;
      this.isLoading = false;
    });
  }
}
