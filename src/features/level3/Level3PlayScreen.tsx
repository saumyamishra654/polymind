import { useEffect, useMemo, useState } from 'react'
import { level3Polygons } from '../../data/levelData'
import type { Level3RoundResult } from '../../types/domain'
import { ReconstructionBoard } from '../reconstruction/ReconstructionBoard'
import type { HintCandidate } from '../reconstruction/types'
import { useReconstructionRound } from '../reconstruction/useReconstructionRound'
import { scoreLevel3Round } from './level3Scoring'

type Level3PlayScreenProps = {
  onComplete: (results: Level3RoundResult[]) => void
}

type RoundPhase = 'memorize' | 'reconstruct'

export function Level3PlayScreen({ onComplete }: Level3PlayScreenProps) {
  const [roundIndex, setRoundIndex] = useState(0)
  const [results, setResults] = useState<Level3RoundResult[]>([])
  const [phase, setPhase] = useState<RoundPhase>('memorize')
  const [hintInfo, setHintInfo] = useState('Memorize the polygon (5 seconds).')
  const [roundStartTime, setRoundStartTime] = useState(0)

  const { edges, hintsUsed, erasedEdges, beginDrag, endDrag, eraseEdgeAt, requestHint, getTimingSummary, resetRound } =
    useReconstructionRound()

  const vertices = level3Polygons[roundIndex].vertices

  useEffect(() => {
    resetRound()

    const timeoutId = window.setTimeout(() => {
      setPhase('reconstruct')
      setHintInfo('You can use up to 3 hints (15s gap).')
      setRoundStartTime(performance.now())
    }, 5000)

    return () => window.clearTimeout(timeoutId)
  }, [roundIndex, resetRound])

  const polygonPoints = useMemo(() => vertices.map((vertex) => `${vertex.x},${vertex.y}`).join(' '), [vertices])

  const handleHint = () => {
    if (phase !== 'reconstruct') return

    const candidates: HintCandidate[] = Array.from({ length: vertices.length }, (_, index) => {
      const a = index
      const b = (index + 1) % vertices.length
      return {
        i: Math.min(a, b),
        j: Math.max(a, b),
      }
    })

    const hintResult = requestHint(candidates)
    setHintInfo(hintResult.message)
  }

  const handleSubmit = () => {
    if (phase !== 'reconstruct') return

    const now = performance.now()
    const timeTaken = ((now - roundStartTime) / 1000).toFixed(2)
    const timing = getTimingSummary(now)

    const roundResult = scoreLevel3Round({
      vertices,
      edges,
      hintsUsed,
      erasedEdges,
      timeTaken,
      avgActionInterval: timing.avgActionInterval,
      timeBeforeSubmit: timing.timeBeforeSubmit,
    })

    const nextResults = [...results, roundResult]
    setResults(nextResults)

    if (roundIndex === level3Polygons.length - 1) {
      onComplete(nextResults)
      return
    }

    setPhase('memorize')
    setHintInfo('Memorize the polygon (5 seconds).')
    setRoundStartTime(0)
    setRoundIndex((prev) => prev + 1)
  }

  return (
    <main className="screen active">
      <div style={{ textAlign: 'center' }}>
        <h2>Level 3</h2>
        <p>{phase === 'memorize' ? 'Memorize the polygon.' : 'Reconstruct the polygon.'}</p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 20 }}>
        {phase === 'memorize' ? (
          <svg viewBox="0 0 100 100" width="400" height="400">
            <polygon points={polygonPoints} fill="none" stroke="black" strokeWidth={2} />
          </svg>
        ) : (
          <ReconstructionBoard
            vertices={vertices}
            edges={edges}
            onStartEdge={beginDrag}
            onEndEdge={(vertexIndex) => {
              endDrag(vertexIndex)
            }}
            onEraseEdge={eraseEdgeAt}
            width={400}
            height={400}
          />
        )}
      </div>

      <div style={{ textAlign: 'center', marginTop: 20 }}>
        <button onClick={handleHint} disabled={phase !== 'reconstruct'}>
          Hint
        </button>
        <button onClick={handleSubmit} disabled={phase !== 'reconstruct'} style={{ marginLeft: 10 }}>
          Submit
        </button>
        <div style={{ marginTop: 10, fontSize: 14, color: '#555' }}>{hintInfo}</div>
      </div>
    </main>
  )
}
