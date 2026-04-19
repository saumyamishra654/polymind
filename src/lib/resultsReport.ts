import type {
  Level1Results,
  Level2RoundResult,
  Level3RoundResult,
  Level4RoundResult,
  Level5RoundResult,
} from '../types/domain'

export type AssessmentResults = {
  level1: Level1Results | null
  level2: Level2RoundResult[]
  level3: Level3RoundResult[]
  level4: Level4RoundResult[]
  level5: Level5RoundResult[]
}

export type ReportRow = {
  label: string
  value: string
}

export type ReportRound = {
  title: string
  rows: ReportRow[]
}

export type ReportSection = {
  id: 'level1' | 'level2' | 'level3' | 'level4' | 'level5'
  title: string
  rounds: ReportRound[]
}

export type PerformanceSeries = {
  labels: string[]
  dataPoints: number[]
}

function yesNo(value: boolean): string {
  return value ? 'Yes' : 'No'
}

function parseAvg(value: string): number {
  const parsed = Number.parseFloat(value)
  if (Number.isNaN(parsed)) return 0
  return parsed
}

function buildLevel1Rounds(level1: Level1Results | null): ReportRound[] {
  const flip = level1?.flip
  const rotation = level1?.rotation

  return [
    {
      title: 'Round 1 — Flip',
      rows: [
        { label: 'Result', value: flip ? (flip.correct ? 'Correct' : 'Wrong') : 'N/A' },
        { label: 'Time Taken', value: `${flip ? flip.time : 'N/A'} sec` },
        { label: 'Avg Time Between Actions', value: `${flip ? flip.avgActionInterval : 'N/A'} sec` },
        { label: 'Time Before Submit', value: `${flip ? flip.timeBeforeSubmit : 'N/A'} sec` },
      ],
    },
    {
      title: 'Round 2 — Rotation',
      rows: [
        { label: 'Result', value: rotation ? (rotation.correct ? 'Correct' : 'Wrong') : 'N/A' },
        { label: 'Time Taken', value: `${rotation ? rotation.time : 'N/A'} sec` },
        { label: 'Avg Time Between Actions', value: `${rotation ? rotation.avgActionInterval : 'N/A'} sec` },
        { label: 'Time Before Submit', value: `${rotation ? rotation.timeBeforeSubmit : 'N/A'} sec` },
      ],
    },
  ]
}

function buildLevel2Rounds(level2: Level2RoundResult[]): ReportRound[] {
  return level2.map((round, index) => ({
    title: `Round ${index + 1}`,
    rows: [
      { label: 'Result', value: round.correct ? 'Correct' : 'Wrong' },
      { label: 'Time Taken', value: `${round.time} sec` },
      { label: 'Hints Used', value: `${round.hints}` },
      { label: 'Edges Missing', value: `${round.missing}` },
      { label: 'Wrong Edges', value: `${round.wrong}` },
      { label: 'Edge Intersect', value: yesNo(round.intersect) },
      { label: 'Closed Shape', value: yesNo(round.closed) },
      { label: 'Edges Erased', value: `${round.erased}` },
      { label: 'Followed Order', value: yesNo(round.followOrder) },
      { label: 'Avg Time Between Actions', value: `${round.avgActionInterval} sec` },
      { label: 'Time Before Submit', value: `${round.timeBeforeSubmit} sec` },
    ],
  }))
}

function buildLevel3Rounds(level3: Level3RoundResult[]): ReportRound[] {
  return level3.map((round, index) => ({
    title: `Round ${index + 1}`,
    rows: [
      { label: 'Result', value: round.correct ? 'Correct' : 'Wrong' },
      { label: 'Time Taken', value: `${round.time} sec` },
      { label: 'Hints Used', value: `${round.hints}` },
      { label: 'Edges Missing', value: `${round.missing}` },
      { label: 'Wrong Edges', value: `${round.wrong}` },
      { label: 'Edge Intersect', value: yesNo(round.intersect) },
      { label: 'Closed Shape', value: yesNo(round.closed) },
      { label: 'Edges Erased', value: `${round.erased}` },
      { label: 'Avg Time Between Actions', value: `${round.avgActionInterval} sec` },
      { label: 'Time Before Submit', value: `${round.timeBeforeSubmit} sec` },
    ],
  }))
}

