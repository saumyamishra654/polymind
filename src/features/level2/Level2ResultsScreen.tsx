import type { Level2RoundResult } from '../../types/domain'

type Level2ResultsScreenProps = {
  results: Level2RoundResult[]
  onNext: () => void
}

function yesNo(value: boolean): string {
  return value ? 'Yes' : 'No'
}

export function Level2ResultsScreen({ results, onNext }: Level2ResultsScreenProps) {
  return (
    <main className="screen active">
      <div style={{ textAlign: 'center', marginTop: '3%' }}>
        <h2>Level 2 Results</h2>
        {results.map((result, index) => (
          <div key={`l2-round-${index}`}>
            <h3 style={{ textAlign: 'center' }}>Round {index + 1}</h3>
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
                  <td>Edges Missing</td>
                  <td>{result.missing}</td>
                </tr>
                <tr>
                  <td>Edges Wrong</td>
                  <td>{result.wrong}</td>
                </tr>
                <tr>
                  <td>Any Intersections</td>
                  <td>{yesNo(result.intersect)}</td>
                </tr>
                <tr>
                  <td>Closed Shape</td>
                  <td>{yesNo(result.closed)}</td>
                </tr>
                <tr>
                  <td>Edges Erased</td>
                  <td>{result.erased}</td>
                </tr>
                <tr>
                  <td>Followed Label Order</td>
                  <td>{yesNo(result.followOrder)}</td>
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
        <button onClick={onNext}>Go to Level 3</button>
      </div>
    </main>
  )
}
