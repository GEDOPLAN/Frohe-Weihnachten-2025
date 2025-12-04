import {Component, inject} from '@angular/core';
import {MatCard} from "@angular/material/card";
import {MemoryCard} from "./memory-card/memory-card";
import {MemoryStore} from './memory-store';

@Component({
  selector: 'gedx2025-memory',
  imports: [
    MatCard,
    MemoryCard
  ],
  templateUrl: './memory.html',
  styleUrl: './memory.scss',
  providers: [
    MemoryStore
  ]
})
export class Memory {

  memoryStore = inject(MemoryStore);
}
