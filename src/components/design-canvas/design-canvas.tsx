import { useCallback, useEffect, useRef, useState } from 'react'
import { FaFileUpload, FaPaintRoller, FaPalette, FaPen, FaShapes, FaTrash } from 'react-icons/fa'
import { FaArrowRightLong } from 'react-icons/fa6'
import { colorPickerOptions, lineOptions, paintBrushOptions, pencilOptions, shapeOptions } from '../tool-options'
import { CanvasTool, Shape } from '../types'
import './design-canvas.css'

export const DesignCanvas = () => {
  const [selectedTool, setSelectedTool] = useState<CanvasTool>('pencil');
  const [selectedShape, setSelectedShape] = useState<Shape>('square');
  const [selectedColor, setSelectedColor] = useState<string>('white');
  const [selectedPenSize, setSelectedPenSize] = useState<number>(1);
  const [selectedPaintBrushSize, setSelectedPaintBrushSize] = useState<number>(3);
  const [selectedLineWidth, setSelectedLineWidth] = useState<number>(0.5);

  const toolRef = useRef<CanvasTool>('pencil');
  const shapeRef = useRef<Shape>('square');
  const colorRef = useRef<string>('white');
  const paintbrushStrokeSizeRef = useRef<number>(3);
  const pencilSizeRef = useRef<number>(1);
  const lineWidthRef = useRef<number>(0.5);
  const startPointRef = useRef<number[]>([0,0]);
  const endPointRef = useRef<number[]>([1,0]);
  
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const drawingRef = useRef(false)
  
  const openFilePicker = () => {
    fileInputRef?.current?.click()
  }
  const uploadImage = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target?.files && e.target.files.length) {
      const ctx = ctxRef.current!
      const file = e.target.files[0]
      const img = new Image()
      const url = URL.createObjectURL(file)
      img.src = url
      img.onload = (e) => {
        const offsetX = img.width / 2
        const offsetY = img.height / 2
        const x = canvasRef.current!.clientWidth / 2
        const y = canvasRef.current!.clientHeight / 2
        ctx.drawImage(img, x - offsetX, y - offsetY)
      }

      img.onerror = (e) => {
        alert(`Error occurred while uploading img: ${url}`)
      }
    }    
  }, [])

  // shape drawing methods

  const drawCircle = useCallback((x: number, y: number, size: number) => {
    const ctx = ctxRef.current!
    ctx.beginPath();
    ctx.fillStyle = colorRef.current
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }, [])

  const drawSquare = useCallback((x: number, y: number, size: number = 100) => {
    const ctx = ctxRef.current!
    ctx.beginPath()
    ctx.fillStyle = colorRef.current
    ctx.fillRect(x, y, size, size)
    ctx.fill()
  }, [])

  const drawTriangle = useCallback((x: number, y: number, size: number) => {
    const ctx = ctxRef.current!
    ctx.strokeStyle = colorRef.current
    ctx.fillStyle = colorRef.current
    ctx.lineWidth = lineWidthRef.current
    ctx.moveTo(x,  y)
    ctx.lineTo(x + size,  y - (size * 1.5))
    ctx.lineTo(x + (size * 2), y)
    ctx.lineTo(x,  y)
    ctx.stroke()
    ctx.fill()
  }, [])

  const drawDiamond = useCallback((x: number, y: number, size: number) => {
    const ctx = ctxRef.current!
    ctx.strokeStyle = colorRef.current
    ctx.fillStyle = colorRef.current
    ctx.lineWidth = lineWidthRef.current
    ctx.moveTo(x,  y)
    ctx.lineTo(x + size,  y - (size * 1.5))
    ctx.lineTo(x + (size * 2), y)
    ctx.lineTo(x + size,  y + (size * 1.5))
    ctx.lineTo(x, y)
    ctx.stroke()
    ctx.fill()
  }, [])

  const drawLine = useCallback(() => {
    const [startX, startY] = startPointRef.current
    const [endX, endY] = endPointRef.current
    const ctx = ctxRef.current!
    ctx.strokeStyle = colorRef.current
    ctx.lineWidth = lineWidthRef.current
    ctx.moveTo(startX, startY)
    ctx.lineTo(endX, endY)
    ctx.stroke()
  }, [])

  // Event handlers

  const startTrackingPosition = useCallback((e: MouseEvent) => {
    const start  = [
      e.clientX, 
      e.clientY
    ]

    if (toolRef.current === 'shapes') {
      if (shapeRef.current === 'square') {
        drawSquare(e.clientX, e.clientY)
      } else if (shapeRef.current === 'circle') {
        drawCircle(e.clientX, e.clientY, 60)
      } else if (shapeRef.current === 'triangle') {
        drawTriangle(e.clientX, e.clientY, 60)
      } else {
        drawDiamond(e.clientX, e.clientY, 50)
      }
    } else  {
      drawingRef.current = true
      startPointRef.current = start
    }
  }, [drawCircle, drawSquare])

  const movePosition = useCallback((e: MouseEvent) => {
    if (drawingRef.current) {
      const rect = canvasRef.current!.getBoundingClientRect();
      if (toolRef.current === 'paintbrush') {
        requestAnimationFrame(() => drawSquare(e.clientX - rect.left, e.clientY - rect.top, paintbrushStrokeSizeRef.current))
      } else if (toolRef.current === 'pencil') {
        requestAnimationFrame(() => drawCircle(e.clientX - rect.left, e.clientY - rect.top, pencilSizeRef.current))
      } else {
        endPointRef.current = [e.clientX, e.clientY]
      }
    }
  }, [drawCircle, drawSquare])

  const stopTrackingPosition = useCallback(() => {
    if (drawingRef.current) {
      drawingRef.current = false
      if (toolRef.current === 'line-maker') {
        requestAnimationFrame(drawLine)
      }
    }
  }, [drawLine])

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
    const ctx = ctxRef.current!
    ctx.clearRect(0, 0, canvasRef.current!.clientWidth, canvasRef.current!.clientHeight)
    colorRef.current = 'white'
    paintbrushStrokeSizeRef.current = 3
    shapeRef.current = 'square'
  }

  // tool option toggle methods

  const toggleTool = (tool: CanvasTool) => {
    toolRef.current = tool
    setSelectedTool(tool)
  }

  const changePaintColor = (color: string) => {
    colorRef.current = color
    setSelectedColor(color)
  }

  const changeLineWidth = (width: number) => {
    lineWidthRef.current = width
    setSelectedLineWidth(width)
  }

  const changeShape = (shape: Shape) => {
    shapeRef.current =shape
    setSelectedShape(shape)
  }

  const changePaintStroke = (strokeSize: number) => {
    paintbrushStrokeSizeRef.current = strokeSize
    setSelectedPaintBrushSize(strokeSize)
  }

  const changePencilPoint = (size: number) => {
    pencilSizeRef.current = size
    setSelectedPenSize(size)
  }

  useEffect(() => {
    createGridOverlay()
    const canvas = canvasRef.current
    if(canvas) {
      canvas.addEventListener('mousedown', startTrackingPosition)
      canvas.addEventListener('mouseup', stopTrackingPosition)
      canvas.addEventListener('mousemove', movePosition)

      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;

      const context = canvas.getContext('2d')
      if (context) {
        ctxRef.current = context
      }
    }

    return () => {
      canvasRef.current?.removeEventListener('mousedown', startTrackingPosition)
      canvasRef.current?.removeEventListener('mouseup', stopTrackingPosition)
      canvasRef.current?.removeEventListener('mousemove', movePosition)
    }
  }, [startTrackingPosition, movePosition, stopTrackingPosition, uploadImage])

  return (
    <div className="main-layout">
      <div className='layout-top'>
        <ul className="toolbar">
          <li><button className={'option' + (selectedTool === 'pencil' ? ' selected' : '')} onClick={() => toggleTool('pencil')}><FaPen/></button></li>
          <li><button className={'option' + (selectedTool === 'paintbrush' ? ' selected' : '')} onClick={() => toggleTool('paintbrush')}><FaPaintRoller/></button></li>
          <li><button className={'option' + (selectedTool === 'shapes' ? ' selected' : '')} onClick={() => toggleTool('shapes')}><FaShapes/></button></li>
          <li><button className={'option' + (selectedTool === 'line-maker' ? ' selected' : '')} onClick={() => toggleTool('line-maker')}><FaArrowRightLong/></button></li>
          <li><button className={'option' + (selectedTool === 'color-picker' ? ' selected' : '')} onClick={() => toggleTool('color-picker')}><FaPalette/></button></li>
          <li><button className={'option'} onClick={openFilePicker}><FaFileUpload/></button></li>
          <li><button className='option last-item' onClick={resetCanvas}><FaTrash/></button></li>
          <input type='file' accept='image/*' ref={fileInputRef} onChange={uploadImage}/>
        </ul>
      </div>
      <div className='layout-bottom'>
        <ul className="toolbar sidebar">
          {selectedTool ==='color-picker' && colorPickerOptions(changePaintColor, selectedColor).map(({component, onClick}, i) => {
            return <li key={`tool-option-${i}`}><button className='option' onClick={onClick}>{component()}</button></li>
          })}
          {selectedTool ==='shapes' && shapeOptions(changeShape, colorRef.current, selectedShape).map(({component, onClick}, i) => {
            return <li key={`tool-option-${i}`}><button className='option' onClick={onClick}>{component()}</button></li>
          })}
          {selectedTool === 'paintbrush' && paintBrushOptions(changePaintStroke, selectedColor, selectedPaintBrushSize).map(({component, onClick}, i) => {
            return <li key={`tool-option-${i}`}><button className='option' onClick={onClick}>{component()}</button></li>
          })}

          {selectedTool === 'pencil' && pencilOptions(changePencilPoint, selectedColor, selectedPenSize).map(({component, onClick}, i) => {
            return <li key={`tool-option-${i}`}><button className='option' onClick={onClick}>{component()}</button></li>
          })}

          {selectedTool === 'line-maker' && lineOptions(changeLineWidth, selectedLineWidth).map(({component, onClick}, i) => {
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