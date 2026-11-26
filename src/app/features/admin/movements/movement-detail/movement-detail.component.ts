import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MovementService } from '../../../../core/services/movement/movement.service';
import { DatePipe, CurrencyPipe, LowerCasePipe } from '@angular/common';

@Component({
  selector: 'app-movement-detail',
  standalone: true,
  imports: [RouterLink, DatePipe, CurrencyPipe, LowerCasePipe],
  templateUrl: './movement-detail.component.html'
})
export class MovementDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private movementService = inject(MovementService);
  
  movement: any = null;
  isLoading = true;

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.movementService.getMovementById(Number(id)).subscribe({
        next: (data) => {
          this.movement = data;
          this.isLoading = false;
        },
        error: (err) => {
          console.error(err);
          this.isLoading = false;
        }
      });
    }
  }
}