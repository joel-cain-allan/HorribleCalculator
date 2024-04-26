import React, { useState } from 'react'
import { Wheel } from 'react-custom-roulette'
import { getRandomInt } from '.'

const operators = ['*', '÷', '-', '+', '^', '√', '(', ')']
const data = []
for (let op of operators) {
  data.push({ option: op })
}
export function OperatorWheel({ selectValue, width }) {
  const [operatorIndex, setOperatorIndex] = useState(0)
  const [mustSpin, setMustSpin] = useState(false)
  const [selectedOperator, setSelectedOperator] = useState('')
  let selected = 'none;'

  function clicked() {
    if (!mustSpin) {
      setOperatorIndex(getRandomInt(0, data.length))
      setMustSpin(true)
    }
  }

  function selectedValue() {
    setMustSpin(false)
    selected = 'inline;'
    setSelectedOperator(data[operatorIndex].option)
  }

  function selectClicked() {
    selectValue(selectedOperator)
  }

  return (
    <div>
      <div
        id="roulette-wrapper"
        style={{ marginLeft: (width - 400) / 2, marginTop: 100 }}
        onClick={clicked}
      >
        <Wheel
          mustStartSpinning={mustSpin}
          prizeNumber={operatorIndex}
          data={data}
          perpendicularText="true"
          backgroundColors={['#3e3e3e', '#df3428']}
          textColors={['#ffffff']}
          onStopSpinning={selectedValue}
          disableInitialAnimation="true"
        />
      </div>
      <button
        onClick={selectClicked}
        className="value-button"
        style={{ display: selectedOperator !== '' ? 'inline' : 'none' }}
      >
        <h1>{selectedOperator}</h1>
      </button>
    </div>
  )
}
