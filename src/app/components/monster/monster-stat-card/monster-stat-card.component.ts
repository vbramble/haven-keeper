import { Component, Input } from '@angular/core';
import { Level } from 'models/level';
import { BasicMonsterStatCard, MonsterLevel } from 'models/monster-stat-card';

@Component({
  selector: 'monster-stat-card',
  templateUrl: './monster-stat-card.component.html',
  styleUrls: ['./monster-stat-card.component.scss']
})
export class MonsterStatCardComponent {
  @Input() level: Level = 0;
  @Input() statCard: BasicMonsterStatCard = {
    key: 'placeholder',
    kind: 'basic',
    name: 'Test Monster',
    levels: {
      0: {
        hitPoints: 5,
        movement: 2,
        attack: 1,
        range: 1,
        attackEffects: [],
        bonuses: { },
        immunities: []
      },
      1: {
        hitPoints: 5,
        movement: 2,
        attack: 1,
        range: 1,
        attackEffects: [],
        bonuses: { },
        immunities: []
      },
      2: {
        hitPoints: 5,
        movement: 2,
        attack: 1,
        range: 1,
        attackEffects: [],
        bonuses: { },
        immunities: []
      },
      3: {
        hitPoints: 5,
        movement: 2,
        attack: 1,
        range: 1,
        attackEffects: [],
        bonuses: { },
        immunities: []
      },
      4: {
        hitPoints: 5,
        movement: 2,
        attack: 1,
        range: 1,
        attackEffects: [],
        bonuses: { },
        immunities: []
      },
      5: {
        hitPoints: 5,
        movement: 2,
        attack: 1,
        range: 1,
        attackEffects: [],
        bonuses: { },
        immunities: []
      },
      6: {
        hitPoints: 5,
        movement: 2,
        attack: 1,
        range: 1,
        attackEffects: [],
        bonuses: { },
        immunities: []
      },
      7: {
        hitPoints: 5,
        movement: 2,
        attack: 1,
        range: 1,
        attackEffects: [],
        bonuses: { },
        immunities: []
      }
    },
    eliteLevels: {
      0: {
        hitPoints: 5,
        movement: 2,
        attack: 1,
        range: 1,
        attackEffects: [],
        bonuses: { },
        immunities: []
      },
      1: {
        hitPoints: 5,
        movement: 2,
        attack: 1,
        range: 1,
        attackEffects: [],
        bonuses: { },
        immunities: []
      },
      2: {
        hitPoints: 5,
        movement: 2,
        attack: 1,
        range: 1,
        attackEffects: [],
        bonuses: { },
        immunities: []
      },
      3: {
        hitPoints: 5,
        movement: 2,
        attack: 1,
        range: 1,
        attackEffects: [],
        bonuses: { },
        immunities: []
      },
      4: {
        hitPoints: 5,
        movement: 2,
        attack: 1,
        range: 1,
        attackEffects: [],
        bonuses: { },
        immunities: []
      },
      5: {
        hitPoints: 5,
        movement: 2,
        attack: 1,
        range: 1,
        attackEffects: [],
        bonuses: { },
        immunities: []
      },
      6: {
        hitPoints: 5,
        movement: 2,
        attack: 1,
        range: 1,
        attackEffects: [],
        bonuses: { },
        immunities: []
      },
      7: {
        hitPoints: 5,
        movement: 2,
        attack: 1,
        range: 1,
        attackEffects: [],
        bonuses: { },
        immunities: []
      }
    }
  };

  public get basicLevel(): MonsterLevel {
    return this.statCard.levels[this.level];
  }

  public get eliteLevel(): MonsterLevel {
    return this.statCard.eliteLevels[this.level];
  }
}