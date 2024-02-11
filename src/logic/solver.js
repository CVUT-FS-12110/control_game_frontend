export function solvePendulumNonLinear(x, xDot, fi, fiDot, u, deltaT, mC, mP, inertia, b, lt, g) {
    //denominator for shorter eqn
    let denom = ((7*lt**2*mP**2)/3 - lt**2*mP**2*Math.cos(fi)**2 + (7*mC*lt**2*mP)/3);

    //explicit euler solver
    let x2e = xDot + deltaT*((7*u*lt**2*mP)/3 - (7*b*xDot*lt**2*mP)/3 + (7*fiDot**2*lt**3*mP**2*Math.sin(fi))/3 + g*lt**2*mP**2*Math.cos(fi)*Math.sin(fi))/denom;
    let x3e= fi + deltaT*fiDot;
    let x4e = fiDot - deltaT*(lt*mP*(lt*mP*Math.cos(fi)*Math.sin(fi)*fiDot**2 + u*Math.cos(fi) + g*mP*Math.sin(fi) + mC*g*Math.sin(fi) - b*xDot*Math.cos(fi)))/denom;

    //implicit euler solver
    denom = ((7*lt**2*mP**2)/3 - lt**2*mP**2*Math.cos(x3e)**2 + (7*mC*lt**2*mP)/3);

    return {
        x1: x + deltaT*x2e,
        x2: xDot + deltaT*((7*u*lt**2*mP)/3 - (7*b*x2e*lt**2*mP)/3 + (7*x4e**2*lt**3*mP**2*Math.sin(x3e))/3 + g*lt**2*mP**2*Math.cos(x3e)*Math.sin(x3e))/denom,
        x3: fi + deltaT*x4e,
        x4: fiDot - deltaT*(lt*mP*(lt*mP*Math.cos(x3e)*Math.sin(x3e)*x4e**2 + u*Math.cos(x3e) + g*mP*Math.sin(x3e) + mC*g*Math.sin(x3e) - b*x2e*Math.cos(x3e)))/denom
    }
}

// euler PID solver
export function pid(e, eLast, eLast2, uLast, r0, rI, rD, deltaT) {
    return uLast + r0*(e - eLast) + rI*e*deltaT + rD*(e - 2*eLast + eLast2)/deltaT
}