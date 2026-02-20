export type ReconstructionEdge<TExtra extends object = Record<string, never>> = {
  i: number
  j: number
} & TExtra

export type HintCandidate<TExtra extends object = Record<string, never>> = {
  i: number
  j: number
  extra?: TExtra
}

export type HintStatus = 'used' | 'maxed' | 'cooldown' | 'complete'

export type HintResult<TExtra extends object = Record<string, never>> = {
  status: HintStatus
  message: string
  edge?: ReconstructionEdge<TExtra>
}

export type ReconstructionTiming = {
  avgActionInterval: string
  timeBeforeSubmit: string
}
