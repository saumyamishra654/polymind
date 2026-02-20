import type { Level1RoundResult, Level1Results } from '../../types/domain'

type Level1ResultsScreenProps = {
  results: Level1Results
  onNext: () => void
}

function RoundSummary({ label, result }: { label: string; result: Level1RoundResult }) {
  return (
    <>
      <h3 style={{ textAlign: 'center' }}>{label}</h3>
      <table className="results-table">
        <tbody>
          <tr>
            <td>Result</td>
            <td>{result.correct ? 'Correct' : 'Wrong'}</td>
          </tr>
          <tr>
            <td>Time Taken</td>
            <td>{result.time} sec</td>
          </tr>
          <tr>
            <td>Avg Time Between Actions</td>
            <td>{result.avgActionInterval} sec</td>
          </tr>
          <tr>
            <td>Time Before Submit</td>
            <td>{result.timeBeforeSubmit} sec</td>
          </tr>
        </tbody>
      </table>

      {!result.correct ? (
        <div className="resultShapes">
          <div>
            Original:
            <br />
            <svg viewBox="0 0 100 100" width="160" height="160" stroke="black" fill="none" strokeWidth="3">
              <g dangerouslySetInnerHTML={{ __html: result.correctSvg }} />
            </svg>
          </div>
          <div>
            Selected:
            <br />
            <svg viewBox="0 0 100 100" width="160" height="160" stroke="black" fill="none" strokeWidth="3">
              <g dangerouslySetInnerHTML={{ __html: result.selectedSvg }} />
            </svg>
          </div>
        </div>
      ) : null}
    </>
  )
}

export function Level1ResultsScreen({ results, onNext }: Level1ResultsScreenProps) {
  return (
    <main className="screen active">
      <div style={{ textAlign: 'center', marginTop: '3%' }}>
        <h2>Level 1 Results</h2>
        <RoundSummary label="Round 1 — Flip" result={results.flip} />
        <RoundSummary label="Round 2 — Rotation" result={results.rotation} />
        <button onClick={onNext}>Go to Level 2</button>
      </div>
    </main>
  )
}
