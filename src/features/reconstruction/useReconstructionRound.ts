import { useCallback, useState } from 'react'
import { edgeKey } from '../../lib/geometry'
import type { HintCandidate, HintResult, ReconstructionEdge, ReconstructionTiming } from './types'

type UseReconstructionRoundOptions = {
  hintLimit?: number
  hintCooldownMs?: number
}

export function useReconstructionRound<TExtra extends object = Record<string, never>>({
  hintLimit = 3,
  hintCooldownMs = 15000,
}: UseReconstructionRoundOptions = {}) {
  const [edges, setEdges] = useState<ReconstructionEdge<TExtra>[]>([])
  const [edgeHistory, setEdgeHistory] = useState<ReconstructionEdge<TExtra>[]>([])
  const [hintsUsed, setHintsUsed] = useState(0)
  const [lastHintTime, setLastHintTime] = useState(0)
  const [erasedEdges, setErasedEdges] = useState(0)
  const [dragStartIndex, setDragStartIndex] = useState<number | null>(null)
  const [lastActionTime, setLastActionTime] = useState(0)
  const [actionIntervals, setActionIntervals] = useState<number[]>([])

  const recordAction = useCallback(
    (timestamp: number) => {
      setActionIntervals((prev) => {
        if (lastActionTime <= 0) {
          return prev
        }
        return [...prev, (timestamp - lastActionTime) / 1000]
      })
      setLastActionTime(timestamp)
    },
    [lastActionTime],
  )

  const addEdge = useCallback(
    (i: number, j: number, extra?: TExtra): boolean => {
      if (i === j) return false

      const candidate = { i, j, ...(extra ?? {}) } as ReconstructionEdge<TExtra>
      const candidateKey = edgeKey(candidate)
      if (edges.some((edge) => edgeKey(edge) === candidateKey)) {
        return false
      }

      setEdges((prev) => [...prev, candidate])
      setEdgeHistory((prev) => [...prev, candidate])
      recordAction(performance.now())
      return true
    },
    [edges, recordAction],
  )

  const eraseEdgeAt = useCallback(
    (index: number) => {
      if (index < 0 || index >= edges.length) return

      setEdges((prev) => prev.filter((_, edgeIndex) => edgeIndex !== index))
      setErasedEdges((prev) => prev + 1)
      recordAction(performance.now())
    },
    [edges.length, recordAction],
  )

  const beginDrag = useCallback((index: number) => {
    setDragStartIndex(index)
  }, [])

  const endDrag = useCallback(
    (endIndex: number, extra?: TExtra): boolean => {
      if (dragStartIndex === null || dragStartIndex === endIndex) {
        setDragStartIndex(null)
        return false
      }

      const added = addEdge(dragStartIndex, endIndex, extra)
      setDragStartIndex(null)
      return added
    },
    [addEdge, dragStartIndex],
  )

  const getHintCooldownRemainingSeconds = useCallback(
    (now = Date.now()): number => {
      if (!lastHintTime) return 0
      const remainingMs = hintCooldownMs - (now - lastHintTime)
      if (remainingMs <= 0) return 0
      return Math.ceil(remainingMs / 1000)
    },
    [hintCooldownMs, lastHintTime],
  )

  const requestHint = useCallback(
    (candidates: Array<HintCandidate<TExtra>>): HintResult<TExtra> => {
      const now = Date.now()

      if (hintsUsed >= hintLimit) {
        return { status: 'maxed', message: 'Maximum hints used.' }
      }

      const remaining = getHintCooldownRemainingSeconds(now)
      if (remaining > 0) {
        return { status: 'cooldown', message: `Next hint in ${remaining}s` }
      }

      const chosen = candidates.find(
        (candidate) => !edges.some((edge) => edgeKey(edge) === edgeKey(candidate)),
      )

      if (!chosen) {
        return { status: 'complete', message: 'All edges already revealed.' }
      }

      const nextHintsUsed = hintsUsed + 1
      const edge = { i: chosen.i, j: chosen.j, ...(chosen.extra ?? {}) } as ReconstructionEdge<TExtra>
      addEdge(edge.i, edge.j, chosen.extra)
      setHintsUsed(nextHintsUsed)
      setLastHintTime(now)

      return {
        status: 'used',
        message: `Hints used: ${nextHintsUsed}/${hintLimit}`,
        edge,
      }
    },
    [addEdge, edges, getHintCooldownRemainingSeconds, hintLimit, hintsUsed],
  )

  const getTimingSummary = useCallback(
    (now = performance.now()): ReconstructionTiming => {
      const intervals = [...actionIntervals]
      if (lastActionTime > 0) {
        intervals.push((now - lastActionTime) / 1000)
      }

      if (intervals.length === 0) {
        return {
          avgActionInterval: '0',
          timeBeforeSubmit: '0',
        }
      }

      const avg = intervals.reduce((sum, value) => sum + value, 0) / intervals.length
      return {
        avgActionInterval: avg.toFixed(2),
        timeBeforeSubmit: intervals[intervals.length - 1].toFixed(2),
      }
    },
    [actionIntervals, lastActionTime],
  )

  const resetRound = useCallback(() => {
    setEdges([])
    setEdgeHistory([])
    setHintsUsed(0)
    setLastHintTime(0)
    setErasedEdges(0)
    setDragStartIndex(null)
    setLastActionTime(0)
    setActionIntervals([])
  }, [])

  return {
    edges,
    edgeHistory,
    hintsUsed,
    erasedEdges,
    dragStartIndex,
    actionIntervals,
    beginDrag,
    endDrag,
    addEdge,
    eraseEdgeAt,
    requestHint,
    getHintCooldownRemainingSeconds,
    getTimingSummary,
    resetRound,
  }
}
