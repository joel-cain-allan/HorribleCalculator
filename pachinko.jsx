import React, { useEffect, useRef, useState } from 'react'
import Matter, { World } from 'matter-js'

var Engine = Matter.Engine,
  Render = Matter.Render,
  Runner = Matter.Runner,
  Bodies = Matter.Bodies,
  Composite = Matter.Composite

const operators = ['*', '÷', '-', '+', '^', '√', '(', ')']
shuffleArray(operators)

function shuffleArray(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1))
    var temp = array[i]
    array[i] = array[j]
    array[j] = temp
  }
}

function pins(maxWidth, maxHeight) {
  let spacing = 52
  let size = 10

  let horizCount = Math.floor(maxWidth / spacing)
  let vertCount = Math.floor((maxHeight * 0.8) / spacing)
  let vertOffset = Math.floor(maxHeight * 0.1)
  let pins = []
  for (let i = 0; i < horizCount; i++) {
    for (let j = 0; j < vertCount; j++) {
      let offset = j % 2 == 0 ? spacing : spacing / 2
      if (i * spacing + offset + size < maxWidth) {
        pins.push(
          Bodies.circle(i * spacing + offset, j * spacing + vertOffset, size, {
            isStatic: true,
          })
        )
      }
    }
  }

  return pins
}

function Comp({ maxWidth, maxHeight, selectValue }) {
  const scene = useRef()
  const engine = useRef(Engine.create())
  const [result, setResult] = useState(0)

  let circ = null
  let interval

  if (circ !== null) {
    World.remove(engine.current.world, circ)
    World.add(engine.current.world, circ)
    interval = setInterval(checkGroundCollision, 50)
  }

  var ground = Bodies.rectangle(maxWidth / 2, maxHeight - 10, maxWidth, 20, {
    isStatic: true,
    isSensor: true,
    render: { fillStyle: 'grey' },
  })

  function Operators() {
    let results = operators.map((operator) => {
      return (
        <button
          onClick={operatorClicked}
          disabled={result != operator}
          key={'pachinko' + operator}
          id={'pachinko' + operator}
          className={result == operator ? 'Green' : ''}
        >
          {operator}
        </button>
      )
    })
    return results
  }

  function checkCollision(target1, target2) {
    if (target1 !== null && target2 !== null) {
      if (Matter.Collision.collides(target1, target2)) {
        let x = target1.position.x
        World.remove(engine.current.world, target1)
        clearInterval(interval)
        selectOperator(x)
      }
    }
  }

  function selectOperator(x) {
    setResult(operators[Math.floor(x / (maxWidth / operators.length))])
  }

  function particle(x, y, r) {
    if (circ !== null) {
      World.remove(engine.current.world, circ)
      circ = null
      clearInterval(interval)
    }
    if (circ === null) {
      circ = Bodies.circle(x, y, r, { restitution: 0.7 })
      World.remove(engine.current.world, circ)
      World.add(engine.current.world, circ)
      interval = setInterval(checkGroundCollision, 50)
    }
  }

  function checkGroundCollision() {
    checkCollision(circ, ground)
  }

  function operatorClicked(e) {
    shuffleArray(operators)
    selectValue(result)
  }

  function makeParticle(e) {
    let b = e.target.getBoundingClientRect()
    particle(e.clientX - b.x, 10, 10)
  }

  useEffect(() => {
    const render = Render.create({
      element: scene.current,
      engine: engine.current,
      options: {
        width: maxWidth,
        height: maxHeight,
        wireframes: false,
        background: 'transparent',
      },
    })

    const wallWidth = 6

    const leftWall = Bodies.rectangle(
      wallWidth,
      maxHeight / 2,
      wallWidth,
      maxHeight,
      {
        isStatic: true,
      }
    )
    const rightWall = Bodies.rectangle(
      maxWidth - wallWidth,
      maxHeight / 2,
      wallWidth,
      maxHeight,
      { isStatic: true }
    )
    let pi = pins(maxWidth, maxHeight)
    let bodies = [ground, leftWall, rightWall]
    for (let pin of pi) {
      bodies.push(pin)
    }
    Composite.add(engine.current.world, bodies)
    Render.run(render)
    var runner = Runner.create()
    Runner.run(runner, engine.current)

    return () => {
      clearInterval(interval)
      Render.stop(render)
      Composite.clear(engine.current.world)
      Engine.clear(engine.current)
      render.canvas.remove()
      render.canvas = null
      render.context = null
      render.textures = {}
    }
  }, [])

  return (
    <div>
      <button id="ball-drop" onClick={makeParticle}>
        Click me to drop a ball
      </button>
      <div ref={scene} style={{ width: { maxWidth }, height: { maxHeight } }} />
      <div id="operators-block">{Operators()}</div>
      {/* <button onClick={okayClicked}>Okay!</button> */}
    </div>
  )
}

export default Comp
