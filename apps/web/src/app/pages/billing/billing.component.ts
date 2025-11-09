import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-billing',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './billing.component.html',
})
export class BillingComponent implements OnInit {
  private readonly api = inject(ApiService);
  invoices: any[] = [];

  ngOnInit(): void {
    this.api.listInvoices().subscribe((invoices) => (this.invoices = invoices as any[]));
  }
}
