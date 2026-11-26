import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

export interface ToastMessage {
  message: string;
  type: 'success' | 'error';
}

@Injectable({ providedIn: 'root' })
export class UiService {
  private activeRequests = 0;
  
  // Estado del Spinner
  isLoading$ = new BehaviorSubject<boolean>(false);
  // Estado del Toast
  toast$ = new Subject<ToastMessage>();

  showLoading() {
    this.activeRequests++;
    this.isLoading$.next(true);
  }

  hideLoading() {
    this.activeRequests = Math.max(0, this.activeRequests - 1);
    if (this.activeRequests === 0) {
      this.isLoading$.next(false);
    }
  }

  showToast(message: string, type: 'success' | 'error' = 'error') {
    this.toast$.next({ message, type });
  }
}