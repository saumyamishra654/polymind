import { CenteredScreen } from '../../components/CenteredScreen'

type IntroScreenProps = {
  onViewInstructions: () => void
}

export function IntroScreen({ onViewInstructions }: IntroScreenProps) {
  return (
    <CenteredScreen title="PolyMind" subtitle="Geometry Based Cognitive Assessment">
      <p className="lead-copy">
        This assessment measures how you perceive, remember, and reconstruct shapes.
      </p>
      <button onClick={onViewInstructions}>View Instructions</button>
    </CenteredScreen>
  )
}
