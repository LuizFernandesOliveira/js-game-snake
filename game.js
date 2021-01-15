let Snake = (function () {
  let canvas = document.getElementById('snake')
  let context = canvas.getContext('2d')
  let fps = 2
  let loser = false //perdeu
  let points = 0
  let pointsMax = 0
  let level = 0
  let intervalID
  const PIXEIS = 10
  let pixelX = Math.floor(canvas.width / PIXEIS)
  let pixelY = Math.floor(canvas.height / PIXEIS)
  const PIXEL_IMG = 64
  let velocity = {}
  const DIRECTION = {
    'stop': 0,
    'up': 1,
    'right': 2,
    'down': 3,
    'left': 4
  }
  Object.freeze(DIRECTION)
  let lastDirection = DIRECTION.right

  let snake = []

  let splitHeadSnake = {}
  let splitSnake = []
  let splitFootSnake = {}


  let food = {
    dx: Math.floor(PIXEIS / 4) * pixelX,
    dy: Math.floor(PIXEIS / 4) * pixelY
  }

  let bgSnake = new Image()
  bgSnake.src = "img/snake_bg.png"

  let imgSnake = new Image()
  imgSnake.src = "img/snake-icons.png"

  let endGame = new Image()
  endGame.src = "img/fim-de-jogo.jpg"


  let game = {

    reset: function () {

      context.drawImage(bgSnake, 0, 0, 225, 225, 0, 0, canvas.width, canvas.height)
      if (loser) {
        context.drawImage(
          endGame,
          0, 0, canvas.width, canvas.height
        )
      }

      velocity = {
        x: 0,
        y: 0
      }
      snake = []
      snake[0] = {
        dx: Math.floor(PIXEIS / 2) * pixelX,
        dy: Math.floor(PIXEIS / 2) * pixelY,
        dw: pixelX,
        dh: pixelY,
        direcao: lastDirection
      }
      snake[1] = {
        dx: Math.floor(PIXEIS / 2) * pixelX - pixelX,
        dy: Math.floor(PIXEIS / 2) * pixelY,
        dw: pixelX,
        dh: pixelY,
        direcao: lastDirection
      }

      splitHeadSnake = {
        sx: PIXEL_IMG * 4,
        sy: PIXEL_IMG * 0,
        sw: PIXEL_IMG,
        sh: PIXEL_IMG
      }
      splitSnake = []
      splitFootSnake = {
        sx: PIXEL_IMG * 4,
        sy: PIXEL_IMG * 2,
        sw: PIXEL_IMG,
        sh: PIXEL_IMG
      }

      food = {
        dx: Math.floor(PIXEIS / 4) * pixelX,
        dy: Math.floor(PIXEIS / 4) * pixelY
      }
    },

    insertDirection: {
      up: function () {
        if (lastDirection != DIRECTION.down) {
          velocity.x = 0
          velocity.y = -pixelY
        }
      },
      right: function () {
        if (lastDirection != DIRECTION.left) {
          velocity.x = pixelX
          velocity.y = 0
        }
      },
      down: function () {
        if (lastDirection != DIRECTION.up) {
          velocity.x = 0
          velocity.y = pixelY
        }
      },
      left: function () {
        if (lastDirection != DIRECTION.right) {
          velocity.x = -pixelX
          velocity.y = 0
        }
      }
    },
    generateLoser: function () {
      points = 0
      level = 0
      fps = 2
      loser = true
      clearInterval(intervalID)
      Snake.start(fps)
      Snake.stop()
      game.reset()
    },

    generateRandomFood: function () {
      food = {
        dx: Math.floor(Math.random() * PIXEIS) * pixelX,
        dy: Math.floor(Math.random() * PIXEIS) * pixelY
      }
    },

    loop: function () {
      let snakeStopped = velocity.x == 0 && velocity.y == 0

      if (!snakeStopped) {

        context.drawImage(bgSnake, 0, 0, 225, 225, 0, 0, canvas.width, canvas.height)

        if (velocity.x == 0 && velocity.y == pixelY) lastDirection = DIRECTION.down
        if (velocity.x == 0 && velocity.y == -pixelY) lastDirection = DIRECTION.up
        if (velocity.x == pixelX && velocity.y == 0) lastDirection = DIRECTION.right
        if (velocity.x == -pixelX && velocity.y == 0) lastDirection = DIRECTION.left
        if (velocity.x == 0 && velocity.y == 0) lastDirection = DIRECAO.parado

        let newSnake = {
          dx: snake[0].dx + velocity.x,
          dy: snake[0].dy + velocity.y,
          dw: pixelX,
          dh: pixelY,
          direcao: lastDirection,
        }

        snake.unshift(newSnake)

        if (snake[0].dx >= PIXEIS * pixelX && snake[0].direcao == DIRECTION.right) snake[0].dx = 0
        if (snake[0].dx < 0 && snake[0].direcao == DIRECTION.left) snake[0].dx = (PIXEIS - 1) * pixelX
        if (snake[0].dy >= PIXEIS * pixelY && snake[0].direcao == DIRECTION.down) snake[0].dy = 0
        if (snake[0].dy < 0 && snake[0].direcao == DIRECTION.up) snake[0].dy = (PIXEIS - 1) * pixelY


        if (snake[0].dx == food.dx && snake[0].dy == food.dy) {
          game.generateRandomFood()

          for (let i = 0; i < snake.length; i++) {
            if (snake[i].dx == food.dx && snake[i].dy == food.dy) game.generateRandomFood()
          }

          points++
          if (points > pointsMax) pointsMax = points
          for (let i = 0; i < 50; i += 5) {
            if (points == i) {
              level++
              fps++
              clearInterval(intervalID)
              Snake.start(fps)
            }
          }

        } else {
          snake.pop()
          splitSnake.pop()
        }

        let newSplitSnake = {
          sx: PIXEL_IMG * 2,
          sy: PIXEL_IMG * 1,
          sw: PIXEL_IMG,
          sh: PIXEL_IMG,
        }

        if (snake[0].direcao == DIRECTION.up || snake[0].direcao == DIRECTION.down) {
          newSplitSnake.sx = PIXEL_IMG * 2
          newSplitSnake.sy = PIXEL_IMG * 1
        }
        if (snake[0].direcao == DIRECTION.right || snake[0].direcao == DIRECTION.left) {
          newSplitSnake.sx = PIXEL_IMG * 1
          newSplitSnake.sy = PIXEL_IMG * 0
        }
        if (snake[0].direcao == DIRECTION.up && snake[1].direcao == DIRECTION.right ||
          snake[0].direcao == DIRECTION.left && snake[1].direcao == DIRECTION.down) {
          newSplitSnake.sx = PIXEL_IMG * 2
          newSplitSnake.sy = PIXEL_IMG * 2
        }
        if (snake[0].direcao == DIRECTION.down && snake[1].direcao == DIRECTION.left ||
          snake[0].direcao == DIRECTION.right && snake[1].direcao == DIRECTION.up) {
          newSplitSnake.sx = PIXEL_IMG * 0
          newSplitSnake.sy = PIXEL_IMG * 0
        }
        if (snake[0].direcao == DIRECTION.up && snake[1].direcao == DIRECTION.left ||
          snake[0].direcao == DIRECTION.right && snake[1].direcao == DIRECTION.down) {
          newSplitSnake.sx = PIXEL_IMG * 0
          newSplitSnake.sy = PIXEL_IMG * 1
        }
        if (snake[0].direcao == DIRECTION.down && snake[1].direcao == DIRECTION.right ||
          snake[0].direcao == DIRECTION.left && snake[1].direcao == DIRECTION.up) {
          newSplitSnake.sx = PIXEL_IMG * 2
          newSplitSnake.sy = PIXEL_IMG * 0
        }

        splitSnake.unshift(newSplitSnake)

        if (snake[0].direcao == DIRECTION.up) {
          splitHeadSnake.sx = PIXEL_IMG * 3
          splitHeadSnake.sy = PIXEL_IMG * 0
        }
        if (snake[0].direcao == DIRECTION.right) {
          splitHeadSnake.sx = PIXEL_IMG * 4
          splitHeadSnake.sy = PIXEL_IMG * 0
        }
        if (snake[0].direcao == DIRECTION.down) {
          splitHeadSnake.sx = PIXEL_IMG * 4
          splitHeadSnake.sy = PIXEL_IMG * 1
        }
        if (snake[0].direcao == DIRECTION.left) {
          splitHeadSnake.sx = PIXEL_IMG * 3
          splitHeadSnake.sy = PIXEL_IMG * 1
        }

        if (snake[snake.length - 2].direcao == DIRECTION.up) {
          splitFootSnake.sx = PIXEL_IMG * 3
          splitFootSnake.sy = PIXEL_IMG * 2
        }
        if (snake[snake.length - 2].direcao == DIRECTION.right) {
          splitFootSnake.sx = PIXEL_IMG * 4
          splitFootSnake.sy = PIXEL_IMG * 2
        }
        if (snake[snake.length - 2].direcao == DIRECTION.down) {
          splitFootSnake.sx = PIXEL_IMG * 4
          splitFootSnake.sy = PIXEL_IMG * 3
        }
        if (snake[snake.length - 2].direcao == DIRECTION.left) {
          splitFootSnake.sx = PIXEL_IMG * 3
          splitFootSnake.sy = PIXEL_IMG * 3
        }

        context.drawImage(
          imgSnake,
          splitHeadSnake.sx,
          splitHeadSnake.sy,
          splitHeadSnake.sw,
          splitHeadSnake.sh,
          snake[0].dx,
          snake[0].dy,
          snake[0].dw,
          snake[0].dh,
        )

        for (let i = 1; i < snake.length - 1; i++) {
          context.drawImage(
            imgSnake,
            splitSnake[i - 1].sx,
            splitSnake[i - 1].sy,
            splitSnake[i - 1].sw,
            splitSnake[i - 1].sh,
            snake[i].dx,
            snake[i].dy,
            snake[i].dw,
            snake[i].dh,
          )
        }

        context.drawImage(
          imgSnake,
          splitFootSnake.sx,
          splitFootSnake.sy,
          splitFootSnake.sw,
          splitFootSnake.sh,
          snake[snake.length - 1].dx,
          snake[snake.length - 1].dy,
          snake[snake.length - 1].dw,
          snake[snake.length - 1].dh,
        )

        context.drawImage(
          imgSnake,
          0,
          PIXEL_IMG * 3,
          PIXEL_IMG,
          PIXEL_IMG,
          food.dx,
          food.dy,
          pixelX,
          pixelY
        )

        for (let i = 1; i < snake.length; i++) {
          if (
            snake[i].dx == snake[0].dx &&
            snake[i].dy == snake[0].dy
          ) {
            game.generateLoser()
          }
        }

        let sms = document.getElementById('sms')
        sms.style.display = 'none'
      } else {
        if (loser) {
          let sms = document.getElementById('sms')
          sms.style.display = 'none'
        } else {
          let sms = document.getElementById('sms')
          sms.style.display = 'flex'
        }
      }

      let placar = document.getElementById('span-point')
      let textPlacar = points
      placar.innerHTML = textPlacar

      let placarlevel = document.getElementById('span-level')
      let textPlacarLevel = level
      placarlevel.innerHTML = textPlacarLevel

      let placarMaximo = document.getElementById('span-point-max')
      let textPlacarMaximo = pointsMax
      placarMaximo.innerHTML = textPlacarMaximo
    }
  }

  function selectDirection(event) {
    switch (event.keyCode) {
      case 38: //cima
        game.insertDirection.up()
        event.preventDefault()
        break;

      case 39: //direita
        game.insertDirection.right()
        event.preventDefault()
        break;

      case 40: //baixo
        game.insertDirection.down()
        event.preventDefault()
        break;

      case 37: //esquerda
        game.insertDirection.left()
        event.preventDefault()
        break;

      case 32: //space
        Snake.stop()
        event.preventDefault()
        break;

      case 27: //esc
        game.reset()
        event.preventDefault()
        break;
    }
  }
  document.addEventListener('keydown', selectDirection)

  return {
    config: function () {
      window.onload = game.reset
    },
    start: function (fps = 5) {
      window.onload = game.reset
      intervalID = setInterval(game.loop, 1000 / fps)
    },
    stop: function () {
      velocity.x = 0
      velocity.y = 0
    },
    direction: function (direction) {
      switch (direction) {
        case 'up':
          game.insertDirection.up()
          break
        case 'right':
          game.insertDirection.right()
          break
        case 'down':
          game.insertDirection.down()
          break
        case 'left':
          game.insertDirection.left()
          break
      }
    }
  }
})();

Snake.config()
Snake.start(2)

//Up
let btnUp = document.getElementById('btnUp')
btnUp.addEventListener('click', insereUp)

function insereUp() {
  Snake.direction('up')
}

//Right
let btnRight = document.getElementById('btnRight')
btnRight.addEventListener('click', insereRight)

function insereRight() {
  Snake.direction('right')
}

//Down
let btnDown = document.getElementById('btnDown')
btnDown.addEventListener('click', insereDown)

function insereDown() {
  Snake.direction('down')
}

//Left
let btnLeft = document.getElementById('btnLeft')
btnLeft.addEventListener('click', insereLeft)

function insereLeft() {
  Snake.direction('left')
}
