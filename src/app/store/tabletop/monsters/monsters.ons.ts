import { on } from '@ngrx/store';
import { CatalogService } from 'services/catalog.service';
import { charactersAdapter } from '../characters/characters.adapter';
import { TabletopState } from '../tabletop.state';
import { addMonster, addMonsterStandee, drawMonsterAbilityCardsSuccess, undoAddMonster, undoAddMonsterStandee, undoDrawMonsterAbilityCards } from './monsters.actions';
import { monstersAdapter } from './monsters.adapter';

export function getMonstersOns(catalogService: CatalogService) {
  return [
    on<TabletopState, [typeof addMonster]>(addMonster, (state, { key, level }) => ({
      ...state,
      monsters: monstersAdapter.addOne({
        key,
        level,
        standees: [],
        currentAbilityCardId: null,
        drawnAbilityCardIds: []
      }, state.monsters)
    })),
    on<TabletopState, [typeof undoAddMonster]>(undoAddMonster, (state, { key }) => ({
      ...state,
      monsters: monstersAdapter.removeOne(key, state.monsters)
    })),
    on<TabletopState, [typeof addMonsterStandee]>(addMonsterStandee, (state, { key, id, rank }) => ({
      ...state,
      monsters: monstersAdapter.mapOne({
        id: key,
        map: (x) => ({
          ...x,
          standees: [
            ...x.standees,
            { id, rank, hitPoints: 5, conditions: [] }
          ]
        })
      }, state.monsters)
    })),
    on<TabletopState, [typeof undoAddMonsterStandee]>(undoAddMonsterStandee, (state, { key, id }) => ({
      ...state,
      monsters: monstersAdapter.mapOne({
        id: key,
        map: (x) => ({
          ...x,
          standees: x.standees.filter((y) => y.id !== id)
        })
      }, state.monsters)
    })),
    on<TabletopState, [typeof drawMonsterAbilityCardsSuccess]>(drawMonsterAbilityCardsSuccess, (state, { characterInitiatives, abilityCardIds }) => ({
      ...state,
      step: 'actions',
      characters: charactersAdapter.map((character) => ({
        ...character,
        initiative: characterInitiatives[character.key]
      }), state.characters),
      monsters: monstersAdapter.map((monster) => ({
        ...monster,
        currentAbilityCardId: abilityCardIds[monster.key],
        drawnAbilityCardIds: [
          ...monster.drawnAbilityCardIds,
          abilityCardIds[monster.key]
        ]
      }), state.monsters)
    })),
    on<TabletopState, [typeof undoDrawMonsterAbilityCards]>(undoDrawMonsterAbilityCards, (state, { abilityCardIds }) => ({
      ...state,
      step: 'card-selection',
      monsters: monstersAdapter.map((monster) => ({
        ...monster,
        currentAbilityCardId: abilityCardIds[monster.key].previousId,
        drawnAbilityCardIds: monster.drawnAbilityCardIds
          .filter((id) => id !== abilityCardIds[monster.key].nextId)
      }), state.monsters)
    }))
  ];
}