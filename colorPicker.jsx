import React, { useState } from 'react'
import { HexColorPicker } from 'react-colorful'

export function Sketch({ selectValue }) {
  const [colour, setColour] = useState('#0F0000')
  const [value, setValue] = useState(hexToDecimal(colour))

  function handleChange(color, e) {
    setColour(color)
    setValue(hexToDecimal(colour))
  }

  function hexSelected() {
    selectValue(value)
  }

  return (
    <div id="hex-wrapper">
      <HexColorPicker
        color={colour}
        // disableAlpha={true}
        onChange={handleChange}
      />
      <button className="value-button" onClick={hexSelected}>
        {value}
      </button>
    </div>
  )
}
function hexDigitToDecimal(hexDigit) {
  switch (hexDigit) {
    case 'A':
      return 10
      break
    case 'B':
      return 11
      break
    case 'C':
      return 12
      break
    case 'D':
      return 13
      break
    case 'E':
      return 14
      break
    case 'F':
      return 15
      break
    default:
      return Number(hexDigit)
  }
}

function hexToDecimal(hex) {
  //only handles 6 digit hex, which is fine for its use here
  let power = 5
  let result = 0
  let hexed = hex.slice(1).toUpperCase()
  for (let i of hexed) {
    result += hexDigitToDecimal(i) * 16 ** power--
  }
  return result
}
