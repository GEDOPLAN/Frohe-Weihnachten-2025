import {patchState, signalStore, withComputed, withHooks, withMethods, withState} from '@ngrx/signals';
import * as _ from 'underscore';
import {Card} from './memory.models';
import {addEntities, updateEntity, withEntities} from '@ngrx/signals/entities';
import {effect} from '@angular/core';
import cardModels from './cards.json';
import {withDevtools} from '@angular-architects/ngrx-toolkit';
import {withEffects} from '@ngrx/signals/events';

const initialState = {
  currentMove: [] as Card[],
}

export const MemoryStore = signalStore(
  withDevtools('memory'),
  withState(initialState),
  withEntities<Card>(),
  withMethods((store) => ({
    openCard: (card: Card) => {
      patchState(store, updateEntity({id: card.id, changes: {open: true}}));
      patchState(store, ({currentMove}) => ({currentMove: [
        ...currentMove,
          store.entityMap()[card.id]
        ]}));
    },
    _closeCard: (card: Card) => {
      patchState(store, updateEntity({id: card.id, changes: {open: false}}));
      patchState(store, ({currentMove}) => ({currentMove: currentMove.filter(c => c.id !== card.id)}));
    }
  })),
  withComputed((store) => ({
    gameComplete: () => store.entities().every(c => c.open),
  })),
  withComputed((store) => ({
    boardDisabled: () => store.currentMove().length == 2 || store.gameComplete(),
  })),
  withHooks(({
    onInit(store) {
      const cardsInGame = _.shuffle((cardModels as Card[])
        .map(c => {
          const cardB = {...c};
          cardB.id = _.uniqueId();
          c.id = _.uniqueId();
          return [c, cardB];
        })
        .flat())

      patchState(store, addEntities(cardsInGame))

      effect(() => {
        const {currentMove} = store;
        if (currentMove().length == 2) {
          const match = currentMove()[0].identifier === currentMove()[1].identifier;
          setTimeout(() => {
            if (!match) {
              currentMove().forEach(card => store._closeCard(card));
            }
            patchState(store, () => ({currentMove: []}));
          }, match ? 0 : 1000);
        }
      });
    }
  }))
)
