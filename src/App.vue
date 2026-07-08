<script setup lang="ts">
import { computed } from 'vue'
import { useGameStore } from './stores/game'
import GameBoard from './components/GameBoard.vue'
import TacticalHud from './components/TacticalHud.vue'

const store = useGameStore()

const isUnitSelected = computed(() => store.turnPhase === 'player_unit_selected')
const turnPhaseLabel = computed(() => store.turnPhase.replace('_', ' '))

const handleRightClick = () => {
  if (isUnitSelected.value) {
    store.deselect()
  }
}
</script>

<template>
  <div
    class="w-screen h-screen bg-slate-900 text-white flex items-center justify-center p-8 select-none overflow-hidden"
    @contextmenu.prevent="handleRightClick"
  >
    <div class="flex flex-row justify-center gap-12 max-w-7xl w-full h-full pt-8">
      <section class="flex items-start justify-center shrink-0">
        <GameBoard />
      </section>

      <aside class="flex flex-col gap-6 w-[320px] shrink-0 items-start">
        <header class="border-b border-slate-800 pb-4 w-full">
          <h1 class="text-4xl font-black tracking-wider text-amber-400">EMBLEM LITE</h1>
          <p class="text-xs text-slate-400 mt-1.5 flex items-center gap-2">
            Turn Phase:
            <span
              class="px-2 py-0.5 rounded bg-slate-800 text-white font-bold uppercase tracking-wide border border-slate-700/60"
            >
              {{ turnPhaseLabel }}
            </span>
          </p>
        </header>

        <div class="w-full">
          <TacticalHud />
        </div>
      </aside>
    </div>
  </div>
</template>
