import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-members',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.css'],
})
export class MembersComponent implements OnInit {
  private readonly api = inject(ApiService);
  members: any[] = [];
  loading = true;

  ngOnInit(): void {
    this.api.listMembers().subscribe((response: any) => {
      this.members = response.items ?? [];
      this.loading = false;
    });
  }
}
