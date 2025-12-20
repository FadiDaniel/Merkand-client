import { Component, Input, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-back-button',
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  template: `
    <div class="go-back" (click)="navigate()">
      <button mat-button color="primary">
        <mat-icon>arrow_back</mat-icon>
        {{ label }}
      </button>
    </div>
  `,
  styles: [`
    .go-back {
      margin: 24px;
      transition: all 0.3s ease;
      background-color: var(--merkand-gray);
      border-radius: 8px;
      width: fit-content;
      padding-right: 15px;
      display: flex;
      align-items: center;
    }

    .go-back button {
      font-size: 15px;
      pointer-events: none; 
    }

    .go-back:hover {
      cursor: pointer;
      background-color: var(--merkand-gray-light);
      transform: translateX(-5px);
    }

    mat-icon {
      margin-right: 4px;
    }
  `]
})
export class BackButtonComponent {
  private router = inject(Router);

  @Input() route: string = '/dashboard'; 
  @Input() label: string = 'Volver';

  navigate(): void {
    this.router.navigate([this.route]);
  }
}