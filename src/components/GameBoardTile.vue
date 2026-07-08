<script setup lang="ts">
import { computed } from 'vue'
import type { Unit } from '../stores/level-layout'

const props = defineProps<{
  x: number
  y: number
  isSelected: boolean
  isInMovementRange: boolean
  isOnPreviewPath: boolean
  isCurrentPreviewTile: boolean
  unit: Unit | null
  onClick: (x: number, y: number) => void
  onMouseEnter: (x: number, y: number) => void
  onMouseLeave: () => void
}>()

const handleClick = () => {
  props.onClick(props.x, props.y)
}

const handleMouseEnter = () => {
  props.onMouseEnter(props.x, props.y)
}

const handleMouseLeave = () => {
  props.onMouseLeave()
}

const tileClasses = computed(() => {
  return [
    (props.x + props.y) % 2 === 0 ? 'bg-slate-700/40' : 'bg-slate-600/40',
    props.isSelected ? 'bg-amber-500/20 ring-2 ring-amber-400/70 z-10' : '',
    props.isInMovementRange ? 'bg-emerald-500/20 ring-1 ring-emerald-400/60' : '',
  ].filter(Boolean)
})
</script>

<template>
  <div
    class="w-12 h-12 border border-slate-700/20 flex items-center justify-center relative cursor-pointer select-none transition-colors duration-150"
    :class="tileClasses"
    @click="handleClick"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <span
      v-if="isOnPreviewPath"
      class="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
    >
      <span
        class="rounded-full bg-emerald-300 shadow-[0_0_8px_rgba(110,231,183,0.9)]"
        :class="isCurrentPreviewTile ? 'w-3 h-3' : 'w-2 h-2'"
      />
    </span>

    <span
      class="absolute bottom-0.5 right-1 text-[7px] text-slate-500 opacity-25 pointer-events-none z-0"
    >
      {{ x }},{{ y }}
    </span>
  </div>
</template>
