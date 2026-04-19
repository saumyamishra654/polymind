import type { AssessmentMode } from '../../types/app'
import { CenteredScreen } from '../../components/CenteredScreen'

type ModeSelectionScreenProps = {
  onSelectMode: (mode: AssessmentMode) => void
}

export function ModeSelectionScreen({ onSelectMode }: ModeSelectionScreenProps) {
  return (
    <CenteredScreen title="PolyMind" subtitle="Select Mode">
      <div className="button-row">
        <button onClick={() => onSelectMode('dev')}>Developer Mode</button>
        <button onClick={() => onSelectMode('physician')}>Physician Mode</button>
        <button onClick={() => onSelectMode('patient')}>Patient Mode</button>
      </div>

      <div className="info-panel">
        <p>
          <strong>Developer Mode:</strong> Jump to any level for testing.
        </p>
        <p>
          <strong>Physician Mode:</strong> Full assessment with result screens shown after each level.
        </p>
        <p>
          <strong>Patient Mode:</strong> Full assessment without result screens, download CSV at the end.
        </p>
      </div>
    </CenteredScreen>
  )
}