function buildLevel4Rounds(level4: Level4RoundResult[]): ReportRound[] {
  return level4.map((round, index) => ({
    title: `Round ${index + 1} (${round.shapeName})`,
    rows: [
      { label: 'Result', value: round.correct ? 'Correct' : 'Wrong' },
      { label: 'Time Taken', value: `${round.time} sec` },
      { label: 'Hints Used', value: `${round.hints}` },
      { label: 'Outer Edges Missing', value: `${round.outerMissing}` },
      { label: 'Outer Wrong Edges', value: `${round.outerWrong}` },
      { label: 'Inner Edges Missing', value: `${round.innerMissing}` },
      { label: 'Inner Wrong Edges', value: `${round.innerWrong}` },
      { label: 'Total Missing', value: `${round.totalMissing}` },
      { label: 'Total Wrong', value: `${round.totalWrong}` },
      { label: 'Edge Intersect', value: yesNo(round.intersect) },
      { label: 'Edges Erased', value: `${round.erased}` },
      { label: 'Avg Time Between Actions', value: `${round.avgActionInterval} sec` },
      { label: 'Time Before Submit', value: `${round.timeBeforeSubmit} sec` },
    ],
  }))
}

function buildLevel5Rounds(level5: Level5RoundResult[]): ReportRound[] {
  return level5.map((round, index) => ({
    title: `Round ${index + 1}`,
    rows: [
      { label: 'Result', value: round.correct ? 'Correct' : 'Wrong' },
      { label: 'Time Taken', value: `${round.time} sec` },
      { label: 'Has Two Triangles', value: yesNo(round.hasTwoTriangles) },
      { label: 'Triangle 1 Valid', value: yesNo(round.triangle1Valid) },
      { label: 'Triangle 2 Valid', value: yesNo(round.triangle2Valid) },
      { label: 'Triangles Separate', value: yesNo(round.trianglesSeparate) },
      { label: 'Shared Vertices', value: `${round.sharedVertexCount}` },
      { label: 'Shared Edges', value: `${round.sharedEdgeCount}` },
      { label: 'Edges Intersect', value: yesNo(round.hasIntersection) },
      { label: 'Edges Erased', value: `${round.erased}` },
      { label: 'Avg Time Between Actions', value: `${round.avgActionInterval} sec` },
      { label: 'Time Before Submit', value: `${round.timeBeforeSubmit} sec` },
    ],
  }))
}

export function buildFinalReportSections(results: AssessmentResults): ReportSection[] {
  return [
    {
      id: 'level1',
      title: 'Level 1 - Mental Rotation',
      rounds: buildLevel1Rounds(results.level1),
    },
    {
      id: 'level2',
      title: 'Level 2 - Labeled Reconstruction',
      rounds: buildLevel2Rounds(results.level2),
    },
    {
      id: 'level3',
      title: 'Level 3 - Unlabeled Reconstruction',
      rounds: buildLevel3Rounds(results.level3),
    },
    {
      id: 'level4',
      title: 'Level 4 - Nested Shapes',
      rounds: buildLevel4Rounds(results.level4),
    },
    {
      id: 'level5',
      title: 'Level 5 - Separate Triangles',
      rounds: buildLevel5Rounds(results.level5),
    },
  ]
}

export function buildPerformanceSeries(results: AssessmentResults): PerformanceSeries {
  const dataPoints: number[] = []
  const labels: string[] = []

  if (results.level1?.flip) {
    dataPoints.push(parseAvg(results.level1.flip.avgActionInterval))
    labels.push('L1-Flip')
  }

  if (results.level1?.rotation) {
    dataPoints.push(parseAvg(results.level1.rotation.avgActionInterval))
    labels.push('L1-Rot')
  }

  results.level2.forEach((round, index) => {
    dataPoints.push(parseAvg(round.avgActionInterval))
    labels.push(`L2-R${index + 1}`)
  })

  results.level3.forEach((round, index) => {
    dataPoints.push(parseAvg(round.avgActionInterval))
    labels.push(`L3-R${index + 1}`)
  })

  results.level4.forEach((round, index) => {
    dataPoints.push(parseAvg(round.avgActionInterval))
    labels.push(`L4-R${index + 1}`)
  })

  results.level5.forEach((round, index) => {
    dataPoints.push(parseAvg(round.avgActionInterval))
    labels.push(`L5-R${index + 1}`)
  })

  return { labels, dataPoints }
}
