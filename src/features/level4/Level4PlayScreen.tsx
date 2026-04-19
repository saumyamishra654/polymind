import { useEffect, useMemo, useState } from 'react'
import { level4Shapes } from '../../data/levelData'
import type { Level4RoundResult } from '../../types/domain'
import { ReconstructionBoard } from '../reconstruction/ReconstructionBoard'
import type { HintCandidate } from '../reconstruction/types'
import { useReconstructionRound } from '../reconstruction/useReconstructionRound'
import type { Level4Edge } from './level4Scoring'
import { scoreLevel4Round } from './level4Scoring'

type Level4PlayScreenProps = {
  onComplete: (results: Level4RoundResult[]) => void
}

type RoundPhase = 'memorize' | 'reconstruct'

const simpleShapeIndices = [0, 1, 2, 3]
const complexShapeIndices = [4, 5, 6]

function randomFrom(indices: number[]): number {
  return indices[Math.floor(Math.random() * indices.length)]
}

export function Level4PlayScreen({ onComplete }: Level4PlayScreenProps) {
  const [roundIndex, setRoundIndex] = useState(0)
  const [results, setResults] = useState<Level4RoundResult[]>([])
  const [phase, setPhase] = useState<RoundPhase>('memorize')
  const [hintInfo, setHintInfo] = useState('Memorize the nested shapes (5 seconds).')
  const [roundStartTime, setRoundStartTime] = useState(0)
  const [shapeIndex, setShapeIndex] = useState(() => randomFrom(simpleShapeIndices))

  const {
    edges,
    hintsUsed,
    erasedEdges,
    dragStartIndex,
    beginDrag,
    endDrag,
    eraseEdgeAt,
    requestHint,
    getTimingSummary,
    resetRound,
  } = useReconstructionRound<{ isOuter: boolean; color: string }>()

  useEffect(() => {
    resetRound()

    const timeoutId = window.setTimeout(() => {
      setPhase('reconstruct')
      setHintInfo('You can use up to 3 hints (15s gap). Black dots = outer shape, Blue dots = inner shape.')
      setRoundStartTime(performance.now())
    }, 5000)

    return () => window.clearTimeout(timeoutId)
  }, [roundIndex, resetRound])

  const shape = level4Shapes[shapeIndex]
  const outerVertices = shape.outer
  const innerVertices = shape.inner
  const outerCount = outerVertices.length
  const totalVertices = useMemo(() => [...outerVertices, ...innerVertices], [innerVertices, outerVertices])
  const outerPoints = useMemo(() => outerVertices.map((vertex) => `${vertex.x},${vertex.y}`).join(' '), [outerVertices])
  const innerPoints = useMemo(() => innerVertices.map((vertex) => `${vertex.x},${vertex.y}`).join(' '), [innerVertices])

  const roundDifficulty = roundIndex === 0 ? 'Simple' : 'Complex'

  const handleHint = () => {
    if (phase !== 'reconstruct') return

    const outerCandidates: HintCandidate<{ isOuter: boolean; color: string }>[] = Array.from(
      { length: outerCount },
      (_, index) => {
        const a = index
        const b = (index + 1) % outerCount
        return {
          i: Math.min(a, b),
          j: Math.max(a, b),
          extra: { isOuter: true, color: 'black' },
        }
      },
    )

    const innerCandidates: HintCandidate<{ isOuter: boolean; color: string }>[] = Array.from(
      { length: innerVertices.length },
      (_, index) => {
        const a = outerCount + index
        const b = outerCount + ((index + 1) % innerVertices.length)
        return {
          i: Math.min(a, b),
          j: Math.max(a, b),
          extra: { isOuter: false, color: 'blue' },
        }
      },
    )

    const hintResult = requestHint([...outerCandidates, ...innerCandidates])
    setHintInfo(hintResult.message)
  }

  const handleSubmit = () => {
    if (phase !== 'reconstruct') return

    const now = performance.now()
    const timeTaken = ((now - roundStartTime) / 1000).toFixed(2)
    const timing = getTimingSummary(now)

    const roundResult = scoreLevel4Round({
      shapeName: shape.name,
      outerVertices,
      innerVertices,
      edges: edges as Level4Edge[],
      hintsUsed,
      erasedEdges,
      timeTaken,
      avgActionInterval: timing.avgActionInterval,
      timeBeforeSubmit: timing.timeBeforeSubmit,
    })

    const nextResults = [...results, roundResult]
    setResults(nextResults)

    if (roundIndex === 1) {
      onComplete(nextResults)
      return
    }

    setPhase('memorize')
    setHintInfo('Memorize the nested shapes (5 seconds).')
    setRoundStartTime(0)
    setShapeIndex(randomFrom(complexShapeIndices))
    setRoundIndex((prev) => prev + 1)
  }

  return (
    <main className="screen active">
      <div style={{ textAlign: 'center' }}>
        <h2>Level 4</h2>
        <p>
          {phase === 'memorize'
            ? `Memorize the nested shapes (${roundDifficulty}).`
            : 'Reconstruct both the outer (black) and inner (blue) shapes.'}
        </p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 20 }}>
        {phase === 'memorize' ? (
          <svg viewBox="0 0 100 100" width="500" height="500">
            <polygon points={outerPoints} fill="none" stroke="black" strokeWidth={2} />
            <polygon points={innerPoints} fill="none" stroke="blue" strokeWidth={2} />
          </svg>
        ) : (
          <ReconstructionBoard
            vertices={totalVertices}
            edges={edges}
            onStartEdge={beginDrag}
            onEndEdge={(vertexIndex) => {
              const start = dragStartIndex
              const isOuter = start !== null && start < outerCount && vertexIndex < outerCount
              endDrag(vertexIndex, { isOuter, color: isOuter ? 'black' : 'blue' })
            }}
            onEraseEdge={eraseEdgeAt}
            width={500}
            height={500}
            pointColor={(index) => (index < outerCount ? 'black' : 'blue')}
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
