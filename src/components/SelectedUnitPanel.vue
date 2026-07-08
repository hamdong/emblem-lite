<script setup lang="ts">
import { computed } from 'vue'
import type { Unit } from '../stores/level-layout'

const props = defineProps<{
  unit: Unit | null
}>()

const factionClass = computed(() =>
  props.unit?.faction === 'player' ? 'text-blue-400' : 'text-red-400',
)

const statRows = computed(() => {
  if (!props.unit) return []

  return [
    { label: 'HP', value: `${props.unit.hp}/${props.unit.maxHp}`, fullWidth: false },
    { label: 'ATK', value: props.unit.atk.toString(), fullWidth: false },
    { label: 'DEF', value: props.unit.def.toString(), fullWidth: false },
    { label: 'SPD', value: props.unit.spd.toString(), fullWidth: false },
    { label: 'MOV Range', value: props.unit.mov.toString(), fullWidth: true },
  ]
})
</script>

<template>
  <div v-if="unit" class="bg-slate-900/60 p-3 rounded border border-slate-700">
    <p class="text-xs uppercase font-black mb-1 tracking-wider" :class="factionClass">
      Selected Unit
    </p>
    <div class="text-xs space-y-2 mt-2">
      <div class="flex justify-between">
        <span class="text-slate-400">Weapon Type:</span>
        <span class="font-bold text-amber-300 uppercase">{{ unit.weapon }}</span>
      </div>
      <div class="flex justify-between">
        <span class="text-slate-400">Shape Class:</span>
        <span class="font-bold text-white uppercase">{{ unit.shape }}</span>
      </div>

      <div class="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800 text-slate-300">
        <div v-for="stat in statRows" :key="stat.label" :class="stat.fullWidth ? 'col-span-2' : ''">
          {{ stat.label }}:
          <span
            class="font-bold"
            :class="stat.label === 'MOV Range' ? 'text-amber-400' : 'text-white'"
          >
            {{ stat.value }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
