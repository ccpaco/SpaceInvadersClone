const moveSpeed = 250
const invaderSpeed = 80
let currentSpeed = invaderSpeed
const levelDown = 100
const bulletSpeed = 400

// controls, keyboard input
keyDown('left', () => {
  player.move(-moveSpeed, 0)
})

keyDown('right', () => {
  player.move(moveSpeed, 0)
})

function goBullet(p) {
  add([
  rect(6,18), 
  pos(p), 
  origin('center'), 
  color(0.5, 0.5, 1),
  'bullet'
  ])
}

keyPress('space', () => {
  goBullet(player.pos.add(0, -25))
})




// create layer, obj is default layer
layer(['obj', 'ui'], 'obj')

//addLevel essentially designs our tilemap
addLevel([
  '!^^^^^^^^^^      &',
  '!^^^^^^^^^^      &',
  '!^^^^^^^^^^      &',
  '!                &',
  '!                &',
  '!                &',
  '!                &',
  '!                &',
  '!                &',
  '!                &',
  '!                &',
  '!                &',
  '!                &',
  '!                &',
], {
// w x h for each block, placeholder keys
width: 30,
height: 22,
'^' : [ sprite('space-invader'), scale(1.5),'space-invader'],
'!' : [ sprite('wall'), 'left-wall'],
'&' : [ sprite('wall'), 'right-wall']
})

const player = add([
  sprite('space-ship'),
  scale(1.5),
  pos(width() / 2, height() / 2),
  origin('center')
])

const score = add([
  text('0'),
  pos(40, 400),
  layer('ui'),
  scale(3),
  {
    value : 0,
  }
])

const timeLeft = 20

const timer = add([
  text('0'),
  pos(360, 400),
  layer('ui'),
  scale(2), 
  {
    time : timeLeft,
  },
])

// action gets called everyframe
timer.action(() => {
  //dt() is delta time, or countdown
  //.toFixed is decimal places
  // go() goes to scene named "lose"
  timer.time -= dt()
  timer.text = timer.time.toFixed(2)
  if(timer.time <= 0){
    //go to scene called 'lose'
    go('lose', { score: score.value })
  }

})


action('space-invader', (s) => {
  // .move(xAxis, yAxis) x = horizontal, y = vertical
  s.move(currentSpeed, 0)
})

action('space-invader', (s) => {
  if(s.pos.y >= (12*22)){
    go('lose', {score: score.value})
  }
})

action('bullet', (b) => {
  b.move(0, -bulletSpeed)
  if(b.pos.y < 0){
    destroy(b)
  }
})

collides('space-invader', 'right-wall', () => {
  currentSpeed = -invaderSpeed
  every('space-invader', (s) => {
    s.move(0, levelDown)
  })
})

collides('space-invader', 'left-wall', () => {
  currentSpeed = invaderSpeed
  every('space-invader', (s) => {
    s.move(0, levelDown)
  })
})

collides('bullet', 'space-invader', (b,s) => {
  camShake(4)
  destroy(b)
  destroy(s)
  score.value++
  score.text = score.value
})

player.overlaps('space-invader', () => {
  go('lose', {score: score.value})
})



