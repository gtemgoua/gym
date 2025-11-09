import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-bookings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bookings.component.html',
})
export class BookingsComponent implements OnInit {
  private readonly api = inject(ApiService);
  bookings: any[] = [];

  ngOnInit(): void {
    this.api.listBookings().subscribe((bookings) => (this.bookings = bookings as any[]));
  }
}
