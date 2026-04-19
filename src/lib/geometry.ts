import type { Point } from '../types/domain'

export type IndexedEdge = {
  i: number
  j: number
}

export function normalizeEdge(edge: IndexedEdge): IndexedEdge {
  if (edge.i <= edge.j) {
    return edge
  }

  return { i: edge.j, j: edge.i }
}

export function edgeKey(edge: IndexedEdge): string {
  const normalized = normalizeEdge(edge)
  return `${normalized.i}-${normalized.j}`
}

export function buildPolygonEdges(vertexCount: number): IndexedEdge[] {
  return Array.from({ length: vertexCount }, (_, k) => {
    const a = k
    const b = (k + 1) % vertexCount
    return normalizeEdge({ i: a, j: b })
  })
}

function orient(p: Point, q: Point, r: Point): 0 | 1 | 2 {
  const val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y)
  if (val === 0) return 0
  return val > 0 ? 1 : 2
}

export function segmentsIntersect(p1: Point, p2: Point, p3: Point, p4: Point): boolean {
  const o1 = orient(p1, p2, p3)
  const o2 = orient(p1, p2, p4)
  const o3 = orient(p3, p4, p1)
  const o4 = orient(p3, p4, p2)

  if (o1 !== o2 && o3 !== o4) {
    return true
  }

  return false
}

export function edgesIntersect(e1: IndexedEdge, e2: IndexedEdge, vertices: Point[]): boolean {
  const a = e1.i
  const b = e1.j
  const c = e2.i
  const d = e2.j

  if (a === c || a === d || b === c || b === d) {
    return false
  }

  const p1 = vertices[a]
  const p2 = vertices[b]
  const p3 = vertices[c]
  const p4 = vertices[d]

  return segmentsIntersect(p1, p2, p3, p4)
}
