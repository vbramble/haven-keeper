import { Action, ActionReducer } from '@ngrx/store';
import { Character } from 'models/character';
import { MonsterSet } from 'models/monster-set';
import { AppState } from 'store/app.state';
import { addCharacter, undoAddCharacter } from 'store/tabletop/characters/characters.actions';
import {
  addMonster,
  addMonsterStandee,
  drawMonsterAbilityCardsSuccess,
  undoAddMonster,
  undoAddMonsterStandee,
  undoDrawMonsterAbilityCards
} from 'store/tabletop/monsters/monsters.actions';
import {
  clearTabletop,
  infuseElement,
  nextRound,
  undoClearTabletop,
  undoInfuseElement,
  undoNextRound
} from 'store/tabletop/tabletop.actions';

const trackActionTypes: string[] = [
  addCharacter.type,
  addMonster.type,
  addMonsterStandee.type,
  drawMonsterAbilityCardsSuccess.type,
  infuseElement.type,
  nextRound.type,
  clearTabletop.type
];

type ReversibleAction =
  | ReturnType<typeof addCharacter>
  | ReturnType<typeof addMonster>
  | ReturnType<typeof addMonsterStandee>
  | ReturnType<typeof drawMonsterAbilityCardsSuccess>
  | ReturnType<typeof infuseElement>
  | ReturnType<typeof nextRound>
  | ReturnType<typeof clearTabletop>;

function getReverseAction(state: AppState, action: ReversibleAction): Action {
  switch (action.type) {
    case addCharacter.type:
      return undoAddCharacter({ key: action.key });
    case addMonster.type:
      return undoAddMonster({ key: action.key });
    case addMonsterStandee.type:
      return undoAddMonsterStandee({ key: action.key, id: action.id });
    case drawMonsterAbilityCardsSuccess.type:
      return undoDrawMonsterAbilityCards({
        abilityCardIds: Object.entries(action.abilityCardIds)
          .reduce(
            (acc, [key, id]): { [key: string]: { previousId: number | null, nextId: number } } => ({
              ...acc,
              [key]: {
                previousId: state.tabletop.monsters.entities[key]?.currentAbilityCardId,
                nextId: id
              }
            }),
            { }
          )
      });
    case infuseElement.type:
      return undoInfuseElement({ element: action.element });
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
        abilityCardIds: Object.values(state.tabletop.monsters.entities)
          .filter((monster): monster is MonsterSet => Boolean(monster))
          .reduce(
            (acc, monster): { [key: string]: number } => ({
              ...acc,
              [monster.key]: monster.currentAbilityCardId
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
