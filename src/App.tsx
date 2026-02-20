import { useMemo, useState } from 'react'
import { instructionSteps, levelCopy } from './data/appContent'
import { Level1PlayScreen } from './features/level1/Level1PlayScreen'
import { Level1ResultsScreen } from './features/level1/Level1ResultsScreen'
import { Level2PlayScreen } from './features/level2/Level2PlayScreen'
import { Level2ResultsScreen } from './features/level2/Level2ResultsScreen'
import { Level3PlayScreen } from './features/level3/Level3PlayScreen'
import { Level3ResultsScreen } from './features/level3/Level3ResultsScreen'
import { Level4PlayScreen } from './features/level4/Level4PlayScreen'
import { Level4ResultsScreen } from './features/level4/Level4ResultsScreen'
import { Level5PlayScreen } from './features/level5/Level5PlayScreen'
import { FinalReportScreen } from './features/report/FinalReportScreen'
import { DevLevelSelectionScreen } from './features/screens/DevLevelSelectionScreen'
import { IntroScreen } from './features/screens/IntroScreen'
import { InstructionsScreen } from './features/screens/InstructionsScreen'
import { LevelIntroScreen } from './features/screens/LevelScreens'
import { ModeSelectionScreen } from './features/screens/ModeSelectionScreen'
import type { AssessmentResults } from './lib/resultsReport'
import type { AssessmentMode, Level, Screen } from './types/app'
import type {
  Level1Results,
  Level2RoundResult,
  Level3RoundResult,
  Level4RoundResult,
  Level5RoundResult,
} from './types/domain'

function introScreenForLevel(level: Level): Screen {
  return `level${level}Intro` as Screen
}

function playScreenForLevel(level: Level): Screen {
  return `level${level}` as Screen
}

function levelFromScreen(screen: Screen): Level | null {
  const match = screen.match(/^level([1-5])(?:Intro)?$/)
  if (!match) return null
  return Number(match[1]) as Level
}

