import type { Unit } from '../stores/level-layout'

export interface MovementTile {
  x: number
  y: number
  distance: number
}

export interface MovementData {
  reachable: MovementTile[]
  getPathTo: (target: { x: number; y: number }) => Array<{ x: number; y: number }>
}

export function getMovementData(
  start: { x: number; y: number },
  units: Unit[],
  selectedUnitId: string,
  mapSize: number,
): MovementData {
  const reachable: MovementTile[] = []
  const visited = new Set<string>()
  const cameFrom = new Map<string, { x: number; y: number }>()
  const queue: Array<{ x: number; y: number; distance: number }> = [{ ...start, distance: 0 }]

  const getUnitAt = (x: number, y: number) =>
    units.find((unit) => unit.x === x && unit.y === y && unit.hp > 0) || null
  const selectedUnit = units.find((unit) => unit.id === selectedUnitId) || null

  while (queue.length > 0) {
    const current = queue.shift()
    if (!current) continue

    const key = `${current.x},${current.y}`
    if (visited.has(key)) continue
    visited.add(key)

    if (current.distance > 0) {
      reachable.push({ x: current.x, y: current.y, distance: current.distance })
    }

    if (current.distance >= (selectedUnit?.mov ?? 0)) continue

    const neighbors = [
      { x: current.x + 1, y: current.y },
      { x: current.x - 1, y: current.y },
      { x: current.x, y: current.y + 1 },
      { x: current.x, y: current.y - 1 },
    ]

    for (const neighbor of neighbors) {
      if (neighbor.x < 0 || neighbor.y < 0 || neighbor.x >= mapSize || neighbor.y >= mapSize) {
        continue
      }

      const occupant = getUnitAt(neighbor.x, neighbor.y)
      if (
        occupant &&
        occupant.id !== selectedUnitId &&
        occupant.faction !== selectedUnit?.faction
      ) {
        continue
      }

      if (occupant && occupant.id === selectedUnitId) {
        continue
      }

      const nextKey = `${neighbor.x},${neighbor.y}`
      if (visited.has(nextKey)) continue

      cameFrom.set(nextKey, { x: current.x, y: current.y })
      queue.push({ x: neighbor.x, y: neighbor.y, distance: current.distance + 1 })
    }
  }

  const getPathTo = (target: { x: number; y: number }) => {
    const path: Array<{ x: number; y: number }> = [{ x: target.x, y: target.y }]
    let current = `${target.x},${target.y}`

    while (cameFrom.has(current)) {
      const previous = cameFrom.get(current)
      if (!previous) break
      path.unshift({ x: previous.x, y: previous.y })
      current = `${previous.x},${previous.y}`
    }

    if (path[0]?.x !== start.x || path[0]?.y !== start.y) {
      return []
    }

    return path
  }

  return { reachable, getPathTo }
}
