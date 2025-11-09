import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-plans',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './plans.component.html',
})
export class PlansComponent implements OnInit {
  private readonly api = inject(ApiService);
  plans: any[] = [];

  ngOnInit(): void {
    this.api.listPlans().subscribe((plans) => (this.plans = plans as any[]));
  }
}
