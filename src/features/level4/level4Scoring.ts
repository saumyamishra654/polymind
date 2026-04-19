import { edgeKey, edgesIntersect } from '../../lib/geometry'
import type { Level4RoundResult, Point } from '../../types/domain'
import type { ReconstructionEdge } from '../reconstruction/types'

export type Level4Edge = ReconstructionEdge<{ isOuter: boolean; color: string }>

type ScoreLevel4RoundInput = {
  shapeName: string
  outerVertices: Point[]
  innerVertices: Point[]
  edges: Level4Edge[]
  hintsUsed: number
  erasedEdges: number
  timeTaken: string
  avgActionInterval: string
  timeBeforeSubmit: string
}

type IndexedEdge = {
  i: number
  j: number
}

function buildTrueEdges(offset: number, vertexCount: number): IndexedEdge[] {
  return Array.from({ length: vertexCount }, (_, index) => {
    const a = offset + index
    const b = offset + ((index + 1) % vertexCount)
    return { i: Math.min(a, b), j: Math.max(a, b) }
  })
}

function hasIntersection(vertices: Point[], edges: Level4Edge[]): boolean {
  for (let i = 0; i < edges.length; i += 1) {
    for (let j = i + 1; j < edges.length; j += 1) {
      if (edgesIntersect(edges[i], edges[j], vertices)) {
        return true
      }
    }
  }
  return false
}

export function scoreLevel4Round(input: ScoreLevel4RoundInput): Level4RoundResult {
  const {
    shapeName,
    outerVertices,
    innerVertices,
    edges,
    hintsUsed,
    erasedEdges,
    timeTaken,
    avgActionInterval,
    timeBeforeSubmit,
  } = input

  const outerCount = outerVertices.length
  const trueOuterEdges = buildTrueEdges(0, outerCount).map(edgeKey)
  const trueInnerEdges = buildTrueEdges(outerCount, innerVertices.length).map(edgeKey)
  const trueOuterSet = new Set(trueOuterEdges)
  const trueInnerSet = new Set(trueInnerEdges)

  const userOuterEdges = edges
    .filter((edge) => edge.isOuter)
    .map((edge) => edgeKey(edge))
  const userInnerEdges = edges
    .filter((edge) => !edge.isOuter)
    .map((edge) => edgeKey(edge))

  const userOuterSet = new Set(userOuterEdges)
  const userInnerSet = new Set(userInnerEdges)

  let outerMissing = 0
  let outerWrong = 0
  let innerMissing = 0
  let innerWrong = 0

  trueOuterEdges.forEach((edge) => {
    if (!userOuterSet.has(edge)) outerMissing += 1
  })
  userOuterEdges.forEach((edge) => {
    if (!trueOuterSet.has(edge)) outerWrong += 1
  })

  trueInnerEdges.forEach((edge) => {
    if (!userInnerSet.has(edge)) innerMissing += 1
  })
  userInnerEdges.forEach((edge) => {
    if (!trueInnerSet.has(edge)) innerWrong += 1
  })

  const totalMissing = outerMissing + innerMissing
  const totalWrong = outerWrong + innerWrong
  const intersect = hasIntersection([...outerVertices, ...innerVertices], edges)
  const correct = totalMissing === 0 && totalWrong === 0 && !intersect

  return {
    correct,
    shapeName,
    time: timeTaken,
    hints: hintsUsed,
    outerMissing,
    outerWrong,
    innerMissing,
    innerWrong,
    totalMissing,
    totalWrong,
    intersect,
    erased: erasedEdges,
    avgActionInterval,
    timeBeforeSubmit,
  }
}
