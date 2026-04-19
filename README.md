# PolyMind

PolyMind has been migrated from a single-file HTML app into a modular React + TypeScript application with behavior parity to the legacy flow.

## Status

- React app scaffolded with Vite + strict TypeScript.
- Legacy implementation preserved at `legacy/index.monolith.html` as source-of-truth reference.
- All assessment levels are migrated:
  - Level 1: shape matching (flip + rotation)
  - Level 2: labeled reconstruction
  - Level 3: unlabeled reconstruction
  - Level 4: nested shapes
  - Level 5: separate triangles
- Final report includes all-level summaries, performance graph, and CSV export.
- Mode flow parity:
  - `dev`: jump to any level
  - `physician`: results after each level + final report
  - `patient`: skip intermediate results and auto-download CSV after Level 5, then return to mode selection

## Run Locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Architecture Map

- App flow and routing state:
  - `src/App.tsx`
- Shared content/data:
  - `src/data/appContent.ts`
  - `src/data/levelData.ts`
- Domain/app types:
  - `src/types/domain.ts`
  - `src/types/app.ts`
- Shared gameplay utilities:
  - `src/lib/geometry.ts`
  - `src/features/reconstruction/*`
- Level implementations:
  - `src/features/level1/*`
  - `src/features/level2/*`
  - `src/features/level3/*`
  - `src/features/level4/*`
  - `src/features/level5/*`
- Final report and export:
  - `src/lib/resultsReport.ts`
  - `src/features/report/PerformanceGraph.tsx`
  - `src/features/report/FinalReportScreen.tsx`
  - `src/lib/csvExport.ts`
