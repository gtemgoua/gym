import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-attendance',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './attendance.component.html',
})
export class AttendanceComponent implements OnInit {
  private readonly api = inject(ApiService);
  records: any[] = [];

  ngOnInit(): void {
    this.api.listAttendance().subscribe((records) => (this.records = records as any[]));
  }
}
