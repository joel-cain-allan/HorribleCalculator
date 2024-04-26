import React, { useState, useEffect } from 'react'

export function BalanceBeamSlider({ selectValue }) {
  const [value, setValue] = useState(0)
  const [speed, setSpeed] = useState(0)
  const [controlValue, setControlValue] = useState(0)

  useEffect(() => {
    const interval = setInterval(updateBalanceBeam, 10)

    return () => clearInterval(interval)
  }, [value, speed, controlValue])

  function addValue() {
    selectValue(value)
  }

  function updateBalanceBeam() {
    //calculate new speed + value, avoid extra renders.
    let s = (speed + Math.sin((controlValue * Math.PI) / 18000)) * friction

    let v = Math.round(value + s * 100000)

    if (v > 999999) {
      setValue(999999)
      setSpeed(s * -1)
    } else if (v < 0) {
      setValue(0)
      setSpeed(s * -1)
    } else {
      setValue(v)
      setSpeed(s)
    }
  }

  return (
    <div id="balance-wrapper">
      <BalanceBeam value={value} transformed={controlValue} />
      <ControlSlider
        controlValue={controlValue}
        setControlValue={setControlValue}
      />
      <br />
      <button className="value-button" onClick={addValue}>
        {value}
      </button>
    </div>
  )
}
function ControlSlider({ controlValue, setControlValue }) {
  controlSlider = (
    <input
      id="controlSlider"
      type="range"
      min="-10"
      max="10"
      step="0.02"
      value={controlValue}
      onChange={(e) => setControlValue(e.target.value)}
    ></input>
  )

  return controlSlider
}

function BalanceBeam({ value, transformed }) {
  balanceSlider = (
    <input
      id="balance"
      type="range"
      min="0"
      max="999999"
      value={value}
      style={{
        transform: `rotate(${transformed}deg)`,
      }}
      readOnly={true}
    ></input>
  )
  return balanceSlider
}

var friction = 0.99
let balanceSlider
let controlSlider
