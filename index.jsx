import React, { useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import '/styles/main.css'
import { BalanceBeamSlider } from './balanceBeamSlider'
import { OperatorWheel } from './operatorRoulette'
import { performCalculation } from './calculator'
import { GuessValue } from './guess'
import { Sketch } from './colorPicker'
import Comp from './pachinko'
import { isCompositeComponent } from 'react-dom/test-utils'

// Clear the existing HTML content
document.body.innerHTML = '<div id="app"></div>'

const MINHEIGHT = 900
const MAXWIDTH = document.body.clientWidth * 0.45
const MAXHEIGHT = MINHEIGHT * 0.7
// Render your React component instead
const root = createRoot(document.getElementById('app'))

root.render(<MainDiv />)

function MainDiv() {
  const [input] = useState([])
  const [display, setDisplay] = useState(0)
  const [isInputOperator, setIsInputOperator] = useState(true)

  const horribleOperands = [
    <OperatorWheel selectValue={selectValue} width={MAXWIDTH} />,
    <Comp
      maxHeight={MAXHEIGHT}
      maxWidth={MAXWIDTH}
      selectValue={selectValue}
    />,
  ]
  const horribleIntegers = [
    <BalanceBeamSlider selectValue={selectValue} />,
    <GuessValue selectValue={selectValue} />,
    <Sketch selectValue={selectValue} />,
  ]

  function selectValue(value) {
    setIsInputOperator(!isInputOperator)
    input.push(value)
    setDisplay(value)
  }

  function calculate() {
    setIsInputOperator(!isInputOperator)
    setDisplay(performCalculation(input))
    while (input.length > 0) {
      input.pop()
    }
  }

  function ansClicked() {
    console.log(`clicked. ${display}, ${input}`)
    if (display != 0 && input.length == 0) {
      setIsInputOperator(true)
      selectValue(display)
    }
  }

  function HorribleInteger() {
    return horribleIntegers[getRandomInt(0, horribleIntegers.length)]
  }

  function HorribleOperand() {
    return horribleOperands[getRandomInt(0, horribleOperands.length)]
  }

  function HorribleUI() {
    if (isInputOperator) {
      return HorribleInteger()
    } else {
      return HorribleOperand()
    }
  }

  return (
    <div id="calculator">
      <div id="calculator-screen">
        <CalcDisplay display={display} />
      </div>
      <div id="horrible">
        <HorribleUI />
      </div>
      <button id="equals-button" onClick={calculate}>
        =
      </button>
      <button id="ans-button" onClick={ansClicked}>
        ANS
      </button>
    </div>
  )
}

function CalcDisplay({ display }) {
  return (
    <div id="display-screen">
      <h1>{display}</h1>
    </div>
  )
}

export function getRandomInt(min, max) {
  const minCeiled = Math.ceil(min)
  const maxFloored = Math.floor(max)
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled) // The maximum is exclusive and the minimum is inclusive
}
