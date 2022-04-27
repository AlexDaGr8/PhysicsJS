console.clear();

let running = document.getElementById('running');
let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
let width = canvas.width = 800;
let height = canvas.height = 600;
let mouse = {
      x: 10,
      y: 50,
      r: 10
    };
let stopped = false;
let animation = null;

window.addEventListener('keydown', (e) => {
  if (e.code === 'Space') {
      if (stopped) {
        stopped = false;
        animation = requestAnimationFrame(draw);
        running.innerText = 'Running';
      } else {
        stopped = true;
        cancelAnimationFrame(animation);
        animation = null;
        running.innerText = 'Stopped';
      }
  } 
});
canvas.addEventListener("mousemove", function(e) { 
    var cRect = canvas.getBoundingClientRect();
    mouse = {
      x: Math.round(e.clientX - cRect.left),
      y: Math.round(e.clientY - cRect.top),
      r: 10
    }
});

let rand = (max,min) => Math.floor(Math.random() * (max - min + 1) + min);

let staticCircles = [
  { x: rand(0,width), y: rand(0,height), r: rand(5,100) },
  { x: rand(0,width), y: rand(0,height), r: rand(5,100) },
  { x: rand(0,width), y: rand(0,height), r: rand(5,100) },
  { x: rand(0,width), y: rand(0,height), r: rand(5,100) },
  { x: rand(0,width), y: rand(0,height), r: rand(5,100) },
//   { x: rand(0,width), y: rand(0,height), r: rand(5,100) },
//   { x: rand(0,width), y: rand(0,height), r: rand(5,100) },
//   { x: rand(0,width), y: rand(0,height), r: rand(5,100) },
//   { x: rand(0,width), y: rand(0,height), r: rand(5,100) },
//   { x: rand(0,width), y: rand(0,height), r: rand(5,100) },
//   { x: 300, y: 300, r: rand(5,100) },
//   { x: 500, y: 300, r: rand(5,100) },
//   { x: 500, y: 500, r: rand(5,100) },
]

// for (let x = 100; x < width; x += 100) {
//     for (let y = 100; y < height; y += 100) {
//         staticCircles.push({ x, y, r: rand(5,50) })
//     }
// }

draw();

function draw() {
  ctx.clearRect(0,0,width,height);
  ctx.strokeRect(0,0,width,height);
  
  circle(mouse,'hotpink');

  staticCircles.forEach(checkCollision)
 
   animation = requestAnimationFrame(draw);
}

function checkCollision(point, id, arr) {
  let newCircle = getNewLocation(point);

  checkLineCollisions(point, arr);

  circle(point,'purple');
  circle(newCircle.circle,newCircle.color);
}

function checkLineCollisions(point, arr) {
    let lineTos = [];
    let circleTos = [];
    arr.forEach(d => {
        if (d !== point) {
            let distPointtoMouse = getDistance(point,mouse);
            let distPointtoD = getDistance(point,d) - d.r;

            // directions need to be the same
            // and the distance form point to mouse > distance from point to d
            // then draw stuff
            let lineTo = mouse;
            let circleTo = { x: 0, y: 0, r: 0};

            if (sameDirection && distPointtoMouse > distPointtoD) {
                let intersections = intersectionPoints(point,mouse,d);
                if (intersections.points) {
                    circleTo = { ...intersections.points.a.coords, r: 4 };
                    lineTo = intersections.points.a.coords;
                } else if (intersectionPoints.pointOnLine) {
                    circleTo = { ...intersections.pointOnLine.coords, r: 4 }
                    lineTo = intersections.pointOnLine.coords;
                }
            } 
            lineTos.push(lineTo);
            circleTos.push(circleTo)
        }
    });
    let closest = lineTos.reduce((a,c) => {
        if (getDistance(c,point) < getDistance(a,point) && 
            sameDirectionAnd(getDirection(c,point),getDirection(mouse,point))
            ) {
            a = c;
        }
        return a
    }, mouse);
    let closestCircle = circleTos.find(ct => ct.x === closest.x && ct.y === closest.y);

    if (closestCircle) {
        circle(circleTos.find(ct => ct.x === closest.x && ct.y === closest.y), 'green');
    }
    line(point,closest);
}

function getNewLocation(point) {
    let slope = getSlope(point,mouse);
    let newX = newXPoint(point.x,slope,point.r + mouse.r);
    let newY = newYPoint(point.y,slope,point.r + mouse.r);
  
    let plus = { x: newX.plus, y: newY.plus, r: 10 };
    let minus = { x: newX.minus, y: newY.minus, r: 10 };
  
    circle(point,'purple');
    let drawCircle = {circle: plus, color: 'green'};
    if (point.x > mouse.x) {
      drawCircle.circle = minus;
      drawCircle.color = 'blue'
    }

    return drawCircle;
}

function checkCircleCollision(a, b, c, x, y, radius) {
    // Finding the distance of line from center.
    let dist = (Math.abs(a * x + b * y + c)) / 
                        Math.sqrt(a * a + b * b);
        
    // Checking if the distance is less than, 
    // greater than or equal to radius.
    if (radius == dist) {
        console.log( "Touch" );
    }
    else if (radius > dist) {
        console.log( "Intersect") ;
    }
    else {
        console.log( "Outside") ;
    }
}

