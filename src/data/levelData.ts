import type { Level1Problem, Level4Shape, Level5PointSet, PolygonRound } from '../types/domain'

export const level1FlipProblems: Level1Problem[] = [
  {
    target: '<polygon points="50,10 85,40 70,90 30,90 15,40"/>',
    correct:
      '<g transform="scale(-1,1) translate(-100,0)"><polygon points="50,10 85,40 70,90 30,90 15,40"/></g>',
  },
  {
    target: '<polygon points="40,10 80,40 70,85 25,85 15,40"/>',
    correct:
      '<g transform="scale(-1,1) translate(-100,0)"><polygon points="40,10 80,40 70,85 25,85 15,40"/></g>',
  },
  {
    target: '<polygon points="30,15 70,15 85,45 50,85 15,45"/>',
    correct:
      '<g transform="scale(-1,1) translate(-100,0)"><polygon points="30,15 70,15 85,45 50,85 15,45"/></g>',
  },
]

export const level1RotationProblems: Level1Problem[] = [
  {
    target: '<polygon points="50,10 85,35 70,80 30,80 15,35"/>',
    correct:
      '<g transform="rotate(90 50 50)"><polygon points="50,10 85,35 70,80 30,80 15,35"/></g>',
  },
  {
    target: '<polygon points="40,10 90,60 50,90 10,60"/>',
    correct:
      '<g transform="rotate(60 50 50)"><polygon points="40,10 90,60 50,90 10,60"/></g>',
  },
]

export const level1Distractors: string[] = [
  '<polygon points="20,20 80,20 80,80 20,80"/>',
  '<polygon points="50,15 85,75 15,75"/>',
  '<polygon points="15,60 80,30 60,90"/>',
]

export const level2Polygons: PolygonRound[] = [
  {
    vertices: [
      { x: 20, y: 20 },
      { x: 80, y: 20 },
      { x: 90, y: 50 },
      { x: 70, y: 85 },
      { x: 30, y: 85 },
      { x: 10, y: 50 },
    ],
  },
  {
    vertices: [
      { x: 25, y: 15 },
      { x: 75, y: 15 },
      { x: 90, y: 45 },
      { x: 70, y: 80 },
      { x: 40, y: 90 },
      { x: 15, y: 60 },
      { x: 15, y: 35 },
    ],
  },
]

export const level3Polygons: PolygonRound[] = [
  {
    vertices: [
      { x: 18, y: 12 },
      { x: 60, y: 10 },
      { x: 90, y: 28 },
      { x: 83, y: 50 },
      { x: 95, y: 70 },
      { x: 72, y: 88 },
      { x: 42, y: 95 },
      { x: 28, y: 80 },
      { x: 35, y: 58 },
      { x: 12, y: 40 },
    ],
  },
  {
    vertices: [
      { x: 20, y: 18 },
      { x: 55, y: 12 },
      { x: 88, y: 22 },
      { x: 92, y: 48 },
      { x: 78, y: 78 },
      { x: 48, y: 92 },
      { x: 28, y: 74 },
      { x: 18, y: 60 },
      { x: 30, y: 42 },
    ],
  },
]

