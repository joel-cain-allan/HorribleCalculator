export function performCalculation(tokens) {
  let reversePolish = shuntingYard(tokens)
  return evaluateReversePolish(reversePolish)
}

let operations = {
  '*': { precedence: 2, associativeness: 'left' },
  '÷': { precedence: 2, associativeness: 'left' },
  '-': { precedence: 1, associativeness: 'left' },
  '+': { precedence: 1, associativeness: 'left' },
  '^': { precedence: 3, associativeness: 'right' },
  '√': { precedence: 3, associativeness: 'right', display: '√' },
}

let input = []

export function addToken(token) {
  input.push(token)
}

//tokenize.
export function tokenizeInput(input) {
  if (input[0] == '-') {
    input = '0' + input
  }
  return input
    .split(/([\+\*\^\-\/\√\(\)])/g)
    .filter((i) => i)
    .map((i) => i.trim())
}

export function calculate(a, b, operation) {
  let result
  switch (operation) {
    case '*':
      result = a * b
      break
    case '÷':
      result = a / b
      break
    case '+':
      result = Number(a) + Number(b)
      break
    case '-':
      result = a - b
      break
    case '^':
      result = a ** b
      break
    case '√':
      result = nthRoot(a, b)
      break
    default:
      throw new Error(`${operation} is not a valid operation!`)
  }
  return result
}

function nthRoot(n, x) {
  return 10 ** ((1.0 / n) * Math.log10(x))
}

//to reverse polish notation
export function shuntingYard(tokens) {
  let output = []
  let operators = []

  while (tokens.length > 0) {
    let nextToken = tokens.shift()
    let number = Number(nextToken)

    if (!isNaN(number)) {
      //console.log('is number')
      //may need reworking
      output.push(number)
    } else if (nextToken.length > 1) {
      //functions live here; NYI
      operators.push(nextToken)
    } else if (isNotParen(nextToken)) {
      //operator
      while (needToPopOperator(operators, nextToken)) {
        output.push(operators.pop())
      }
      operators.push(nextToken)
    } else if (nextToken === ',') {
      while (operators.length > 0 && operators[operators.length - 1] !== '(') {
        output.push(operators.pop())
      }
    } else if (nextToken === '(') {
      operators.push(nextToken)
    } else {
      //can assume right paren.  Need to be ready to catch mismatched paren pairs as thrown error
      while (operators[operators.length - 1] !== '(') {
        output.push(operators.pop())
      }
      operators.pop() //discard left paren; job done
    }
  }
  while (operators.length > 0) {
    let o = operators.pop()
    if (o === '(') {
      //poorly formed paren pair, handle
      throw 'Mismatched parentheses!'
    } else {
      output.push(o)
    }
  }
  return output
}

export function evaluateReversePolish(reversePolishQueue) {
  let polishStack = []
  reversePolishQueue.forEach((x) => {
    if (x in operations) {
      let b = polishStack.pop()
      let a = polishStack.pop()
      polishStack.push(calculate(a, b, x))
    } else {
      polishStack.push(x)
    }
  })
  return polishStack.pop() //final remaining element should be answer; shouldn't be elements left after reverse polish has been evaluated like this unless reverse polish was badly formed.
}

export function needToPopOperator(operators, nextToken) {
  return (
    operators.length > 0 &&
    isNotParen(operators[operators.length - 1]) &&
    hasPrecedence(operators[operators.length - 1], nextToken)
  )
}

function isNotParen(operator) {
  return operator !== ')' && operator !== '('
}

function hasPrecedence(operator, operatorToCompare) {
  if (
    operations[operator].precedence > operations[operatorToCompare].precedence
  ) {
    return true
  } else if (
    operations[operator].precedence ===
      operations[operatorToCompare].precedence &&
    operations[operator].associativeness === 'left'
  ) {
    return true
  }
  return false
}
