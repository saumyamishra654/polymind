import { buildPolygonEdges, edgeKey, edgesIntersect } from '../../lib/geometry'
import type { Level2RoundResult, Point } from '../../types/domain'
import type { ReconstructionEdge } from '../reconstruction/types'

export type Level2Edge = ReconstructionEdge<{ viaHint: boolean }>

type ScoreLevel2RoundInput = {
  vertices: Point[]
  edges: Level2Edge[]
  edgeHistory: Level2Edge[]
  hintsUsed: number
  erasedEdges: number
  timeTaken: string
  avgActionInterval: string
  timeBeforeSubmit: string
}

function isClosedPolygon(vertices: Point[], edges: Level2Edge[]): boolean {
  if (edges.length === 0) {
    return false
  }

  const degrees = Array(vertices.length).fill(0)
  edges.forEach((edge) => {
    degrees[edge.i] += 1
    degrees[edge.j] += 1
  })

  return degrees.every((degree) => degree >= 2)
}

function checkFollowOrder(vertexCount: number, edgeHistory: Level2Edge[]): boolean {
  const sequence = edgeHistory.filter((edge) => !edge.viaHint)
  if (sequence.length === 0) return false

  for (let start = 0; start < vertexCount; start += 1) {
    let matches = true
    for (let offset = 0; offset < sequence.length; offset += 1) {
      const expectedStart = (start + offset) % vertexCount
      const expectedEnd = (expectedStart + 1) % vertexCount
      const edge = sequence[offset]
      if (edge.i !== expectedStart || edge.j !== expectedEnd) {
        matches = false
        break
      }
    }

    if (matches) return true
  }

  return false
}

function hasIntersection(vertices: Point[], edges: Level2Edge[]): boolean {
  for (let i = 0; i < edges.length; i += 1) {
    for (let j = i + 1; j < edges.length; j += 1) {
      if (edgesIntersect(edges[i], edges[j], vertices)) {
        return true
      }
    }
  }
  return false
}

export function scoreLevel2Round(input: ScoreLevel2RoundInput): Level2RoundResult {
  const {
    vertices,
    edges,
    edgeHistory,
    hintsUsed,
    erasedEdges,
    timeTaken,
    avgActionInterval,
    timeBeforeSubmit,
  } = input

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
  const followOrder = checkFollowOrder(vertices.length, edgeHistory)
  const correct = missing === 0 && wrong === 0 && !intersect && closed

  return {
    correct,
    time: timeTaken,
    hints: hintsUsed,
    missing,
    wrong,
    intersect,
    erased: erasedEdges,
    followOrder,
    closed,
    avgActionInterval,
    timeBeforeSubmit,
  }
}
