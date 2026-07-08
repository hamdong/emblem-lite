import { describe, expect, it } from 'vitest'
import { getMovementData } from '../utils/movement'
import type { Unit } from '../stores/level-layout'

const units: Unit[] = [
  {
    id: 'p1',
    faction: 'player',
    shape: 'circle',
    weapon: 'sword',
    hp: 20,
    maxHp: 20,
    atk: 5,
    def: 3,
    spd: 5,
    mov: 3,
    x: 1,
    y: 1,
    hasMoved: false,
  },
  {
    id: 'p2',
    faction: 'player',
    shape: 'square',
    weapon: 'axe',
    hp: 20,
    maxHp: 20,
    atk: 5,
    def: 3,
    spd: 5,
    mov: 3,
    x: 2,
    y: 1,
    hasMoved: false,
  },
]

describe('movement helper', () => {
  it('finds reachable tiles and a path to a target', () => {
    const movement = getMovementData({ x: 1, y: 1 }, units, 'p1', 12)

    expect(movement.reachable).toEqual(
      expect.arrayContaining([expect.objectContaining({ x: 1, y: 2, distance: 1 })]),
    )

    expect(movement.getPathTo({ x: 1, y: 3 })).toEqual([
      { x: 1, y: 1 },
      { x: 1, y: 2 },
      { x: 1, y: 3 },
    ])
  })
})
