import { buildPolygonEdges, edgeKey, edgesIntersect } from '../../lib/geometry'
import type { Level3RoundResult, Point } from '../../types/domain'
import type { ReconstructionEdge } from '../reconstruction/types'

export type Level3Edge = ReconstructionEdge

type ScoreLevel3RoundInput = {
  vertices: Point[]
  edges: Level3Edge[]
  hintsUsed: number
  erasedEdges: number
  timeTaken: string
  avgActionInterval: string
  timeBeforeSubmit: string
}

function isClosedPolygon(vertices: Point[], edges: Level3Edge[]): boolean {
  if (edges.length === 0) return false

  const degrees = Array(vertices.length).fill(0)
  edges.forEach((edge) => {
    degrees[edge.i] += 1
    degrees[edge.j] += 1
  })
  return degrees.every((degree) => degree >= 2)
}

function hasIntersection(vertices: Point[], edges: Level3Edge[]): boolean {
  for (let i = 0; i < edges.length; i += 1) {
    for (let j = i + 1; j < edges.length; j += 1) {
      if (edgesIntersect(edges[i], edges[j], vertices)) {
        return true
      }
    }
  }
  return false
}

export function scoreLevel3Round(input: ScoreLevel3RoundInput): Level3RoundResult {
  const { vertices, edges, hintsUsed, erasedEdges, timeTaken, avgActionInterval, timeBeforeSubmit } = input

  const trueEdges = buildPolygonEdges(vertices.length).map(edgeKey)
  const trueSet = new Set(trueEdges)
  const userEdges = edges.map(edgeKey)
  const userSet = new Set(userEdges)

  let missing = 0
  let wrong = 0

  trueEdges.forEach((trueEdge) => {
    if (!userSet.has(trueEdge)) {
      missing += 1
    }
  })

  userEdges.forEach((edge) => {
    if (!trueSet.has(edge)) {
      wrong += 1
    }
  })

  const intersect = hasIntersection(vertices, edges)
  const closed = isClosedPolygon(vertices, edges)
  const correct = missing === 0 && wrong === 0 && !intersect && closed

  return {
    correct,
    time: timeTaken,
    hints: hintsUsed,
    missing,
    wrong,
    intersect,
    erased: erasedEdges,
    closed,
    avgActionInterval,
    timeBeforeSubmit,
  }
}
