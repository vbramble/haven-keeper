import { Action, ActionReducer } from '@ngrx/store';
import { Character } from 'models/character';
import { MonsterAbilityDeck } from 'models/monster-ability-deck';
import { MonsterStandee } from 'models/monster-set';
import { AppState } from 'store/app.state';
import {
  addCharacter,
  undoAddCharacter,
  undoUpdateCharacter,
  updateCharacter
} from 'store/tabletop/characters/characters.actions';
import {
  drawMonsterAbilityCardSuccess,
  drawMonsterAbilityCardsSuccess,
  undoDrawMonsterAbilityCards,
  undoDrawMonsterAbilityCard
} from 'store/tabletop/monster-ability-decks/monster-ability-decks.actions';
import {
  addMonster,
  addMonsterStandee,
  removeMonsterStandee,
  undoAddMonster,
  undoAddMonsterStandee,
  undoRemoveMonsterStandee,
  undoUpdateMonsterStandee,
  updateMonsterStandee,
} from 'store/tabletop/monsters/monsters.actions';
import {
  clearTabletop,
  infuseElement,
  nextRound,
  setScenarioLevel,
  undoClearTabletop,
  undoInfuseElement,
  undoNextRound,
  undoSetScenarioLevel
} from 'store/tabletop/tabletop.actions';

const trackActionTypes: string[] = [
  addCharacter.type,
  updateCharacter.type,
  addMonster.type,
  addMonsterStandee.type,
  updateMonsterStandee.type,
  removeMonsterStandee.type,
  drawMonsterAbilityCardsSuccess.type,
  drawMonsterAbilityCardSuccess.type,
  infuseElement.type,
  setScenarioLevel.type,
  nextRound.type,
  clearTabletop.type
];

type ReversibleAction =
  | ReturnType<typeof addCharacter>
  | ReturnType<typeof updateCharacter>
  | ReturnType<typeof addMonster>
  | ReturnType<typeof addMonsterStandee>
  | ReturnType<typeof updateMonsterStandee>
  | ReturnType<typeof removeMonsterStandee>
  | ReturnType<typeof drawMonsterAbilityCardsSuccess>
  | ReturnType<typeof drawMonsterAbilityCardSuccess>
  | ReturnType<typeof infuseElement>
  | ReturnType<typeof setScenarioLevel>
  | ReturnType<typeof nextRound>
  | ReturnType<typeof clearTabletop>;

function getReverseAction(state: AppState, action: ReversibleAction): Action {
  switch (action.type) {
    case addCharacter.type:
      return undoAddCharacter({ key: action.key });
    case updateCharacter.type:
      const updateCharacterTarget = state.tabletop.characters.entities[action.key];
      return undoUpdateCharacter({
        key: action.key,
        previousHitPoints: updateCharacterTarget?.hitPoints ?? 0,
        previousConditions: updateCharacterTarget?.conditions ?? []
      });
    case addMonster.type:
      return undoAddMonster({ key: action.key });
    case addMonsterStandee.type:
      return undoAddMonsterStandee({ key: action.key, id: action.id });
    case updateMonsterStandee.type:
      const updateStandeeTarget = state.tabletop.monsters.entities[action.key]
        ?.standees
        .find(x => x.id === action.id);
      return undoUpdateMonsterStandee({
        key: action.key,
        id: action.id,
        previousHitPoints: updateStandeeTarget?.hitPoints ?? 0,
        previousConditions: updateStandeeTarget?.conditions ?? []
      });
    case removeMonsterStandee.type:
      const removeStandeeTarget = state.tabletop.monsters.entities[action.key]
        ?.standees
        .find(x => x.id === action.id) as MonsterStandee;
      return undoRemoveMonsterStandee({
        key: action.key,
        ...removeStandeeTarget
      });
    case drawMonsterAbilityCardsSuccess.type:
      return undoDrawMonsterAbilityCards({
        abilityCardIds: Object.entries(action.abilityCardIds)
          .reduce(
            (acc, [key, id]): { [key: string]: { previousId: number | null, nextId: number } } => ({
              ...acc,
              [key]: {
                previousId: state.tabletop.monsterAbilityDecks.entities[key]?.currentAbilityCardId,
                nextId: id
              }
            }),
            { }
          )
      });
    case drawMonsterAbilityCardSuccess.type:
      return undoDrawMonsterAbilityCard({
        key: action.key,
        cardId: action.cardId
      });
    case infuseElement.type:
      return undoInfuseElement({ element: action.element });
    case setScenarioLevel.type:
      return undoSetScenarioLevel({ previousLevel: state.tabletop.level });
    case nextRound.type:
      return undoNextRound({
        elementalInfusion: { ...state.tabletop.elementalInfusion },
        characterInitiatives: Object.values(state.tabletop.characters.entities)
          .filter((character): character is Character => Boolean(character))
          .reduce(
            (acc, character): { [key: string]: number } => ({
              ...acc,
              [character.key]: character.initiative
            }),
            { }
          ),
        abilityCardIds: Object.values(state.tabletop.monsterAbilityDecks.entities)
          .filter((monsterAbilityDeck): monsterAbilityDeck is MonsterAbilityDeck => Boolean(monsterAbilityDeck))
          .reduce(
            (acc, monsterAbilityDeck): { [key: string]: number } => ({
              ...acc,
              [monsterAbilityDeck.key]: monsterAbilityDeck.currentAbilityCardId
            }),
            { }
          ),
        drawnAbilityCardIds: Object.values(state.tabletop.monsterAbilityDecks.entities)
          .filter((monsterAbilityDeck): monsterAbilityDeck is MonsterAbilityDeck => Boolean(monsterAbilityDeck))
          .reduce(
            (acc, monsterAbilityDeck): { [key: string]: number } => ({
              ...acc,
              [monsterAbilityDeck.key]: monsterAbilityDeck.drawnAbilityCardIds
            }),
            { }
          )
      });
    case clearTabletop.type:
      return undoClearTabletop({ oldState: { ...state.tabletop } });
  }
  // throw `Unexpected Action: '${action.type}`;
}

function logPast(nextReducer: ActionReducer<AppState>): ActionReducer<AppState> {
  return function(state, action) {
    if (!state || !trackActionTypes.includes(action.type)) {
      return nextReducer(state, action);
    }
    return nextReducer(
      {
        ...state,
        timeMachine: {
          ...state.timeMachine,
          past: [
            ...state.timeMachine.past,
            { originalAction: action, reverseAction: getReverseAction(state, action as ReversibleAction) }
          ],
          future: []
        }
      },
      action
    );
  };
}

export const timeMachineMetaReducers = [logPast];
