import type { Level } from './app'

export type Point = {
  x: number
  y: number
}

export type InstructionsStep = {
  heading: string
  sections: Array<{
    title: string
    items: string[]
  }>
}

export type LevelMeta = {
  introTitle: string
  introDescription: string
}

export type Level1Problem = {
  target: string
  correct: string
}

export type PolygonRound = {
  vertices: Point[]
}

export type Level4Shape = {
  name: string
  outer: Point[]
  inner: Point[]
}

export type Level5PointSet = {
  points: Point[]
}

export type LevelMetaMap = Record<Level, LevelMeta>

export type Level1Stage = 'flip' | 'rotation'

export type Level1RoundResult = {
  correct: boolean
  time: string
  avgActionInterval: string
  timeBeforeSubmit: string
  correctSvg: string
  selectedSvg: string
}

export type Level1Results = {
  flip: Level1RoundResult
  rotation: Level1RoundResult
}

export type Level2RoundResult = {
  correct: boolean
  time: string
  hints: number
  missing: number
  wrong: number
  intersect: boolean
  erased: number
  followOrder: boolean
  closed: boolean
  avgActionInterval: string
  timeBeforeSubmit: string
}

export type Level3RoundResult = {
  correct: boolean
  time: string
  hints: number
  missing: number
  wrong: number
  intersect: boolean
  erased: number
  closed: boolean
  avgActionInterval: string
  timeBeforeSubmit: string
}

export type Level4RoundResult = {
  correct: boolean
  shapeName: string
  time: string
  hints: number
  outerMissing: number
  outerWrong: number
  innerMissing: number
  innerWrong: number
  totalMissing: number
  totalWrong: number
  intersect: boolean
  erased: number
  avgActionInterval: string
  timeBeforeSubmit: string
}

export type Level5RoundResult = {
  correct: boolean
  time: string
  hasTwoTriangles: boolean
  triangle1Valid: boolean
  triangle2Valid: boolean
  hasSharedVertices: boolean
  sharedVertexCount: number
  hasSharedEdges: boolean
  sharedEdgeCount: number
  hasIntersection: boolean
  trianglesSeparate: boolean
  erased: number
  avgActionInterval: string
  timeBeforeSubmit: string
}
