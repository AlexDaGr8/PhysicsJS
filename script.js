import Ball from './ball.js';
console.clear();

// canvas stuff
let canvas = document.getElementById('canvas');
let container = canvas.parentElement;
let ctx = canvas.getContext('2d');
let width = canvas.width = container.offsetWidth;
let height = canvas.height = container.offsetHeight;

// animation stuff
let animation = null;
let frameRate = 1/40; // seconds
let frameDelay = frameRate * 1000; // ms
let stopped = false;
let mouse = { x: 0, y: 0, isDown: false };

let getMousePosition = function(e) {
  mouse.x = e.pageX - canvas.offsetLeft;
  mouse.y = e.pageY - canvas.offsetTop;
}
let mouseDown = function(e) {
	if (e.which == 1) {
		getMousePosition(e);
		mouse.isDown = true;
		ball.position.x = mouse.x;
		ball.position.y = mouse.y;
	}
}

let mouseUp = function(e) { 
	if (e.which == 1) {
		mouse.isDown = false;
		ball.velocity.y = (ball.position.y - mouse.y) / 10;
		ball.velocity.x = (ball.position.x - mouse.x) / 10;
	}
}

canvas.onmousemove = getMousePosition;
canvas.onmousedown = mouseDown;
canvas.onmouseup = mouseUp;


window.onresize = () => {
  width = canvas.width = container.offsetWidth;
  height = canvas.height = container.offsetHeight;
  
  draw();
}
window.addEventListener('keydown', (e) => {
  if (e.code === 'Space') {
      if (stopped) {
        stopped = false;
        animation = setInterval(draw, frameDelay);
      } else {
        stopped = true;
        clearInterval(animation);
        animation = null;
      }
  } 
});

function random(min,max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

let staticBalls = [
    // new Ball(ctx,random(width / 4, width * 3/4),random(height / 4, height * 3/4),random(5,50),'transparent','blue'),
    // new Ball(ctx,random(width / 4, width * 3/4),random(height / 4, height * 3/4),random(5,50)),
    // new Ball(ctx,random(width / 4, width * 3/4),random(height / 4, height * 3/4),random(5,50)),
    // new Ball(ctx,random(width / 4, width * 3/4),random(height / 4, height * 3/4),random(5,50)),
    // new Ball(ctx,random(width / 4, width * 3/4),random(height / 4, height * 3/4),random(5,50)),
    new Ball(ctx,792,547,44,'transparent', 'blue'),
]

//733.9087803255725, y: 510.0845672585361

console.log(staticBalls)

let ball = new Ball(ctx,width/2, 0, 15, '#444', 'transparent', 1, 3, 2, width, height);

// setup animation loop
animation = setInterval(draw, frameDelay);

function draw() {
  ctx.clearRect(0,0,width,height);
  
  ctx.strokeStyle = 'black';
  ctx.strokeRect(0,0,width,height);

  staticBalls.forEach(d => d.draw());

  if (!mouse.isDown) {
    ball.update(staticBalls);
  }

  if (mouse.isDown) {
    ball.draw()
    line(ball.position, mouse);
  }

}


function line(p1,p2,color = 'blue') {
  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.moveTo(p1.x, p1.y);
  ctx.lineTo(p2.x, p2.y);
  ctx.stroke();
  ctx.closePath();
}





  