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

let ball = new Ball(ctx,width/2, 0, 15, '#444', 'transparent', 0.1, 3, 2, width, height);

// setup animation loop
animation = setInterval(draw, frameDelay);

function draw() {
  ctx.clearRect(0,0,width,height);
  
  ctx.strokeStyle = 'black';
  ctx.strokeRect(0,0,width,height);

  staticBalls.forEach(d => d.circle());
  
  ball.update(staticBalls);
}




  