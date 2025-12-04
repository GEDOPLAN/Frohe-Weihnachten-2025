import {Component, computed, effect, linkedSignal, signal} from '@angular/core';
import cardModels from './cards.json';
import {MatCard} from "@angular/material/card";
import {Card} from "./memory.models";
import {MemoryCard} from "./memory-card/memory-card";
import * as _ from "underscore";

@Component({
    selector: 'gedx2025-memory',
    imports: [
        MatCard,
        MemoryCard
    ],
    templateUrl: './memory.html',
    styleUrl: './memory.scss',
})
export class Memory {

    cards = signal<Card[]>(cardModels as Card[])
    allCards = computed(() => _.shuffle(
        this.cards()
            .map(c => ([c, {...c}])).flat())
    )
    cardsInGame = linkedSignal(() => this.allCards());

    gameCompleted = computed(() => this.cardsInGame().every(c => c.open));
    currentMoveOpenedCards = signal<Card[]>([]);
    boardDisabled = computed(() => this.currentMoveOpenedCards().length === 2);

    constructor() {
        effect(() => {
            if (this.currentMoveOpenedCards().length === 2) {
                if (this.currentMoveOpenedCards()[0].identifier !== this.currentMoveOpenedCards()[1].identifier) {
                    setTimeout(() => {
                        this.currentMoveOpenedCards().forEach(c => this.updateCardState(c, false));
                        this.currentMoveOpenedCards.set([]);
                    }, 2000)
                } else{
                    this.currentMoveOpenedCards.set([]);
                }
            }
        });
    }


    protected toggleCard(c: Card) {
        if (!c.open && this.currentMoveOpenedCards().length < 2) {
            this.updateCardState(c, true);
            this.currentMoveOpenedCards.update(current => [c, ...current]);
        }
    }

    private updateCardState(card: Card, open: boolean) {
        card.open = open;
        this.cardsInGame.update(cards => [...cards]);
    }
}