function App() {
  const [assessmentMode, setAssessmentMode] = useState<AssessmentMode>('physician')
  const [screen, setScreen] = useState<Screen>('modeSelection')
  const [level1Results, setLevel1Results] = useState<Level1Results | null>(null)
  const [level2Results, setLevel2Results] = useState<Level2RoundResult[] | null>(null)
  const [level3Results, setLevel3Results] = useState<Level3RoundResult[] | null>(null)
  const [level4Results, setLevel4Results] = useState<Level4RoundResult[] | null>(null)
  const [level5Results, setLevel5Results] = useState<Level5RoundResult[] | null>(null)

  const instructionStepIndex = useMemo(() => {
    const match = screen.match(/^instructions([1-4])$/)
    return match ? Number(match[1]) - 1 : -1
  }, [screen])

  const currentLevel = levelFromScreen(screen)
  const reportResults = useMemo<AssessmentResults>(
    () => ({
      level1: level1Results,
      level2: level2Results ?? [],
      level3: level3Results ?? [],
      level4: level4Results ?? [],
      level5: level5Results ?? [],
    }),
    [level1Results, level2Results, level3Results, level4Results, level5Results],
  )

  const handleModeSelect = (mode: AssessmentMode) => {
    setAssessmentMode(mode)
    setScreen(mode === 'dev' ? 'devLevelSelection' : 'intro')
  }

  const handleResultsNext = (level: Exclude<Level, 5>) => {
    setScreen(introScreenForLevel((level + 1) as Level))
  }

  const startLevel = (level: Level) => {
    if (level === 1) {
      setLevel1Results(null)
      setLevel2Results(null)
      setLevel3Results(null)
      setLevel4Results(null)
      setLevel5Results(null)
    }

    if (level === 2) {
      setLevel2Results(null)
      setLevel3Results(null)
      setLevel4Results(null)
      setLevel5Results(null)
    }

    if (level === 3) {
      setLevel3Results(null)
      setLevel4Results(null)
      setLevel5Results(null)
    }

    if (level === 4) {
      setLevel4Results(null)
      setLevel5Results(null)
    }

    if (level === 5) {
      setLevel5Results(null)
    }

    setScreen(playScreenForLevel(level))
  }

  if (screen === 'modeSelection') {
    return <ModeSelectionScreen onSelectMode={handleModeSelect} />
  }

  if (screen === 'devLevelSelection') {
    return (
      <DevLevelSelectionScreen
        onSelectLevel={(level) => {
          if (level === 1) {
            startLevel(1)
            return
          }
          setScreen(introScreenForLevel(level))
        }}
        onBack={() => setScreen('modeSelection')}
      />
    )
  }

  if (screen === 'intro') {
    return <IntroScreen onViewInstructions={() => setScreen('instructions1')} />
  }

  if (instructionStepIndex >= 0) {
    const step = instructionStepIndex + 1
    const isLastStep = step === instructionSteps.length
    return (
      <InstructionsScreen
        step={step}
        totalSteps={instructionSteps.length}
        data={instructionSteps[instructionStepIndex]}
        onBack={() => {
          if (step === 1) {
            setScreen('intro')
            return
          }
          setScreen(`instructions${step - 1}` as Screen)
        }}
        onNext={() => {
          if (isLastStep) {
            setScreen('level1Intro')
            return
          }
          setScreen(`instructions${step + 1}` as Screen)
        }}
        isLastStep={isLastStep}
      />
    )
  }

  if (screen.endsWith('Intro') && currentLevel) {
    const level = currentLevel as Level

    return (
      <LevelIntroScreen
        level={level}
        title={levelCopy[level].introTitle}
        description={levelCopy[level].introDescription}
        onStart={() => startLevel(level)}
        onBack={() => {
          if (assessmentMode === 'dev') {
            setScreen('devLevelSelection')
            return
          }

          if (level === 1) {
            setScreen('instructions4')
            return
          }

          const prior = (level - 1) as Exclude<Level, 5>
          setScreen(`results${prior}` as Screen)
        }}
      />
    )
  }

  if (screen.startsWith('level') && currentLevel) {
    if (currentLevel === 1) {
      return (
        <Level1PlayScreen
          onComplete={(results) => {
            setLevel1Results(results)
            if (assessmentMode === 'patient') {
              setScreen('level2Intro')
              return
            }
            setScreen('results1')
          }}
        />
      )
    }

    if (currentLevel === 2) {
      return (
        <Level2PlayScreen
          onComplete={(results) => {
            setLevel2Results(results)
            if (assessmentMode === 'patient') {
              setScreen('level3Intro')
              return
            }
            setScreen('results2')
          }}
        />
      )
    }

    if (currentLevel === 3) {
      return (
        <Level3PlayScreen
          onComplete={(results) => {
            setLevel3Results(results)
            if (assessmentMode === 'patient') {
              setScreen('level4Intro')
              return
            }
            setScreen('results3')
          }}
        />
      )
    }

    if (currentLevel === 4) {
      return (
        <Level4PlayScreen
          onComplete={(results) => {
            setLevel4Results(results)
            if (assessmentMode === 'patient') {
              setScreen('level5Intro')
              return
            }
            setScreen('results4')
          }}
        />
      )
    }

    if (currentLevel === 5) {
      return (
        <Level5PlayScreen
          onComplete={(results) => {
            setLevel5Results(results)
            setScreen('results5')
          }}
        />
      )
    }

    return null
  }

  if (screen.startsWith('results') && screen !== 'results5') {
    if (screen === 'results1') {
      if (!level1Results) return null
      return <Level1ResultsScreen results={level1Results} onNext={() => handleResultsNext(1)} />
    }

    if (screen === 'results2') {
      if (!level2Results) return null
      return <Level2ResultsScreen results={level2Results} onNext={() => handleResultsNext(2)} />
    }

    if (screen === 'results3') {
      if (!level3Results) return null
      return <Level3ResultsScreen results={level3Results} onNext={() => handleResultsNext(3)} />
    }

    if (screen === 'results4') {
      if (!level4Results) return null
      return <Level4ResultsScreen results={level4Results} onNext={() => handleResultsNext(4)} />
    }

    return null
  }

  if (screen === 'results5') {
    if (!level5Results) return null
    return (
      <FinalReportScreen
        assessmentMode={assessmentMode}
        results={reportResults}
        onRestart={() => setScreen('modeSelection')}
      />
    )
  }

  return null
}

export default App
