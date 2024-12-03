import { FaCircle, FaSquare, FaStar } from 'react-icons/fa'
import { FaX } from 'react-icons/fa6'
import { RiRectangleFill } from 'react-icons/ri'
import { TbTriangleFilled } from 'react-icons/tb'

export type Shape = 'square' | 'circle' | 'triangle' | 'star'

export const shapeOptions = (toggleShape: (shape: Shape) => void, color: string, shape: Shape) => [
  {
    component: () => <div className={"option-container " + (shape === 'circle' ? 'selected' : '')}><FaCircle color={color}/></div>,
    onClick: () => toggleShape('circle')
  },
  {
    component: () => <div className={"option-container " + (shape === 'square' ? 'selected' : '')}><FaSquare color={color}/></div>,
    onClick: () => toggleShape('square')
  },
  {
    component: () => <div className={"option-container " + (shape === 'star' ? 'selected' : '')}><FaStar color={color}/></div>,
    onClick: () => toggleShape('star')
  },
  {
    component: () => <div className={"option-container " + (shape === 'triangle' ? 'selected' : '')}><TbTriangleFilled color={color}/></div>,
    onClick: () => toggleShape('triangle')
  },
]

export const colorPickerOptions = (toggleColor: (color: string) => void, color: string) => [
  {
    component: () => <div className={"option-container " + (color === 'red' ? 'selected' : '')}><FaCircle color='red'/></div>,
    onClick: () => {
      toggleColor('red')
      console.log('toggled red')

    }
  },
  {
    component: () =>  <div className={"option-container " + (color === 'blue' ? 'selected' : '')}><FaCircle color='blue'/></div>,
    onClick: () => {
      toggleColor('blue')
      console.log('toggled blue')
    }
  },
  {
    component: () => <div className={"option-container " + (color === 'green' ? 'selected' : '')}><FaCircle color='green'/></div>,
    onClick: () => {
      toggleColor('green')
    }
  },
  {
    component: () => <div className={"option-container " + (color === 'white' ? 'selected' : '')}><FaCircle color='white'/></div>,
    onClick: () => {
      toggleColor('white')
      console.log('toggled white')

    }
  },
]

export const paintBrushOptions = (toggleStrokeSize: (shrokeSize: number) => void, color: string, strokeSize: number) => [
  {
    component: () => <div className={"option-container " + (strokeSize === 3 ? 'selected' : '')}><RiRectangleFill color={color} size={8}/></div>,
    onClick: () => toggleStrokeSize(3)
  },
  {
    component: () => <div className={"option-container " + (strokeSize === 6 ? 'selected' : '')}><RiRectangleFill color={color} size={12}/></div>,
    onClick: () => toggleStrokeSize(6)
  },
  {
    component: () => <div className={"option-container " + (strokeSize === 9 ? 'selected' : '')}><RiRectangleFill color={color} size={16}/></div>,
    onClick: () => toggleStrokeSize(9)
  },
  {
    component: () => <div className={"option-container " + (strokeSize === 12 ? 'selected' : '')}><RiRectangleFill color={color} size={20}/></div>,
    onClick: () => toggleStrokeSize(12)
  },
]

export const pencilOptions = (togglePencilSize: (penSize: number) => void, color: string, pencilSize: number) => [
  {
    component: () => <div className={"option-container " + (pencilSize === 1 ? 'selected' : '')}><FaCircle color={color} size={2}/></div>,
    onClick: () => togglePencilSize(1)
  },
  {
    component: () => <div className={"option-container " + (pencilSize === 1.25 ? 'selected' : '')}><FaCircle color={color} size={4}/></div>,
    onClick: () => togglePencilSize(1.25)
  },
  {
    component: () => <div className={"option-container " + (pencilSize === 1.5 ? 'selected' : '')}><FaCircle color={color} size={6}/></div>,
    onClick: () => togglePencilSize(1.5)
  },
  {
    component: () => <div className={"option-container " + (pencilSize === 1.75 ? 'selected' : '')}><FaCircle color={color} size={8}/></div>,
    onClick: () => togglePencilSize(1.75)
  },
]

export const lineOptions = (toggleLineWidth: (width: number) => void, lineWidth: number) => [
  {
    component: () => <div className={"option-container " + (lineWidth === 0.5 ? 'selected' : '')}><p><span>1</span><FaX size={8}/></p></div>,
    onClick: () => toggleLineWidth(0.5)
  },
  {
    component: () => <div className={"option-container " + (lineWidth === 1 ? 'selected' : '')}><p><span>2</span><FaX size={8}/></p></div>,
    onClick: () => toggleLineWidth(1)
  },
  {
    component: () =><div className={"option-container " + (lineWidth === 1.5 ? 'selected' : '')}><p><span>3</span><FaX size={8}/></p></div>,
    onClick: () => toggleLineWidth(1.5)
  },
  {
    component: () => <div className={"option-container " + (lineWidth === 2 ? 'selected' : '')}><p><span>4</span><FaX size={8} /></p></div>,
    onClick: () => toggleLineWidth(2)
  },
]