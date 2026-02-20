import { edgeKey, edgesIntersect } from '../../lib/geometry'
import type { Level5RoundResult, Point } from '../../types/domain'
import type { ReconstructionEdge } from '../reconstruction/types'

export type Level5Edge = ReconstructionEdge<{ triangleNum: number; color: string }>

type ScoreLevel5RoundInput = {
  points: Point[]
  edges: Level5Edge[]
  erasedEdges: number
  timeTaken: string
  avgActionInterval: string
  timeBeforeSubmit: string
}

function isValidTriangle(edges: Level5Edge[], vertices: Set<number>): boolean {
  if (edges.length !== 3 || vertices.size !== 3) return false

  const degree = new Map<number, number>()
  edges.forEach((edge) => {
    degree.set(edge.i, (degree.get(edge.i) ?? 0) + 1)
    degree.set(edge.j, (degree.get(edge.j) ?? 0) + 1)
  })

  return [...degree.values()].every((value) => value === 2)
}

export function scoreLevel5Round(input: ScoreLevel5RoundInput): Level5RoundResult {
  const { points, edges, erasedEdges, timeTaken, avgActionInterval, timeBeforeSubmit } = input

  const triangle1Edges = edges.filter((edge) => edge.triangleNum === 1)
  const triangle2Edges = edges.filter((edge) => edge.triangleNum === 2)

  const triangle1Vertices = new Set<number>()
  triangle1Edges.forEach((edge) => {
    triangle1Vertices.add(edge.i)
    triangle1Vertices.add(edge.j)
  })

  const triangle2Vertices = new Set<number>()
  triangle2Edges.forEach((edge) => {
    triangle2Vertices.add(edge.i)
    triangle2Vertices.add(edge.j)
  })

  const hasTriangle1 = triangle1Edges.length === 3 && triangle1Vertices.size === 3
  const hasTriangle2 = triangle2Edges.length === 3 && triangle2Vertices.size === 3
  const hasTwoTriangles = hasTriangle1 && hasTriangle2

  const sharedVertices = [...triangle1Vertices].filter((vertex) => triangle2Vertices.has(vertex))
  const hasSharedVertices = sharedVertices.length > 0

  const sharedEdges = triangle1Edges.filter((triangle1Edge) =>
    triangle2Edges.some((triangle2Edge) => edgeKey(triangle1Edge) === edgeKey(triangle2Edge)),
  )
  const hasSharedEdges = sharedEdges.length > 0

  let hasIntersection = false
  for (const triangle1Edge of triangle1Edges) {
    for (const triangle2Edge of triangle2Edges) {
      if (edgesIntersect(triangle1Edge, triangle2Edge, points)) {
        hasIntersection = true
        break
      }
    }
    if (hasIntersection) break
  }

  const triangle1Valid = hasTriangle1 && isValidTriangle(triangle1Edges, triangle1Vertices)
  const triangle2Valid = hasTriangle2 && isValidTriangle(triangle2Edges, triangle2Vertices)
  const trianglesSeparate = !hasSharedVertices && !hasSharedEdges && !hasIntersection
  const correct = hasTwoTriangles && triangle1Valid && triangle2Valid && trianglesSeparate

  return {
    correct,
    time: timeTaken,
    hasTwoTriangles,
    triangle1Valid,
    triangle2Valid,
    hasSharedVertices,
    sharedVertexCount: sharedVertices.length,
    hasSharedEdges,
    sharedEdgeCount: sharedEdges.length,
    hasIntersection,
    trianglesSeparate,
    erased: erasedEdges,
    avgActionInterval,
    timeBeforeSubmit,
  }
}