export const level4Shapes: Level4Shape[] = [
  {
    name: 'square',
    outer: [
      { x: 10, y: 10 },
      { x: 90, y: 10 },
      { x: 90, y: 90 },
      { x: 10, y: 90 },
    ],
    inner: [
      { x: 30, y: 30 },
      { x: 70, y: 30 },
      { x: 70, y: 70 },
      { x: 30, y: 70 },
    ],
  },
  {
    name: 'triangle',
    outer: [
      { x: 50, y: 5 },
      { x: 95, y: 85 },
      { x: 5, y: 85 },
    ],
    inner: [
      { x: 50, y: 30 },
      { x: 70, y: 65 },
      { x: 30, y: 65 },
    ],
  },
  {
    name: 'pentagon',
    outer: [
      { x: 50, y: 8 },
      { x: 90, y: 35 },
      { x: 75, y: 85 },
      { x: 25, y: 85 },
      { x: 10, y: 35 },
    ],
    inner: [
      { x: 50, y: 30 },
      { x: 70, y: 45 },
      { x: 62, y: 68 },
      { x: 38, y: 68 },
      { x: 30, y: 45 },
    ],
  },
  {
    name: 'rectangle',
    outer: [
      { x: 15, y: 20 },
      { x: 85, y: 20 },
      { x: 85, y: 80 },
      { x: 15, y: 80 },
    ],
    inner: [
      { x: 35, y: 38 },
      { x: 65, y: 38 },
      { x: 65, y: 62 },
      { x: 35, y: 62 },
    ],
  },
  {
    name: 'star',
    outer: [
      { x: 50, y: 5 },
      { x: 58, y: 35 },
      { x: 90, y: 35 },
      { x: 65, y: 55 },
      { x: 75, y: 85 },
      { x: 50, y: 65 },
      { x: 25, y: 85 },
      { x: 35, y: 55 },
      { x: 10, y: 35 },
      { x: 42, y: 35 },
    ],
    inner: [
      { x: 50, y: 25 },
      { x: 54, y: 40 },
      { x: 68, y: 40 },
      { x: 57, y: 48 },
      { x: 61, y: 62 },
      { x: 50, y: 53 },
      { x: 39, y: 62 },
      { x: 43, y: 48 },
      { x: 32, y: 40 },
      { x: 46, y: 40 },
    ],
  },
  {
    name: 'concave',
    outer: [
      { x: 20, y: 20 },
      { x: 80, y: 20 },
      { x: 80, y: 45 },
      { x: 50, y: 45 },
      { x: 50, y: 80 },
      { x: 35, y: 80 },
      { x: 35, y: 45 },
      { x: 20, y: 45 },
    ],
    inner: [
      { x: 35, y: 30 },
      { x: 65, y: 30 },
      { x: 65, y: 40 },
      { x: 48, y: 40 },
      { x: 48, y: 65 },
      { x: 42, y: 65 },
      { x: 42, y: 40 },
      { x: 35, y: 40 },
    ],
  },
  {
    name: 'tree',
    outer: [
      { x: 20, y: 15 },
      { x: 80, y: 15 },
      { x: 80, y: 35 },
      { x: 60, y: 35 },
      { x: 60, y: 85 },
      { x: 40, y: 85 },
      { x: 40, y: 35 },
      { x: 20, y: 35 },
    ],
    inner: [
      { x: 35, y: 28 },
      { x: 65, y: 28 },
      { x: 65, y: 38 },
      { x: 55, y: 38 },
      { x: 55, y: 68 },
      { x: 45, y: 68 },
      { x: 45, y: 38 },
      { x: 35, y: 38 },
    ],
  },
]

export const level5PointSets: Level5PointSet[] = [
  {
    points: [
      { x: 15, y: 20 },
      { x: 35, y: 15 },
      { x: 25, y: 35 },
      { x: 50, y: 25 },
      { x: 60, y: 10 },
      { x: 70, y: 30 },
      { x: 20, y: 65 },
      { x: 40, y: 70 },
      { x: 30, y: 85 },
      { x: 75, y: 60 },
      { x: 85, y: 75 },
      { x: 90, y: 50 },
    ],
  },
  {
    points: [
      { x: 10, y: 15 },
      { x: 25, y: 10 },
      { x: 20, y: 25 },
      { x: 35, y: 20 },
      { x: 45, y: 12 },
      { x: 55, y: 22 },
      { x: 65, y: 15 },
      { x: 75, y: 25 },
      { x: 15, y: 50 },
      { x: 30, y: 55 },
      { x: 40, y: 45 },
      { x: 60, y: 70 },
      { x: 75, y: 65 },
      { x: 85, y: 80 },
      { x: 70, y: 85 },
    ],
  },
]
