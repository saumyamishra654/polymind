import type { AssessmentResults } from './resultsReport'

type CsvCell = string | number

function yesNo(value: boolean): string {
  return value ? 'Yes' : 'No'
}

function csvHeader(): CsvCell[] {
  return [
    'Level',
    'Round/Type',
    'Result',
    'Time (sec)',
    'Avg Action Interval (sec)',
    'Time Before Submit (sec)',
    'Hints Used',
    'Edges Missing',
    'Edges Wrong',
    'Intersections',
    'Closed Shape',
    'Edges Erased',
    'Followed Order',
    'Triangle Validity',
    'Additional Info',
  ]
}

export function buildResultsCsvRows(results: AssessmentResults): CsvCell[][] {
  const rows: CsvCell[][] = []

  if (results.level1?.flip) {
    rows.push([
      'Level 1',
      'Flip',
      results.level1.flip.correct ? 'Correct' : 'Wrong',
      results.level1.flip.time,
      results.level1.flip.avgActionInterval,
      results.level1.flip.timeBeforeSubmit,
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
    ])
  }

  if (results.level1?.rotation) {
    rows.push([
      'Level 1',
      'Rotation',
      results.level1.rotation.correct ? 'Correct' : 'Wrong',
      results.level1.rotation.time,
      results.level1.rotation.avgActionInterval,
      results.level1.rotation.timeBeforeSubmit,
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
    ])
  }

  results.level2.forEach((round, index) => {
    rows.push([
      'Level 2',
      `Round ${index + 1}`,
      round.correct ? 'Correct' : 'Wrong',
      round.time,
      round.avgActionInterval,
      round.timeBeforeSubmit,
      round.hints,
      round.missing,
      round.wrong,
      yesNo(round.intersect),
      yesNo(round.closed),
      round.erased,
      yesNo(round.followOrder),
      '',
      '',
    ])
  })

  results.level3.forEach((round, index) => {
    rows.push([
      'Level 3',
      `Round ${index + 1}`,
      round.correct ? 'Correct' : 'Wrong',
      round.time,
      round.avgActionInterval,
      round.timeBeforeSubmit,
      round.hints,
      round.missing,
      round.wrong,
      yesNo(round.intersect),
      yesNo(round.closed),
      round.erased,
      '',
      '',
      '',
    ])
  })

  results.level4.forEach((round, index) => {
    rows.push([
      'Level 4',
      `${round.shapeName} (Round ${index + 1})`,
      round.correct ? 'Correct' : 'Wrong',
      round.time,
      round.avgActionInterval,
      round.timeBeforeSubmit,
      round.hints,
      `Outer: ${round.outerMissing}, Inner: ${round.innerMissing}, Total: ${round.totalMissing}`,
      `Outer: ${round.outerWrong}, Inner: ${round.innerWrong}, Total: ${round.totalWrong}`,
      yesNo(round.intersect),
      '',
      round.erased,
      '',
      '',
      '',
    ])
  })

  results.level5.forEach((round, index) => {
    rows.push([
      'Level 5',
      `Round ${index + 1}`,
      round.correct ? 'Correct' : 'Wrong',
      round.time,
      round.avgActionInterval,
      round.timeBeforeSubmit,
      '',
      '',
      '',
      yesNo(round.hasIntersection),
      '',
      round.erased,
      '',
      `T1: ${yesNo(round.triangle1Valid)}, T2: ${yesNo(round.triangle2Valid)}`,
      `Shared vertices: ${round.sharedVertexCount}, Shared edges: ${round.sharedEdgeCount}, Separate: ${yesNo(round.trianglesSeparate)}`,
    ])
  })

  return [csvHeader(), ...rows]
}

function escapeCell(value: CsvCell): string {
  const text = String(value)
  if (!text.includes(',') && !text.includes('"') && !text.includes('\n')) {
    return text
  }
  return `"${text.replaceAll('"', '""')}"`
}

export function convertRowsToCsv(rows: CsvCell[][]): string {
  return rows.map((row) => row.map(escapeCell).join(',')).join('\n')
}

export function downloadResultsCsv(results: AssessmentResults): void {
  const rows = buildResultsCsvRows(results)
  const csvContent = convertRowsToCsv(rows)
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5)

  link.setAttribute('href', url)
  link.setAttribute('download', `polymind_results_${timestamp}.csv`)
  link.style.visibility = 'hidden'

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
