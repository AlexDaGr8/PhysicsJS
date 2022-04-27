export default class Ball {
    constructor(ctx,x,y,r = 15,fill = 'black',stroke = 'black',m = 0.1,vx = 0,vy = 0,windowWidth = 800,windowHeight = 500) {
        this.ctx = ctx;
        this.position = { x, y };
        this.velocity = {
            x: vx, 
            y: vy
        };
        this.mass = m; // kg
        this.radius = r; // 1px = 1cm
        this.fill = fill;
        this.stroke = stroke;
        this.restitution = -0.7;
        this.A = Math.PI * this.radius * this.radius / (10000);
        this.ag = 9.81; // gravitational constant m/s
        this.Cd = 0.47; // Coefficient of drag: dimensionless
        this.rho = 1.22; // denisty of fluid: kg / m^3
        this.window = {
            width: windowWidth,
            height: windowHeight
        }
    }

    get positionRadius() {
        return {
            x: {
                min: this.position.x - this.radius,
                max: this.position.x + this.radius
            },
            y: {
                min: this.position.y - this.radius,
                max: this.position.y + this.radius
            }
        }
    }

    circle() {
        this.ctx.beginPath();
        this.ctx.fillStyle = this.fill;
        this.ctx.strokeStyle = this.stroke;
        this.ctx.arc(this.position.x, this.position.y, this.radius, Math.PI * 2, 0);
        this.ctx.stroke();
        this.ctx.fill();
        this.ctx.closePath();
    }

    getDistance(position) {
        // sqrt((x2 - x1)^2 + (y2 - y1)^2)
        return Math.sqrt(Math.pow(this.position.x - position.x, 2) + Math.pow(this.position.y - position.y,2));
    }

    getSlope(position) {
        return (position.y - this.position.y) / (position.x - this.position.x);
    }

    collisions(collisionArr) {
        if (this.position.y > this.window.height - this.radius) {
            this.velocity.y *= this.restitution;
            this.position.y = this.window.height - this.radius;
        }
        if (this.position.x > this.window.width - this.radius) {
            this.velocity.x *= this.restitution;
            this.position.x = this.window.width - this.radius;
        }
        if (this.position.x < this.radius) {
            this.velocity.x *= this.restitution;
            this.position.x = this.radius;
        }
        if (collisionArr) {
            collisionArr.forEach(col => {
                let dist = this.getDistance(col.position) + 1;
                let slope = this.getSlope(col.position);
                if (dist < (this.radius + col.radius)) {
                    this.fill = 'blue';
                    let combineRadius = col.radius + this.radius;
                    let percX = (col.position.x - this.position.x) / combineRadius;
                    let xRest = percX * this.restitution;
                    let yRest = (1 - percX) * this.restitution;

                    let direction = this.position.x < col.position.x ? -1 : 1;
                    let newPoint = {
                        x: col.position.x + (direction * (combineRadius / Math.sqrt(1 + (slope * slope)))),
                        y: col.position.y - (combineRadius / Math.sqrt(1 + (slope * slope)))
                    }

                    this.velocity.x *= xRest;
                    this.position.x = newPoint.x;

                    this.velocity.y *= yRest;
                    this.position.y = newPoint.y;
                }
            });
        }
    }

    force(vel) {
        let direction = vel / Math.abs(vel);
        // Drag force: Fd = -1/2 * Coeffecient Of Drag * Frontal area * rho * velocity^2
        let force = -0.5 * this.Cd * this.A * this.rho * vel * vel * direction;
        return (isNaN(force) ? 0 : force);
    }

    update(collisionArr = null, frameRate = 1/40) {
        // forces
        let Fx = this.force(this.velocity.x);
        let Fy = this.force(this.velocity.y);

        // get acceleration from force: f = ma => a = f/m
        let ax = Fx / this.mass;
        let ay = this.ag + (Fy / this.mass);

        // get velocity from acceleration: m/s^2 * s = m/s
        this.velocity.x += ax * frameRate;
        this.velocity.y += ay * frameRate;

        // get position from velocity: m/s * s
        // the last 100 is to adjust the 1px = 1cm to be in meters
        this.position.x += this.velocity.x * frameRate * 100;
        this.position.y += this.velocity.y * frameRate * 100;

        this.collisions(collisionArr);
        
        this.circle();
    }
}