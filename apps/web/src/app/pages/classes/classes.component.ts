import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-classes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './classes.component.html',
})
export class ClassesComponent implements OnInit {
  private readonly api = inject(ApiService);
  classes: any[] = [];

  ngOnInit(): void {
    this.api.listClasses().subscribe((classes) => (this.classes = classes as any[]));
  }
}
