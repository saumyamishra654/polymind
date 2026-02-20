import { useEffect, useMemo, useRef } from 'react'
import { downloadResultsCsv } from '../../lib/csvExport'
import {
  buildFinalReportSections,
  buildPerformanceSeries,
  type AssessmentResults,
  type ReportRound,
} from '../../lib/resultsReport'
import type { AssessmentMode } from '../../types/app'
import { PerformanceGraph } from './PerformanceGraph'

type FinalReportScreenProps = {
  assessmentMode: AssessmentMode
  results: AssessmentResults
  onRestart: () => void
}

function ReportRoundTable({ round }: { round: ReportRound }) {
  return (
    <>
      <h3 style={{ textAlign: 'center' }}>{round.title}</h3>
      <table className="results-table">
        <tbody>
          {round.rows.map((row) => (
            <tr key={row.label}>
              <td>{row.label}</td>
              <td>{row.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}

export function FinalReportScreen({ assessmentMode, results, onRestart }: FinalReportScreenProps) {
  const hasAutoDownloaded = useRef(false)

  const sections = useMemo(() => {
    const allSections = buildFinalReportSections(results)
    if (assessmentMode !== 'patient') {
      return allSections
    }

    return allSections.map((section) => {
      if (section.id === 'level5') {
        return section
      }
      return { ...section, rounds: [] }
    })
  }, [assessmentMode, results])

  const performanceSeries = useMemo(() => buildPerformanceSeries(results), [results])

  useEffect(() => {
    if (assessmentMode !== 'patient') return
    if (hasAutoDownloaded.current) return

    hasAutoDownloaded.current = true
    const timeoutId = window.setTimeout(() => {
      downloadResultsCsv(results)
      window.alert('Assessment complete! Results have been downloaded.')
      onRestart()
    }, 600)

    return () => window.clearTimeout(timeoutId)
  }, [assessmentMode, onRestart, results])

  return (
    <main className="screen active">
      <div style={{ textAlign: 'center', marginTop: '5%', paddingBottom: 50 }}>
        <h2>Complete Assessment Report</h2>

        {sections.map((section) => (
          <div key={section.id} style={{ maxWidth: 800, margin: '30px auto', textAlign: 'left' }}>
            <h2 style={{ textAlign: 'center', borderBottom: '2px solid #333', paddingBottom: 10 }}>
              {section.title}
            </h2>
            {section.rounds.map((round) => (
              <ReportRoundTable key={round.title} round={round} />
            ))}
          </div>
        ))}

        <div style={{ marginTop: 40 }}>
          <h2 style={{ borderBottom: '2px solid #333', paddingBottom: 10, maxWidth: 800, margin: '0 auto' }}>
            Performance Over Time
          </h2>
          <p style={{ fontSize: 14, color: '#555', marginTop: 10 }}>Average time between actions across all levels</p>
          <PerformanceGraph labels={performanceSeries.labels} dataPoints={performanceSeries.dataPoints} />
        </div>

        <button onClick={() => downloadResultsCsv(results)}>Download All Results (CSV)</button>
        <button onClick={() => window.alert('Assessment complete!')} style={{ marginLeft: 10 }}>
          Finish
        </button>
      </div>
    </main>
  )
}
