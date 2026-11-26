import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GlobalUiComponent } from './shared/components/global-ui/global-ui.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, GlobalUiComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'nitro-liquor-frontend';
}
