import type { Point } from '../../types/domain'
import type { ReconstructionEdge } from './types'

type ReconstructionBoardProps<TExtra extends object = Record<string, never>> = {
  vertices: Point[]
  edges: Array<ReconstructionEdge<TExtra> & { color?: string }>
  onStartEdge: (vertexIndex: number) => void
  onEndEdge: (vertexIndex: number) => void
  onEraseEdge: (edgeIndex: number) => void
  showLabels?: boolean
  width?: number
  height?: number
  pointColor?: (vertexIndex: number) => string
}

export function ReconstructionBoard<TExtra extends object = Record<string, never>>({
  vertices,
  edges,
  onStartEdge,
  onEndEdge,
  onEraseEdge,
  showLabels = false,
  width = 400,
  height = 400,
  pointColor,
}: ReconstructionBoardProps<TExtra>) {
  const getPointColor = (index: number) => {
    if (!pointColor) return 'black'
    return pointColor(index)
  }

  return (
    <svg viewBox="0 0 100 100" width={width} height={height}>
      {edges.map((edge, index) => {
        const start = vertices[edge.i]
        const end = vertices[edge.j]
        return (
          <line
            key={`${edge.i}-${edge.j}-${index}`}
            x1={start.x}
            y1={start.y}
            x2={end.x}
            y2={end.y}
            stroke={edge.color ?? 'black'}
            strokeWidth={2}
            onClick={() => onEraseEdge(index)}
          />
        )
      })}

      {vertices.map((vertex, index) => (
        <g key={`${vertex.x}-${vertex.y}-${index}`}>
          <circle
            cx={vertex.x}
            cy={vertex.y}
            r={3.5}
            fill={getPointColor(index)}
            style={{ cursor: 'pointer', pointerEvents: 'auto' }}
            onMouseDown={() => onStartEdge(index)}
            onMouseUp={() => onEndEdge(index)}
          />
          {showLabels ? (
            <text x={vertex.x + 3} y={vertex.y - 3} fontSize={5} fill="black">
              {index + 1}
            </text>
          ) : null}
        </g>
      ))}
    </svg>
  )
}
