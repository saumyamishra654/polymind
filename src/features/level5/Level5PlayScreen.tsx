import { useEffect, useMemo, useRef, useState } from 'react'
import { level5PointSets } from '../../data/levelData'
import type { Level5RoundResult } from '../../types/domain'
import { ReconstructionBoard } from '../reconstruction/ReconstructionBoard'
import { useReconstructionRound } from '../reconstruction/useReconstructionRound'
import type { Level5Edge } from './level5Scoring'
import { scoreLevel5Round } from './level5Scoring'

type Level5PlayScreenProps = {
  onComplete: (results: Level5RoundResult[]) => void
}

function assignTriangleNumber(edges: Level5Edge[], startIndex: number, endIndex: number): 1 | 2 {
  const triangle1Vertices = new Set<number>()
  const triangle2Vertices = new Set<number>()

  edges.forEach((edge) => {
    if (edge.triangleNum === 1) {
      triangle1Vertices.add(edge.i)
      triangle1Vertices.add(edge.j)
      return
    }

    if (edge.triangleNum === 2) {
      triangle2Vertices.add(edge.i)
      triangle2Vertices.add(edge.j)
    }
  })

  if (triangle1Vertices.has(startIndex) || triangle1Vertices.has(endIndex)) {
    return 1
  }

  if (triangle2Vertices.has(startIndex) || triangle2Vertices.has(endIndex)) {
    return 2
  }

  if (triangle1Vertices.size < 3) {
    return 1
  }

  return 2
}

export function Level5PlayScreen({ onComplete }: Level5PlayScreenProps) {
  const [roundIndex, setRoundIndex] = useState(0)
  const [results, setResults] = useState<Level5RoundResult[]>([])
  const roundStartTimeRef = useRef(0)

  const { edges, erasedEdges, dragStartIndex, beginDrag, endDrag, eraseEdgeAt, getTimingSummary, resetRound } =
    useReconstructionRound<{ triangleNum: number; color: string }>({})

  const points = level5PointSets[roundIndex].points

  useEffect(() => {
    resetRound()
    roundStartTimeRef.current = performance.now()
  }, [roundIndex, resetRound])

  const triangle1Vertices = useMemo(() => {
    const vertices = new Set<number>()
    ;(edges as Level5Edge[]).forEach((edge) => {
      if (edge.triangleNum !== 1) return
      vertices.add(edge.i)
      vertices.add(edge.j)
    })
    return vertices
  }, [edges])

  const triangle2Vertices = useMemo(() => {
    const vertices = new Set<number>()
    ;(edges as Level5Edge[]).forEach((edge) => {
      if (edge.triangleNum !== 2) return
      vertices.add(edge.i)
      vertices.add(edge.j)
    })
    return vertices
  }, [edges])

  const handleSubmit = () => {
    const now = performance.now()
    const timeTaken = ((now - roundStartTimeRef.current) / 1000).toFixed(2)
    const timing = getTimingSummary(now)

    const roundResult = scoreLevel5Round({
      points,
      edges: edges as Level5Edge[],
      erasedEdges,
      timeTaken,
      avgActionInterval: timing.avgActionInterval,
      timeBeforeSubmit: timing.timeBeforeSubmit,
    })

    const nextResults = [...results, roundResult]
    setResults(nextResults)

    if (roundIndex === level5PointSets.length - 1) {
      onComplete(nextResults)
      return
    }

    setRoundIndex((prev) => prev + 1)
  }

  return (
    <main className="screen active">
      <div style={{ textAlign: 'center' }}>
        <h2>Level 5</h2>
        <p>Round {roundIndex + 1}: Create two separate triangles that do not touch.</p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 20 }}>
        <ReconstructionBoard
          vertices={points}
          edges={edges}
          onStartEdge={beginDrag}
          onEndEdge={(vertexIndex) => {
            const start = dragStartIndex
            if (start === null) {
              return
            }

            const triangleNum = assignTriangleNumber(edges as Level5Edge[], start, vertexIndex)
            endDrag(vertexIndex, { triangleNum, color: triangleNum === 1 ? 'black' : 'blue' })
          }}
          onEraseEdge={eraseEdgeAt}
          width={500}
          height={500}
          pointColor={(index) => {
            if (triangle1Vertices.has(index) && triangle2Vertices.has(index)) return 'red'
            if (triangle1Vertices.has(index)) return 'black'
            if (triangle2Vertices.has(index)) return 'blue'
            return '#666'
          }}
        />
      </div>

      <div style={{ textAlign: 'center', marginTop: 20 }}>
        <button onClick={handleSubmit}>Submit</button>
        <div style={{ marginTop: 10, fontSize: 14, color: '#555' }}>
          Draw your first triangle (black), then your second triangle (blue).
        </div>
      </div>
    </main>
  )
}
