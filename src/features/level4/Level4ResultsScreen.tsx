import type { Level4RoundResult } from '../../types/domain'

type Level4ResultsScreenProps = {
  results: Level4RoundResult[]
  onNext: () => void
}

function yesNo(value: boolean): string {
  return value ? 'Yes' : 'No'
}

export function Level4ResultsScreen({ results, onNext }: Level4ResultsScreenProps) {
  return (
    <main className="screen active">
      <div style={{ textAlign: 'center', marginTop: '3%' }}>
        <h2>Level 4 Results</h2>
        {results.map((result, index) => (
          <div key={`l4-round-${index}`}>
            <h3 style={{ textAlign: 'center' }}>
              Round {index + 1} ({result.shapeName})
            </h3>
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
                  <td>Hints Used</td>
                  <td>{result.hints}</td>
                </tr>
                <tr>
                  <td>Outer Edges Missing</td>
                  <td>{result.outerMissing}</td>
                </tr>
                <tr>
                  <td>Outer Edges Wrong</td>
                  <td>{result.outerWrong}</td>
                </tr>
                <tr>
                  <td>Inner Edges Missing</td>
                  <td>{result.innerMissing}</td>
                </tr>
                <tr>
                  <td>Inner Edges Wrong</td>
                  <td>{result.innerWrong}</td>
                </tr>
                <tr>
                  <td>Total Missing</td>
                  <td>{result.totalMissing}</td>
                </tr>
                <tr>
                  <td>Total Wrong</td>
                  <td>{result.totalWrong}</td>
                </tr>
                <tr>
                  <td>Any Intersections</td>
                  <td>{yesNo(result.intersect)}</td>
                </tr>
                <tr>
                  <td>Edges Erased</td>
                  <td>{result.erased}</td>
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
          </div>
        ))}
        <button onClick={onNext}>Go to Level 5</button>
      </div>
    </main>
  )
}
