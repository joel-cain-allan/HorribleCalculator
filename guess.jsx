import React, { useState } from 'react'

export function GuessValue({ selectValue }) {
  const [max, setMax] = useState(Number.MAX_SAFE_INTEGER)
  const [min, setMin] = useState(Number.MIN_SAFE_INTEGER)
  const [guess, setGuess] = useState((max + min) / 2)

  function pickedValue() {
    selectValue(guess)
  }

  function higherValue() {
    let val = guess
    setMin(val)
    setGuess(Math.ceil((max + val) / 2))
  }

  function lowerValue() {
    let val = guess
    setMax(val)
    setGuess(Math.ceil((val + min) / 2))
  }

  return (
    <div className="vertical-buttons">
      <button onClick={higherValue}>&#x2191;</button>

      <button className="number" onClick={pickedValue}>
        {guess}
      </button>
      <button onClick={lowerValue}>&#x2193;</button>
    </div>
  )
}
