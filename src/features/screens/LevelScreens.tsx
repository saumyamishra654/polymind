import type { Level } from '../../types/app'

type LevelIntroScreenProps = {
  level: Level
  title: string
  description: string
  onStart: () => void
  onBack: () => void
}

export function LevelIntroScreen({ level, title, description, onStart, onBack }: LevelIntroScreenProps) {
  return (
    <main className="screen active">
      <div className="centered-container">
        <div className="instructions-container">
          <h2>{title}</h2>
          <p>{description}</p>
          <div className="button-row button-row--centered">
            <button onClick={onStart}>Start Level {level}</button>
            <button onClick={onBack}>Back</button>
          </div>
        </div>
      </div>
    </main>
  )
}