function findCircleLineIntersections(r, h, k, m, n) {
    // circle: (x - h)^2 + (y - k)^2 = r^2
    // line: y = m * x + n
    // r: circle radius
    // h: x value of circle centre
    // k: y value of circle centre
    // m: slope
    // n: y-intercept

    let sq = (val) => val * val;
    let sqrt = val => Math.sqrt(val);

    // get a, b, c values
    var a = 1 + sq(m);
    var b = -h * 2 + (m * (n - k)) * 2;
    var c = sq(h) + sq(n - k) - sq(r);

    // get discriminant
    var d = sq(b) - 4 * a * c;
    if (d >= 0) {
        // insert into quadratic formula
        var intersectionsX = [
            (-b + sqrt(sq(b) - 4 * a * c)) / (2 * a),
            (-b - sqrt(sq(b) - 4 * a * c)) / (2 * a)
        ];
        let intersections = [
            { x: intersectionsX[0], y: sqrt(sq(r) - sq(intersectionsX[0] - h)) + k, r: 2},
            { x: intersectionsX[1], y: sqrt(sq(r) - sq(intersectionsX[1] - h)) + k, r: 2}
        ]
        if (d == 0) {
            // only 1 intersection
            return [intersections[0]];
        }
        return intersections;
    }
    // no intersection
    return [];
}

function sameDirection(a,b) {
    return (a.x * b.x > 0) || 
            (a.y * b.y > 0)
}

function sameDirectionAnd(a,b) {
    return (a.x * b.x > 0) && 
            (a.y * b.y > 0)
}

function getDirection(a,b) {
    // distance from a to b
    let distAtoB = getDistance(b,a);
    // direction from a to b
    let d = { 
        x: (b.x - a.x) / distAtoB,
        y: (b.y - a.y) / distAtoB
    };

    return d;
}

function intersectionPoints(a,b,c) {
    // distance from a to b
    let distAtoB = getDistance(b,a);
    // direction from a to b
    let d = { 
        x: (b.x - a.x) / distAtoB,
        y: (b.y - a.y) / distAtoB
    };

    // equation of line x = dx * t + ax, y = dy * t + ay

    // compute value t of closest point to the circle center
    let t = (d.x * (c.x - a.x)) + (d.y * (c.y - a.y));

    // compute coordinates of point e on line and closest to c
    let e = { coords: { x: 0, y: 0 }, onLine: false };
    e.coords.x = (t * d.x) + a.x;
    e.coords.y = (t * d.y) + a.y;

    // calculate distance from e to c
    let distEtoC = getDistance(e.coords,c);

    // test if line intersects circle
    if (distEtoC < c.r) {
        // compute distance from t to circle intersection point
        let dt = Math.sqrt( Math.pow(c.r + 4, 2) - Math.pow(distEtoC, 2) );

        // compute first intersection point
        let f = { coords: { x: 0, y: 0 }, onLine: false };
        f.coords.x = ( ( t - dt ) * d.x ) + a.x;
        f.coords.y = ( ( t - dt ) * d.y ) + a.y;
        f.onLine = is_onLine(a,b,f.coords);
 
        let g = { coords: { x: 0, y: 0 }, onLine: false };
        g.coords.x = ( ( t + dt ) * d.x ) + a.x;
        g.coords.y = ( ( t + dt ) * d.y ) + a.y;
        g.onLine = is_onLine(a,b,g.coords);

        return {
            points: {
                a: f,
                b: g
            },
            pointOnLine: e
        }
    } else if (distEtoC === c.r) {
        return { points: false, pointOnLine: e };
    } else {
        return { points: false, pointOnLine: false };
    }
}

function is_onLine(a,b,c) {
    return getDistance(a,c) + getDistance(b,c) === getDistance(a,b);
}

function pointOnLine(pt1, pt2, pt3) {
    const dx = (pt3.x - pt1.x) / (pt2.x - pt1.x);
    const dy = (pt3.y - pt1.y) / (pt2.y - pt1.y);
    const onLine = dx === dy

    // Check on or within x and y bounds
    const betweenX = 0 <= dx && dx <= 1;
    const betweenY = 0 <= dy && dy <= 1;

    return onLine && betweenX && betweenY;
}

function newXPoint(x,m,d) {
  let denom = Math.sqrt(1 + (m * m));
  let plus = x + (d / denom);
  let minus = x - (d / denom);
  return { plus, minus };
}

function newYPoint(y,m,d) {
  let denom = Math.sqrt(1 + (m * m));
  let plus = y + ((d * m) / denom);
  let minus = y - ((d * m) / denom);
  return { plus, minus };
}

function getDistance(p1,p2) {
  // sqrt((x2 - x1)^2 + (y2 - y1)^2)
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y,2));
}

function getLineFormula(p1,p2) {
    let m = (p2.y - p1.y) / (p2.x - p1.x);
    let b = p1.y - m * p1.x;
    return { m, b };
}

function getSlope(p1,p2) {
  return (p2.y - p1.y) / (p2.x - p1.x);
}

function getIntercept(p1,p2) {
  return (p2.y - p1.y) / (p2.x - p1.x);
}

function circle({x,y,r},stroke) {
  ctx.beginPath();
  ctx.strokeStyle = stroke;
  ctx.arc(x,y,r,0,Math.PI*2);
  ctx.stroke();
  ctx.closePath;
}

function line(p1,p2,color = 'blue') {
  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.moveTo(p1.x, p1.y);
  ctx.lineTo(p2.x, p2.y);
  ctx.stroke();
  ctx.closePath();
}

