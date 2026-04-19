import { useMemo, useState } from 'react'
import {
  level1Distractors,
  level1FlipProblems,
  level1RotationProblems,
} from '../../data/levelData'
import type { Level1RoundResult, Level1Results, Level1Stage } from '../../types/domain'

type OptionItem = {
  id: string
  svg: string
  correct: boolean
}

type Level1PlayScreenProps = {
  onComplete: (results: Level1Results) => void
}

function shuffle<T>(arr: T[]): T[] {
  return arr
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map((entry) => entry.value)
}

function average(values: number[]): string {
  if (values.length === 0) return 'N/A'
  const total = values.reduce((sum, value) => sum + value, 0)
  return (total / values.length).toFixed(2)
}

function finalInterval(values: number[]): string {
  if (values.length === 0) return 'N/A'
  return values[values.length - 1].toFixed(2)
}

function selectProblem(stage: Level1Stage) {
  const source = stage === 'flip' ? level1FlipProblems : level1RotationProblems
  return source[Math.floor(Math.random() * source.length)]
}

function buildOptions(correct: string): OptionItem[] {
  const list: OptionItem[] = [
    { id: 'correct', svg: correct, correct: true },
    ...shuffle(level1Distractors)
      .slice(0, 3)
      .map((svg, index) => ({ id: `d-${index}`, svg, correct: false })),
  ]

  return shuffle(list)
}

function nowMs(): number {
  return performance.now()
}

export function Level1PlayScreen({ onComplete }: Level1PlayScreenProps) {
  const [stage, setStage] = useState<Level1Stage>('flip')
  const [flipStart] = useState(() => nowMs())
  const [rotationStart, setRotationStart] = useState<number | null>(null)

  const [flipIntervals, setFlipIntervals] = useState<number[]>([])
  const [rotationIntervals, setRotationIntervals] = useState<number[]>([])
  const [flipLastAction, setFlipLastAction] = useState<number>(0)
  const [rotationLastAction, setRotationLastAction] = useState<number>(0)

  const [flipResult, setFlipResult] = useState<Level1RoundResult | null>(null)

  const question = useMemo(() => {
    const problem = selectProblem(stage)
    return {
      target: problem.target,
      correctSvg: problem.correct,
      options: buildOptions(problem.correct),
    }
  }, [stage])

  const [selectedId, setSelectedId] = useState<string | null>(null)

  const selectedOption = question.options.find((option) => option.id === selectedId) ?? null

  const taskLabel = stage === 'flip' ? 'Task: Choose the flipped shape' : 'Task: Choose the rotated shape'

  const handleSelect = (optionId: string) => {
    const now = nowMs()

    if (stage === 'flip') {
      if (flipLastAction > 0) {
        setFlipIntervals((prev) => [...prev, (now - flipLastAction) / 1000])
      }
      setFlipLastAction(now)
    } else {
      if (rotationLastAction > 0) {
        setRotationIntervals((prev) => [...prev, (now - rotationLastAction) / 1000])
      }
      setRotationLastAction(now)
    }

    setSelectedId(optionId)
  }

  const handleSubmit = () => {
    if (!selectedOption) return

    const now = nowMs()
    const selectedSvg = selectedOption.svg

    if (stage === 'flip') {
      const updatedIntervals = [...flipIntervals]
      if (flipLastAction > 0) updatedIntervals.push((now - flipLastAction) / 1000)

      const roundResult: Level1RoundResult = {
        correct: selectedOption.correct,
        time: ((now - flipStart) / 1000).toFixed(2),
        avgActionInterval: average(updatedIntervals),
        timeBeforeSubmit: finalInterval(updatedIntervals),
        correctSvg: question.correctSvg,
        selectedSvg,
      }

      setFlipResult(roundResult)
      setStage('rotation')
      setSelectedId(null)
      setRotationStart(nowMs())
      return
    }

    const activeRotationStart = rotationStart ?? now
    const updatedIntervals = [...rotationIntervals]
    if (rotationLastAction > 0) updatedIntervals.push((now - rotationLastAction) / 1000)

    const roundResult: Level1RoundResult = {
      correct: selectedOption.correct,
      time: ((now - activeRotationStart) / 1000).toFixed(2),
      avgActionInterval: average(updatedIntervals),
      timeBeforeSubmit: finalInterval(updatedIntervals),
      correctSvg: question.correctSvg,
      selectedSvg,
    }

    const complete: Level1Results = {
      flip:
        flipResult ?? {
          correct: false,
          time: '0.00',
          avgActionInterval: 'N/A',
          timeBeforeSubmit: 'N/A',
          correctSvg: '',
          selectedSvg: '',
        },
      rotation: roundResult,
    }

    onComplete(complete)
  }

  return (
    <main className="screen active">
      <div style={{ textAlign: 'center' }}>
        <h2>Level 1</h2>
        <p>{taskLabel}</p>
      </div>

      <div className="question">
        <div className="panel">
          <svg width="260" height="260" viewBox="0 0 100 100" stroke="black" fill="none" strokeWidth="3">
            <g dangerouslySetInnerHTML={{ __html: question.target }} />
          </svg>
        </div>

        <div className="panel">
          <div className="options">
            {question.options.map((option) => (
              <svg
                key={option.id}
                className={`option ${selectedId === option.id ? 'selected' : ''}`}
                width="160"
                height="160"
                viewBox="0 0 100 100"
                stroke="black"
                fill="none"
                strokeWidth="3"
                onClick={() => handleSelect(option.id)}
              >
                <g dangerouslySetInnerHTML={{ __html: option.svg }} />
              </svg>
            ))}
          </div>
        </div>
      </div>

      <div style={{ textAlign: 'center' }}>
        <button onClick={handleSubmit} disabled={!selectedOption}>
          Submit
        </button>
      </div>
    </main>
  )
}
