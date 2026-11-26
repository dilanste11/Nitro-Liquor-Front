import { Component, inject, OnInit } from '@angular/core';
import { AsyncPipe, NgClass } from '@angular/common';
import { ToastMessage, UiService } from '../../../core/services/ui/ui.service';

@Component({
  selector: 'app-global-ui',
  standalone: true,
  imports: [AsyncPipe, NgClass],
  templateUrl: './global-ui.component.html'
})
export class GlobalUiComponent implements OnInit {
  uiService = inject(UiService);
  
  toasts: ToastMessage[] = [];

  ngOnInit() {
    // Escuchar nuevos Toasts y desaparecerlos después de 4 segundos
    this.uiService.toast$.subscribe(toast => {
      this.toasts.push(toast);
      setTimeout(() => {
        this.toasts.shift();
      }, 4000);
    });
  }

  removeToast(index: number) {
    this.toasts.splice(index, 1);
  }
}