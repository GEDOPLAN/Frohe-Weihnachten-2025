import {Component, input, output, signal} from '@angular/core';
import {Card} from "../memory.models";
import {MatCard} from "@angular/material/card";

@Component({
  selector: 'gedx2025-memory-card',
  imports: [
    MatCard
  ],
  templateUrl: './memory-card.html',
  styleUrl: './memory-card.scss',
})
export class MemoryCard {

  card = input.required<Card>();
  enabled = input<boolean>(true);
  clicked = output<void>();

  protected cardClick() {
    if(this.enabled()){
      this.clicked.emit();
    }
  }
}
