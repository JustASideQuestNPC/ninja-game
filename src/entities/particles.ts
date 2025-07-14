/* ----- src/entities/particles.ts ----- */

/** A basic, single-color square particle that disappears after a short time. */
class BasicParticle extends ParticleBase {
    velocity: Vector2D;
    lifetime: number;
    color: string;

    constructor(position: Vector2D, velocity: Vector2D, lifetime: number, color: string) {
        super(position);
        this.velocity = velocity;
        this.lifetime = lifetime;
        this.color = color;
    }

    update(dt: number): void {
        this.position.add(this.velocity.copy().mult(dt));
        this.lifetime -= dt;
        if (this.lifetime <= 0) {
            this.markForDelete = true;
        }
    }

    render(rt: p5 | p5.Graphics): void {
        rt.noStroke();
        rt.fill(this.color);
        rt.square(this.position.x - 2, this.position.y - 2, 4);
    }
}

/** A variant of the basic particle that is affected by gravity. */
class GravityParticle extends BasicParticle {
    update(dt: number): void {
        this.velocity.y += CONSTANTS.GRAVITY * dt;
        // call the original update method to update everything else
        super.update(dt);
    }
}

/** A single burst of particles affected by gravity. */
class GravityParticleBurst extends ParticleEmitterBase {
    particleColor: string;
    minParticleLifetime: number;
    maxParticleLifetime: number;
    minFiredParticles: number;
    maxFiredParticles: number;
    minLaunchSpeed: number;
    maxLaunchSpeed: number;
    minLaunchAngle: number;
    maxLaunchAngle: number;

    constructor(position: Vector2D, particleColor: string, minParticleLifetime: number,
                maxParticleLifetime: number, minFiredParticles: number, maxFiredParticles: number,
                minLaunchSpeed: number, maxLaunchSpeed: number, minLaunchAngle: number=0,
                maxLaunchAngle: number=Math.PI * 2) {
        
        super(position);
        this.particleColor = particleColor;
        this.minParticleLifetime = minParticleLifetime;
        this.maxParticleLifetime = maxParticleLifetime;
        this.minFiredParticles = minFiredParticles;
        this.maxFiredParticles = maxFiredParticles;
        this.minLaunchSpeed = minLaunchSpeed;
        this.maxLaunchSpeed = maxLaunchSpeed;
        this.minLaunchAngle = minLaunchAngle;
        this.maxLaunchAngle = maxLaunchAngle;
    }

    update(dt: number): void {
        // int() normally excludes the upper bound
        const numParticles = Globals.random.int(this.minFiredParticles, this.maxFiredParticles + 1);
        for (let i = 0; i < numParticles; ++i) {
            this.system.addParticle(
                new GravityParticle(
                    this.position.copy(),
                    Vector2D.fromPolar(
                        Globals.random.float(this.minLaunchAngle, this.maxLaunchAngle),
                        Globals.random.float(this.minLaunchSpeed, this.maxLaunchSpeed)
                    ),
                    Globals.random.float(this.minParticleLifetime, this.maxParticleLifetime),
                    this.particleColor
                )
            );
        }

        // fire particles once, then delete the emitter
        this.markForDelete = true;
    }
}

/* ----- end of file ----- */