export function solvePendulumNonLinear(states, u, parameters) {
    // Destructure states and parameters from the input objects
    const { x, xDot, fi, fiDot } = states;
    const { deltaT, mC, mP, inertia, b, lt, g, p, i, d, last_state } = parameters;
    //denominator for shorter eqn
    let denom = ((7*lt**2*mP**2)/3 - lt**2*mP**2*Math.cos(fi)**2 + (7*mC*lt**2*mP)/3);

    //explicit euler solver
    let x2e = xDot + deltaT*((7*u*lt**2*mP)/3 - (7*b*xDot*lt**2*mP)/3 + (7*fiDot**2*lt**3*mP**2*Math.sin(fi))/3 + g*lt**2*mP**2*Math.cos(fi)*Math.sin(fi))/denom;
    let x3e= fi + deltaT*fiDot;
    let x4e = fiDot - deltaT*(lt*mP*(lt*mP*Math.cos(fi)*Math.sin(fi)*fiDot**2 + u*Math.cos(fi) + g*mP*Math.sin(fi) + mC*g*Math.sin(fi) - b*xDot*Math.cos(fi)))/denom;

    //implicit euler solver
    denom = ((7*lt**2*mP**2)/3 - lt**2*mP**2*Math.cos(x3e)**2 + (7*mC*lt**2*mP)/3);

    let x1i = x + deltaT*x2e;
    let x2i = xDot + deltaT*((7*u*lt**2*mP)/3 - (7*b*x2e*lt**2*mP)/3 + (7*x4e**2*lt**3*mP**2*Math.sin(x3e))/3 + g*lt**2*mP**2*Math.cos(x3e)*Math.sin(x3e))/denom;
    let x3i = fi + deltaT*x4e;
    let x4i = fiDot - deltaT*(lt*mP*(lt*mP*Math.cos(x3e)*Math.sin(x3e)*x4e**2 + u*Math.cos(x3e) + g*mP*Math.sin(x3e) + mC*g*Math.sin(x3e) - b*x2e*Math.cos(x3e)))/denom;


    // if new states x, xDot, fi, fiDot are Nan, return zeros
    if (isNaN(x1i) || isNaN(x2i) || isNaN(x3i) || isNaN(x4i)) {
        return {
            x: 0,
            xDot: 0,
            fi: 0,
            fiDot: 0
        }
    }
    else {
        return {
            x: x1i,
            xDot: x2i,
            fi: x3i,
            fiDot: x4i
        }
    }



}


export class Rocket {
    constructor(mass, length, comPosition, deltaT) {
        this.mass = mass;     // Mass of the rocket
        this.length = length; // Length of the rocket
        this.comPosition = comPosition; // Position of center of mass
        this.deltaT = deltaT; // Time step

        // Calculate inertia using the parallel axis theorem
        this.inertia = (1/12) * this.mass * this.length**2 + this.mass * this.comPosition**2;

        // Initial states: horizontal position (x), vertical position (y), horizontal velocity (vx), vertical velocity (vy)
        this.x = 0;     
        this.y = 100;   
        this.vx = 0;    
        this.vy = 0;    

        // Initial states: angle (alpha), angular velocity (omega)
        this.alpha = 0;  
        this.omega = 0;  
    }

    update(force, theta) {
        // Horizontal and vertical forces from the applied force
        const Fx = force * Math.sin(theta);  // Force in x direction
        const Fy = force * Math.cos(theta) - this.mass * 9.81; // Force in y direction with gravity

        // Implicit Euler update for velocities and positions
        this.vx += this.deltaT * (Fx / this.mass);    // Update horizontal velocity
        this.x += this.deltaT * this.vx;              // Update horizontal position

        this.vy += this.deltaT * (Fy / this.mass);    // Update vertical velocity
        this.y += this.deltaT * this.vy;              // Update vertical position

        // Torque and angular dynamics using the center of mass
        const torque = force * this.comPosition * Math.sin(this.alpha - theta);
        this.omega += this.deltaT * (torque / this.inertia);  // Update angular velocity
        this.alpha += this.deltaT * this.omega;               // Update angle (rotation)
    }

    setCenterOfMass(newComPosition) {
        this.comPosition = newComPosition;
        this.inertia = (1/12) * this.mass * this.length**2 + this.mass * this.comPosition**2;  // Recalculate inertia
    }

    // Reset if needed, for example, if the rocket needs a fresh start
    reset() {
        this.x = 0;
        this.y = 100;
        this.vx = 0;
        this.vy = 0;
        this.alpha = 0;
        this.omega = 0;
    }
}


// creat PID controller class
export class PID {
    constructor(r0, rI, rD, deltaT) {
        this.r0 = r0;
        this.rI = rI;
        this.rD = rD;
        this.deltaT = deltaT;
        this.eLast = 0;
        this.eLast2 = 0;
        this.uLast = 0;
    }
    // update PID controller
    update(e, deltaT) {
        this.deltaT = deltaT
        let u = this.solve(e, this.eLast, this.eLast2, this.uLast, this.r0, this.rI, this.rD, this.deltaT)
        // limit the control signal
        if (u > 100) {
            u = 100;
        }
        else if (u < -100) {
            u = -100;
        }
        this.eLast2 = this.eLast;
        this.eLast = e;
        this.uLast = u;
        return u
    }
    // add solver of PID controller
    solve(e, eLast, eLast2, uLast, r0, rI, rD, deltaT) {
        return uLast + r0*(e - eLast) + rI*e*deltaT + rD*(e - 2*eLast + eLast2)/deltaT
    }

    // reset PID controller
    reset() {
        this.eLast = 0;
        this.eLast2 = 0;
        this.uLast = 0;
        this.uLast = 0;
    }

}
