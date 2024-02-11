// Physics calculations for the pendulum
export function calculatePendulumPhysics(angle, angularVelocity, pendulumLength, gravity) {
    const angularAcceleration = (-1 * gravity / pendulumLength) * Math.sin(angle);
    angularVelocity += angularAcceleration; // Update angular velocity with acceleration
    angle += angularVelocity; // Update angle with new velocity
  
    // Optionally, apply damping here if needed
    angularVelocity *= 0.99;
  
    return { angle, angularVelocity };
  }
  