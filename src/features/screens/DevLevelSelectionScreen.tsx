import type { Level } from '../../types/app'

type DevLevelSelectionScreenProps = {
  onSelectLevel: (level: Level) => void
  onBack: () => void
}

export function DevLevelSelectionScreen({ onSelectLevel, onBack }: DevLevelSelectionScreenProps) {
  return (
    <main className="screen active">
      <div className="centered-container">
        <h2>Developer Mode - Select Level</h2>

        <div className="stacked-buttons">
          <button onClick={() => onSelectLevel(1)}>Level 1: Mental Rotation</button>
          <button onClick={() => onSelectLevel(2)}>Level 2: Labeled Reconstruction</button>
          <button onClick={() => onSelectLevel(3)}>Level 3: Unlabeled Reconstruction</button>
          <button onClick={() => onSelectLevel(4)}>Level 4: Nested Shapes</button>
          <button onClick={() => onSelectLevel(5)}>Level 5: Multi-Shape</button>
        </div>

        <div className="button-row button-row--centered">
          <button onClick={onBack}>Back to Mode Selection</button>
        </div>
      </div>
    </main>
  )
}
