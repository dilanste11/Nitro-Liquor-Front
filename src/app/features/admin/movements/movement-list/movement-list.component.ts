import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MovementService } from '../../../../core/services/movement/movement.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-movement-list',
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: './movement-list.component.html'
})
export class MovementListComponent implements OnInit {
  private movementService = inject(MovementService);
  movements: any[] = [];
  isLoading = true;

  ngOnInit() {
    this.movementService.getMovements().subscribe({
      next: (data) => {
        this.movements = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
      }
    });
  }
}