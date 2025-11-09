import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-leads',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './leads.component.html',
})
export class LeadsComponent implements OnInit {
  private readonly api = inject(ApiService);
  leads: any[] = [];

  ngOnInit(): void {
    this.api.listLeads().subscribe((leads) => (this.leads = leads as any[]));
  }
}
