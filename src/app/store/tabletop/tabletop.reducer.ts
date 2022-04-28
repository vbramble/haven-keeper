import { createReducer, on } from '@ngrx/store';
import { ElementalInfusion } from 'models/element';
import { CatalogService } from 'services/catalog.service';
import { charactersAdapter } from './characters/characters.adapter';
import { getCharactersOns } from './characters/characters.ons';
import { monstersAdapter } from './monsters/monsters.adapter';
import { getMonstersOns } from './monsters/monsters.ons';
import {
  infuseElement, 
  nextRound, 
  undoInfuseElement,
  undoNextRound
} from './tabletop.actions';
import { TabletopState } from './tabletop.state';

export const initialTabletopState: TabletopState = {
  step: 'card-selection',
  round: 1,
  elementalInfusion: {
    'fire': 'inert',
    'ice': 'inert',
    'air': 'inert',
    'earth': 'inert',
    'light': 'inert',
    'dark': 'inert'
  },
  characters: charactersAdapter.getInitialState(),
  monsters: monstersAdapter.getInitialState()
};

export function getTabletopReducer(catalogService: CatalogService) {
  return createReducer<TabletopState>(
    initialTabletopState,
    ...getCharactersOns(catalogService),
    ...getMonstersOns(catalogService),
    on(infuseElement, (state, { element }) => ({
      ...state,
      elementalInfusion: {
        ...state.elementalInfusion,
        [element]: ((startingInfusion: ElementalInfusion): ElementalInfusion => {
          switch (startingInfusion) {
            case 'strong':
              return 'waning';
            case 'waning':
              return 'inert';
            case 'inert':
              return 'strong';
          }
        })(state.elementalInfusion[element])
      }
    })),
    on(undoInfuseElement, (state, { element }) => ({
      ...state,
      elementalInfusion: {
        ...state.elementalInfusion,
        [element]: ((startingInfusion: ElementalInfusion): ElementalInfusion => {
          switch (startingInfusion) {
            case 'strong':
              return 'inert';
            case 'waning':
              return 'strong';
            case 'inert':
              return 'waning';
          }
        })(state.elementalInfusion[element])
      }
    })),
    on(nextRound, (state) => ({
      ...state,
      step: 'card-selection',
      round: state.round + 1,
      elementalInfusion: {
        'fire': state.elementalInfusion['fire'] === 'strong' ? 'waning' : 'inert',
        'ice': state.elementalInfusion['ice'] === 'strong' ? 'waning' : 'inert',
        'air': state.elementalInfusion['air'] === 'strong' ? 'waning' : 'inert',
        'earth': state.elementalInfusion['earth'] === 'strong' ? 'waning' : 'inert',
        'light': state.elementalInfusion['light'] === 'strong' ? 'waning' : 'inert',
        'dark': state.elementalInfusion['dark'] === 'strong' ? 'waning' : 'inert'
      },
      characters: charactersAdapter.map((character) => ({
        ...character,
        initiative: null
      }), state.characters),
      monsters: monstersAdapter.map((monster) => ({
        ...monster,
        currentAbilityCardId: null
      }), state.monsters)
    })),
    on(undoNextRound, (state, { elementalInfusion, characterInitiatives, abilityCardIds }) => ({
      ...state,
      step: 'actions',
      round: state.round - 1,
      elementalInfusion: { ...elementalInfusion },
      characters: charactersAdapter.map((character) => ({
        ...character,
        initiative: characterInitiatives[character.key]
      }), state.characters),
      monsters: monstersAdapter.map((monster) => ({
        ...monster,
        currentAbilityCardId: abilityCardIds[monster.key]
      }), state.monsters)
    }))
  );
}
