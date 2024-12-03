import { useEffect, useRef, useState } from 'react'
import { FaPaintRoller, FaPalette, FaPen, FaShapes, FaTrash } from 'react-icons/fa'
import { FaArrowRightLong } from 'react-icons/fa6'
import { colorPickerOptions, lineOptions, paintBrushOptions, pencilOptions, Shape, shapeOptions } from '../tool-options'
import { CanvasTool } from '../types'
import './main-layout.css'

// TODO: Fix bug where items are to the right and down instead at point
// TODO: Fix event lag

// TODO: Bonus: Allow saving canvas to file and downloading
// TODO: Bonus: Allow dragging and dropping text, shapes, and lines

export const MainLayout = () => {
  const [tool, setTool] = useState<CanvasTool >('pencil')
  const [shape, setShape] = useState<Shape>('square')
  const [startP, setStart] = useState<number[]>([0, 0])
  const [endP, setEndP] = useState<number[]>([1, 0])
  const [color, setColor] = useState<string>('white')
  const [paintbrushStrokeSize, setPaintBrushStrokeSize]= useState(3)
  const [pencilSize, setPencilSize] = useState(1)
  const [lineWidth, setLineWidth] = useState(0.5)
  
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const workingRef = useRef(false)

  const drawCircle = (x: number, y: number, size: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.beginPath();
    ctx.fillStyle = color
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }

  const drawSquare = (x: number, y: number, size: number = 50) => {
    const ctx = canvasRef.current!.getContext('2d')!
    ctx.beginPath()
    ctx.fillStyle = color
    ctx.fillRect(x, y, size, size * .7)
    ctx.fill()
  }

  const drawLine = () => {
    const ctx = canvasRef.current!.getContext('2d')!
    ctx.strokeStyle = color
    ctx.lineWidth = lineWidth
    ctx.moveTo(startP[0], startP[1])
    ctx.lineTo(endP[0], endP[1])
    ctx.stroke()
  }

  const startTrackingPosition = (e: MouseEvent) => {
    const start  = [
      e.clientX, 
      e.clientY
    ]

    if (tool === 'shapes') {
      if (shape === 'square') {
        drawSquare(e.clientX, e.clientY)
      } else if (shape === 'circle') {
        drawCircle(e.clientX, e.clientY, 20)
      } else {
        return
      }
    } else  {
      workingRef.current = true
      setStart(start)
    }
  }

  const movePosition = (e: MouseEvent) => {
    if (workingRef.current === true) {
      const rect = canvasRef.current!.getBoundingClientRect();
      if (tool === 'paintbrush') {
        requestAnimationFrame(() => drawSquare(e.clientX - rect.left, e.clientY - rect.top, paintbrushStrokeSize))
      } else if (tool === 'pencil') {
        requestAnimationFrame(() => drawCircle(e.clientX - rect.left, e.clientY - rect.top, pencilSize))
      } else {
        setEndP([
          e.clientX, 
          e.clientY
        ])
      }
    }
  }

  const stopTrackingPosition = () => {
    if (workingRef.current) {
      workingRef.current = false
      if (tool === 'line-maker') {
        requestAnimationFrame(drawLine)
      }
    }
  }

  const createGridOverlay = () => {
    const container = document.getElementById('grid-overlay')
    const {offsetWidth, offsetHeight} = container || {offsetHeight: 0, offsetWidth: 0}
    const amountPerRow = Math.floor(offsetWidth / 20)
    const numberOfRows = Math.floor(offsetHeight / 20)
    const numberOfBoxes = amountPerRow * numberOfRows

    for (let n = 0; n < numberOfBoxes; n++) {
      const div = document.createElement('div')
      div.classList.add('grid-box')
      container?.appendChild(div)
    }
  }

  const resetCanvas = () => {
    const ctx = canvasRef.current?.getContext('2d')!
    ctx.clearRect(0, 0, canvasRef.current!.clientWidth, canvasRef.current!.clientHeight)
    setColor('white')
    setPaintBrushStrokeSize(3)
    setShape('square')
  }

  const toggleTool = (tool: CanvasTool) => {
    setTool(tool)
  }

  const changePaintColor = (color: string) => {
    setColor(color)
  }

  const changeLineWidth = (width: number) => {
    setLineWidth(width)
  }

  const changeShape = (shape: Shape) => {
    setShape(shape)
  }

  const changePaintStroke = (strokeSize: number) => {
    setPaintBrushStrokeSize(strokeSize)
  }

  const changePencilPoint = (size: number) => {
    setPencilSize(size)
  }

  useEffect(() => {
    createGridOverlay()
    if(canvasRef && canvasRef.current) {
      canvasRef.current.addEventListener('mousedown', startTrackingPosition)
      canvasRef.current.addEventListener('mouseup', stopTrackingPosition)
      canvasRef.current.addEventListener('mousemove', movePosition)
    }

    return () => {
      canvasRef.current?.removeEventListener('mousedown', startTrackingPosition)
      canvasRef.current?.removeEventListener('mouseup', stopTrackingPosition)
      canvasRef.current?.removeEventListener('mousemove', movePosition)
    }
  }, [tool, shape, color, paintbrushStrokeSize, pencilSize, lineWidth, endP, startP])

  return (
    <div className="main-layout">
      <div className='layout-top'>
        <ul className="toolbar">
          <li><button className={'option' + (tool === 'pencil' ? ' selected' : '')} onClick={() => toggleTool('pencil')}><FaPen/></button></li>
          <li><button className={'option' + (tool === 'paintbrush' ? ' selected' : '')} onClick={() => toggleTool('paintbrush')}><FaPaintRoller/></button></li>
          <li><button className={'option' + (tool === 'shapes' ? ' selected' : '')} onClick={() => toggleTool('shapes')}><FaShapes/></button></li>
          <li><button className={'option' + (tool === 'line-maker' ? ' selected' : '')} onClick={() => toggleTool('line-maker')}><FaArrowRightLong/></button></li>
          <li><button className={'option' + (tool === 'color-picker' ? ' selected' : '')} onClick={() => toggleTool('color-picker')}><FaPalette/></button></li>
          <li><button className='option last-item' onClick={resetCanvas}><FaTrash/></button></li>
        </ul>

      </div>
      <div className='layout-bottom'>
        <ul className="toolbar sidebar">
          {tool ==='color-picker' && colorPickerOptions(changePaintColor, color).map(({component, onClick}, i) => {
            return <li key={`tool-option-${i}`}><button className='option' onClick={onClick}>{component()}</button></li>
          })}
          {tool ==='shapes' && shapeOptions(changeShape, color, shape).map(({component, onClick}, i) => {
            return <li key={`tool-option-${i}`}><button className='option' onClick={onClick}>{component()}</button></li>
          })}
          {tool === 'paintbrush' && paintBrushOptions(changePaintStroke, color, paintbrushStrokeSize).map(({component, onClick}, i) => {
            return <li key={`tool-option-${i}`}><button className='option' onClick={onClick}>{component()}</button></li>
          })}

          {tool === 'pencil' && pencilOptions(changePencilPoint, color, pencilSize).map(({component, onClick}, i) => {
            return <li key={`tool-option-${i}`}><button className='option' onClick={onClick}>{component()}</button></li>
          })}

          {tool === 'line-maker' && lineOptions(changeLineWidth, lineWidth).map(({component, onClick}, i) => {
            return <li key={`tool-option-${i}`}><button className='option' onClick={onClick}>{component()}</button></li>
          })} 
        </ul>
        <div className='grid'>
          <div id='grid-overlay'></div>
          <canvas ref={canvasRef}></canvas>
        </div>
      </div>
    </div>
  )
}