import { CenteredScreen } from '../../components/CenteredScreen'
import type { InstructionsStep } from '../../types/domain'

type InstructionsScreenProps = {
  step: number
  totalSteps: number
  data: InstructionsStep
  onBack: () => void
  onNext: () => void
  isLastStep: boolean
}

export function InstructionsScreen({ step, totalSteps, data, onBack, onNext, isLastStep }: InstructionsScreenProps) {
  return (
    <CenteredScreen>
      <div className="instructions-container">
        <h2>{data.heading}</h2>
        {data.sections.map((section) => (
          <div key={section.title} className="instructions-section">
            <h3>{section.title}</h3>
            <ul>
              {section.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}

        <p className="step-indicator">
          Step {step} of {totalSteps}
        </p>

        <div className="button-row button-row--centered">
          <button onClick={onBack}>{step === 1 ? 'Back to Intro' : 'Back'}</button>
          <button onClick={onNext}>{isLastStep ? 'Start Level 1' : 'Next'}</button>
        </div>
      </div>
    </CenteredScreen>
  )
}
