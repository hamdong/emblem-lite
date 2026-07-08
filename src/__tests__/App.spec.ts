import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'

import { useGameStore } from '../stores/game'

describe('game store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('supports inspecting either player or enemy units', () => {
    const store = useGameStore()

    expect('validMoves' in store).toBe(false)
    expect('currentPath' in store).toBe(false)
    expect('generatePathTo' in store).toBe(false)
    expect('moveSelectedUnit' in store).toBe(false)

    store.selectUnit('p1')
    expect(store.selectedUnit?.id).toBe('p1')
    expect(store.turnPhase).toBe('player_unit_selected')

    store.selectUnit('e1')
    expect(store.selectedUnit?.id).toBe('e1')
    expect(store.turnPhase).toBe('player_unit_selected')

    store.deselect()
    expect(store.selectedUnit).toBeNull()
    expect(store.turnPhase).toBe('player_idle')
  })

  it('computes movement range for the selected unit', () => {
    const store = useGameStore()

    store.selectUnit('p1')

    expect(store.movementRange).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ x: 1, y: 7, distance: 3 }),
        expect.objectContaining({ x: 3, y: 10, distance: 2 }),
      ]),
    )
  })

  it('allows a unit to move through allied units without occupying the same tile', () => {
    const store = useGameStore()

    const [unitA, unitB] = store.units

    if (!unitA || !unitB) {
      throw new Error('Expected two units for movement test')
    }

    unitA.x = 0
    unitA.y = 0
    unitB.x = 1
    unitB.y = 0

    store.selectUnit('p1')

    expect(store.movementRange).toEqual(
      expect.arrayContaining([expect.objectContaining({ x: 2, y: 0, distance: 2 })]),
    )
    expect(store.movementRange).not.toEqual(
      expect.arrayContaining([expect.objectContaining({ x: 1, y: 0 })]),
    )
  })

  it('does not show hover path preview for enemy units', () => {
    const store = useGameStore()

    store.setHoveredTile(2, 2)
    store.selectUnit('e1')

    expect(store.movementRange.length).toBeGreaterThan(0)
    expect(store.previewPath).toEqual([])
  })

  it('moves a selected unit along the computed path and marks it as acted', async () => {
    const store = useGameStore()

    store.selectUnit('p1')
    await store.moveSelectedUnitTo(2, 7)

    const movedUnit = store.units.find((unit) => unit.id === 'p1')

    expect(movedUnit?.x).toBe(2)
    expect(movedUnit?.y).toBe(7)
    expect(movedUnit?.hasMoved).toBe(true)
    expect(store.selectedUnit).toBeNull()
  })
})
