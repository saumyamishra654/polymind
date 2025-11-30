# PolyMind

A web-based spatial cognitive assessment tool that tests visual memory, mental rotation, and spatial reasoning through five progressively challenging levels involving polygon manipulation and reconstruction.

## Levels

**Level 1: Mental Rotation & Flipping** — Identify flipped and rotated polygons from multiple choice options.
- Metrics: Correctness, Time, Avg time between actions, Time before submit

**Level 2: Labeled Shape Reconstruction** — Memorize and reconstruct polygons (up to 7 vertices) using numbered points.
- Metrics: Correctness, Time, Hints used, Edges missing/wrong, Intersections, Closed shape, Edges erased, Followed label order, Avg time between actions, Time before submit

**Level 3: Unlabeled Shape Reconstruction** — Memorize and reconstruct complex polygons (8-9 vertices) without labels.
- Metrics: Correctness, Time, Hints used, Edges missing/wrong, Intersections, Closed shape, Edges erased, Avg time between actions, Time before submit

**Level 4: Nested Shape Reconstruction** — Memorize and reconstruct nested shapes (outer + inner versions of same polygon).
- Metrics: Correctness, Shape name, Time, Hints used, Outer/inner edges missing/wrong, Total missing/wrong, Intersections, Edges erased, Avg time between actions, Time before submit

**Level 5: Multi-Shape Construction** — Create two separate triangles from scattered points that do not touch each other.
- Metrics: Correctness, Time, Has two triangles, Triangle 1/2 valid, Triangles separate, Shared vertices/edges count, Edges intersect, Edges erased, Avg time between actions, Time before submit
