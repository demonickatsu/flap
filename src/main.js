import kaboom from "kaboom"

kaboom({
	background: [ 51, 161, 239 ],
})


loadSprite("bean", "/sprites/bean.png")

gravity(1600)

const player = add([
	sprite("bean"),
	pos(center()),
	area(),
	body(),
])

onKeyPress("space", () => {
		player.jump()
	
})
onClick(() => player.jump())
// Add floor
add([
	rect(width(), 48),
	outline(4),
	area(),
	pos(0, height() - 48),
	solid(),
])

// Add ceiling
add([
	rect(width(), 48),
	outline(4),
	area(),
	pos(0, height() - 1900),
	solid(),
]) 

const PIPE_OPEN = 240
const PIPE_MIN = 60
const JUMP_FORCE = 800
let SPEED = 320
const CEILING = -60

function spawnPipe() {

	// calculate pipe positions
	const h1 = rand(PIPE_MIN, height() - PIPE_MIN - PIPE_OPEN)
	const h2 = height() - h1 - PIPE_OPEN

add([
		pos(width(), 0),
		rect(64, h1),
		color(255, 255, 100),
		outline(4),
		area(),
		move(LEFT, SPEED),
		cleanup(),
		// give it tags to easier define behaviors see below
		"pipe",
	])

add([
		pos(width(), h1 + PIPE_OPEN),
		rect(64, h2),
		color(255, 255, 100),
		outline(4),
		area(),
		move(LEFT, SPEED),
		cleanup(),
		// give it tags to easier define behaviors see below
		"pipe",
		// raw obj just assigns every field to the game obj
		{ passed: false, },
	])

}

let score = 0

const scoreLabel = add([
	text(score),
	origin("center"),
	pos(width() / 2, 80),
	fixed(),
])

function addScore() {
	score++
	scoreLabel.text = score
}

// callback when bean onCollide with objects with tag "pipe"
player.onCollide("pipe", () => {
	go("lose", score)
})
player.onGround(() => {
	go("lose", score)
})

// per frame event for all objects with tag 'pipe'
onUpdate("pipe", (p) => {
	// check if bean passed the pipe
	if (p.pos.x + p.width <= player.pos.x && p.passed === false) {
		addScore()
		p.passed = true
	}
})

loop(2, () => {
	spawnPipe()
})

scene("lose", (score) => {

	add([
		sprite("bean"),
		pos(width() / 2, height() / 2 - 108),
		scale(3),
		origin("center"),
	])

	// display score
	add([
		text(score),
		pos(width() / 2, height() / 2 + 108),
		scale(3),
		origin("center"),
	])

	// go back to game with space is pressed
	onKeyPress("space", () => document.location.reload())
	onClick(() => document.location.reload())

})
