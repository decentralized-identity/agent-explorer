import React, { useEffect, useRef } from 'react'
import Chart from 'chart.js'

interface ChartProps {
  type: string
  data: any
}

const LineChart: React.FC<ChartProps> = ({ type, data }) => {
  const canvasRef = useRef<HTMLCanvasElement>()

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')

    // @ts-ignore
    new Chart(ctx, {
      type,
      aspectRatio: 3,
      data,
    })
  }, [])

  // @ts-ignore
  return <canvas ref={canvasRef}></canvas>
}

export default LineChart
