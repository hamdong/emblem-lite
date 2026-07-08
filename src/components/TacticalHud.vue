<script setup lang="ts">
import { computed } from 'vue'
import { useGameStore } from '../stores/game'
import SelectedUnitPanel from './SelectedUnitPanel.vue'

const store = useGameStore()
const selectedUnit = computed(() => store.selectedUnit)
</script>

<template>
  <div
    class="w-64 bg-slate-800 p-4 border-2 border-slate-700 rounded shadow-lg flex flex-col gap-4"
  >
    <h2 class="text-xl font-bold border-b border-slate-700 pb-2 text-slate-300">Tactical HUD</h2>

    <SelectedUnitPanel :unit="selectedUnit" />

    <div
      v-if="!selectedUnit"
      class="text-xs text-slate-500 text-center py-8 italic leading-relaxed"
    >
      Click any unit on the grid to inspect its current state metrics.
    </div>
  </div>
</template>
