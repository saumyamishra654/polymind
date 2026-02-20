import { useEffect, useRef } from 'react'

type PerformanceGraphProps = {
  labels: string[]
  dataPoints: number[]
}

export function PerformanceGraph({ labels, dataPoints }: PerformanceGraphProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height
    const padding = 60

    ctx.clearRect(0, 0, width, height)
    if (dataPoints.length === 0) return

    const maxVal = Math.max(...dataPoints)
    const minVal = Math.min(...dataPoints)
    const range = maxVal - minVal || 1

    const graphWidth = width - 2 * padding
    const graphHeight = height - 2 * padding
    const stepX = graphWidth / (dataPoints.length - 1 || 1)

    ctx.strokeStyle = '#333'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(padding, padding)
    ctx.lineTo(padding, height - padding)
    ctx.lineTo(width - padding, height - padding)
    ctx.stroke()

    ctx.fillStyle = '#333'
    ctx.font = '12px Arial'
    ctx.textAlign = 'right'

    for (let i = 0; i <= 5; i += 1) {
      const value = minVal + (range * i) / 5
      const y = height - padding - (graphHeight * i) / 5
      ctx.fillText(`${value.toFixed(2)}s`, padding - 10, y + 4)

      ctx.strokeStyle = '#ddd'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(padding, y)
      ctx.lineTo(width - padding, y)
      ctx.stroke()
    }

    ctx.save()
    ctx.translate(15, height / 2)
    ctx.rotate(-Math.PI / 2)
    ctx.textAlign = 'center'
    ctx.fillText('Avg Time Between Actions (seconds)', 0, 0)
    ctx.restore()

    ctx.textAlign = 'center'
    ctx.fillText('Assessment Progress', width / 2, height - 10)

    ctx.strokeStyle = '#2196F3'
    ctx.fillStyle = '#2196F3'
    ctx.lineWidth = 2
    ctx.beginPath()

    dataPoints.forEach((value, index) => {
      const x = padding + index * stepX
      const normalizedVal = (value - minVal) / range
      const y = height - padding - normalizedVal * graphHeight

      if (index === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })
    ctx.stroke()

    dataPoints.forEach((value, index) => {
      const x = padding + index * stepX
      const normalizedVal = (value - minVal) / range
      const y = height - padding - normalizedVal * graphHeight

      ctx.beginPath()
      ctx.arc(x, y, 4, 0, 2 * Math.PI)
      ctx.fill()

      ctx.save()
      ctx.translate(x, height - padding + 10)
      ctx.rotate(-Math.PI / 4)
      ctx.textAlign = 'right'
      ctx.fillStyle = '#333'
      ctx.font = '10px Arial'
      ctx.fillText(labels[index], 0, 0)
      ctx.restore()
    })
  }, [dataPoints, labels])

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={400}
      style={{ border: '1px solid #ccc', margin: '20px auto', display: 'block' }}
    />
  )
}
