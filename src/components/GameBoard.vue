<script setup lang="ts">
import { computed } from 'vue'
import { useGameStore, MAP_SIZE } from '../stores/game'
import GameBoardTile from './GameBoardTile.vue'

const store = useGameStore()

const getUnitAt = (x: number, y: number) => store.getUnitAt(x, y)

const isSelectedUnit = (x: number, y: number) => {
  return store.selectedUnit?.x === x && store.selectedUnit?.y === y
}

const isInMovementRange = (x: number, y: number) => {
  return store.movementRange.some((tile) => tile.x === x && tile.y === y)
}

const isOnPreviewPath = (x: number, y: number) => {
  return store.previewPath.some((tile) => tile.x === x && tile.y === y)
}

const isCurrentPreviewTile = (x: number, y: number) => {
  return store.hoveredTile?.x === x && store.hoveredTile?.y === y
}

const getUnitClasses = (unit: { faction: string; shape: string; hasMoved: boolean }) => {
  return [
    unit.faction === 'player' ? 'bg-blue-600 text-white' : 'bg-red-600 text-white',
    unit.hasMoved ? 'opacity-60' : 'opacity-100',
    unit.shape === 'circle' ? 'rounded-full' : '',
    unit.shape === 'square' ? 'rounded-md' : '',
    unit.shape === 'triangle' ? 'clip-triangle' : '',
  ].filter(Boolean)
}

const unitPositions = computed(() => {
  return store.units
    .filter((unit) => unit.hp > 0)
    .map((unit) => ({
      ...unit,
      classes: getUnitClasses(unit),
    }))
})

const handleTileMouseEnter = (x: number, y: number) => {
  store.setHoveredTile(x, y)
}

const handleTileMouseLeave = () => {
  store.setHoveredTile(null, null)
}

const handleTileClick = (x: number, y: number) => {
  store.selectTile(x, y)
}
</script>

<template>
  <div
    class="grid gap-0.5 border-4 border-slate-700 bg-slate-800 p-1 rounded shadow-2xl relative"
    style="--tile-size: 3rem"
    :style="{
      gridTemplateColumns: `repeat(${MAP_SIZE}, minmax(0, 1fr))`,
      gridTemplateRows: `repeat(${MAP_SIZE}, minmax(0, 1fr))`,
    }"
  >
    <div v-for="y in MAP_SIZE" :key="'row-' + y" class="contents">
      <GameBoardTile
        v-for="x in MAP_SIZE"
        :key="'cell-' + (x - 1) + '-' + (y - 1)"
        :x="x - 1"
        :y="y - 1"
        :is-selected="isSelectedUnit(x - 1, y - 1)"
        :is-in-movement-range="isInMovementRange(x - 1, y - 1)"
        :is-on-preview-path="isOnPreviewPath(x - 1, y - 1)"
        :is-current-preview-tile="isCurrentPreviewTile(x - 1, y - 1)"
        :unit="getUnitAt(x - 1, y - 1)"
        :on-click="handleTileClick"
        :on-mouse-enter="handleTileMouseEnter"
        :on-mouse-leave="handleTileMouseLeave"
      />
    </div>

    <div class="absolute inset-0 pointer-events-none">
      <div
        v-for="unit in unitPositions"
        :key="unit.id"
        class="absolute flex items-center justify-center transition-all duration-200 ease-out"
        :style="{
          left: `calc(${unit.x} * var(--tile-size))`,
          top: `calc(${unit.y} * var(--tile-size))`,
          width: 'var(--tile-size)',
          height: 'var(--tile-size)',

          /* For grid gaps */
          marginLeft: `calc(${unit.x} * 0.15rem)`,
          marginTop: `calc(${unit.y} * 0.15rem)`,
        }"
      >
        <div
          class="w-8 h-8 flex items-center justify-center shadow font-black text-[10px] border border-white/10"
          :class="unit.classes"
        >
          {{ unit.hp }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.clip-triangle {
  clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
}
</style>
