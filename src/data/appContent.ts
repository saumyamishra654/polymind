import type { InstructionsStep, LevelMetaMap } from '../types/domain'

export const instructionSteps: InstructionsStep[] = [
  {
    heading: 'Welcome to PolyMind',
    sections: [
      {
        title: 'What to Expect',
        items: [
          'The test progresses through multiple levels of increasing complexity.',
          'Each level involves recognizing, reconstructing, or generating shapes.',
          'You will receive feedback after each level before moving forward.',
        ],
      },
    ],
  },
  {
    heading: 'Drawing Shapes',
    sections: [
      {
        title: 'Drawing Edges',
        items: [
          'Shapes are built by connecting the points shown on the screen.',
          'Click and hold on one point, drag to another point, and release.',
          'Each connected pair becomes an edge of your reconstructed shape.',
        ],
      },
      {
        title: 'Erasing Edges',
        items: ['Click directly on an existing line segment to remove it and refine your drawing.'],
      },
    ],
  },
  {
    heading: 'Using Hints',
    sections: [
      {
        title: 'Hint Rules',
        items: [
          'You may use up to 3 hints per round.',
          'Each hint reveals one correct edge from the target shape.',
          'There is a 15-second cooldown before the next hint.',
          'Hint usage is recorded in your score.',
        ],
      },
    ],
  },
  {
    heading: 'Submitting Answers & Navigation',
    sections: [
      {
        title: 'Submitting',
        items: [
          'You can submit at any time, even if incomplete.',
          'PolyMind records correctness, time, hint usage, and action behavior.',
        ],
      },
      {
        title: 'Flow',
        items: [
          'After each level, results appear before moving to the next level.',
          'Difficulty increases as you progress.',
        ],
      },
    ],
  },
]

export const levelCopy: LevelMetaMap = {
  1: {
    introTitle: 'Level 1 – Shape Matching',
    introDescription: 'Choose the option that is the same shape as the target (may be flipped or rotated).',
  },
  2: {
    introTitle: 'Level 2 – Labeled Reconstruction',
    introDescription: 'Memorize and reconstruct the polygon by connecting labeled vertices.',
  },
  3: {
    introTitle: 'Level 3 – Unlabeled Reconstruction',
    introDescription: 'Memorize and reconstruct complex polygons without vertex labels.',
  },
  4: {
    introTitle: 'Level 4 – Nested Shapes',
    introDescription: 'Reconstruct both outer and inner versions of a shape.',
  },
  5: {
    introTitle: 'Level 5 – Multi-Shape',
    introDescription: 'Create two separate triangles that do not touch.',
  },
}
