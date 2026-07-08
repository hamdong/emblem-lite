import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { getInitialUnits, type Unit } from './level-layout'
import { getMovementData, type MovementTile } from '../utils/movement'

export const MAP_SIZE = 12

export const useGameStore = defineStore('game', () => {
  const units = ref<Unit[]>(getInitialUnits())
  const turnPhase = ref<'player_idle' | 'player_unit_selected'>('player_idle')
  const selectedUnitId = ref<string | null>(null)

  const selectedUnit = computed(() => {
    return units.value.find((u) => u.id === selectedUnitId.value) || null
  })

  const hoveredTile = ref<{ x: number; y: number } | null>(null)
  const movementRange = computed<MovementTile[]>(() => {
    if (!selectedUnit.value) return []

    return getMovementData(
      { x: selectedUnit.value.x, y: selectedUnit.value.y },
      units.value,
      selectedUnit.value.id,
      MAP_SIZE,
    ).reachable
  })

  const previewPath = computed(() => {
    if (!selectedUnit.value || selectedUnit.value.faction !== 'player' || !hoveredTile.value) {
      return []
    }

    return getMovementData(
      { x: selectedUnit.value.x, y: selectedUnit.value.y },
      units.value,
      selectedUnit.value.id,
      MAP_SIZE,
    ).getPathTo(hoveredTile.value)
  })

  const getUnitAt = (x: number, y: number): Unit | null => {
    return units.value.find((u) => u.x === x && u.y === y && u.hp > 0) || null
  }

  function selectUnit(id: string) {
    const unit = units.value.find((u) => u.id === id)

    if (unit && !unit.hasMoved) {
      selectedUnitId.value = id
      turnPhase.value = 'player_unit_selected'
    }
  }

  function selectTile(x: number, y: number) {
    const unit = getUnitAt(x, y)

    if (selectedUnit.value && selectedUnit.value.x === x && selectedUnit.value.y === y) {
      deselect()
      return
    }

    if (
      selectedUnit.value &&
      selectedUnit.value.faction === 'player' &&
      movementRange.value.some((tile) => tile.x === x && tile.y === y)
    ) {
      void moveSelectedUnitTo(x, y)
      return
    }

    if (!unit) {
      if (turnPhase.value === 'player_unit_selected') {
        deselect()
      }
      return
    }

    if (turnPhase.value === 'player_idle') {
      selectUnit(unit.id)
      return
    }

    if (selectedUnit.value?.x === x && selectedUnit.value?.y === y) {
      deselect()
    } else {
      selectUnit(unit.id)
    }
  }

  function deselect() {
    selectedUnitId.value = null
    turnPhase.value = 'player_idle'
  }

  async function moveSelectedUnitTo(x: number, y: number) {
    const unit = selectedUnit.value
    if (!unit || unit.hasMoved) return

    const movement = getMovementData({ x: unit.x, y: unit.y }, units.value, unit.id, MAP_SIZE)

    const path = movement.getPathTo({ x, y })
    if (path.length === 0) return

    const [start, ...steps] = path
    if (!start) return

    const pathToFollow = steps.length > 0 ? steps : path

    for (const step of pathToFollow) {
      const currentUnit = units.value.find((entry) => entry.id === unit.id)
      if (!currentUnit) break

      currentUnit.x = step.x
      currentUnit.y = step.y
      await new Promise((resolve) => window.setTimeout(resolve, 140))
    }

    const currentUnit = units.value.find((entry) => entry.id === unit.id)
    if (currentUnit) {
      currentUnit.hasMoved = true
    }

    hoveredTile.value = null
    deselect()
  }

  function setHoveredTile(x: number | null, y: number | null) {
    hoveredTile.value = x === null || y === null ? null : { x, y }
  }

  return {
    turnPhase,
    selectedUnitId,
    units,
    selectedUnit,
    movementRange,
    previewPath,
    hoveredTile,
    getUnitAt,
    selectUnit,
    selectTile,
    deselect,
    moveSelectedUnitTo,
    setHoveredTile,
  }
})
