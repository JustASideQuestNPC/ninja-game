/* ----- src/engine/particle-system.ts ----- */

class ParticleSystem extends KEntityBase {
    displayLayer: number = 100;

    // /**
    //  * When updating, any particles that are more than this far outside of the viewport will be
    //  * deleted.
    //  */
    // viewportMargin = 100;

    /**
     * How many particles can be active at any time.
     */
    maxLiveParticles = 250;

    // all active particle emitters
    private emitters: ParticleEmitterBase[] = [];
    // all active particles
    private particles: ParticleBase[] = [];

    constructor() {
        super();
    }

    update(dt: number): void {
        // update emitters
        for (const e of this.emitters) {
            e.update(dt);
        }

        // update particles
        for (const p of this.particles) {
            p.update(dt);
        }

        // delete stuff
        this.emitters = this.emitters.filter(e => !e.markForDelete);
        this.particles = this.particles.filter(p => !p.markForDelete);
    }

    render(rt: p5 | p5.Graphics): void {
        for (const p of this.particles) {
            p.render(rt);
        }
    }

    addParticle(p: ParticleBase) {
        if (this.particles.length < this.maxLiveParticles) {
            this.particles.push(p);
        }
    }

    addEmitter(e: ParticleEmitterBase) {
        this.emitters.push(e);
        e.system = this;
    }
}

/** Base class for particle emitters. */
abstract class ParticleEmitterBase {
    markForDelete: boolean = false;
    position: Vector2D;
    /**
     * The particle system containing the emitter. This will be set automatically when the emitter
     * is added to the system. DO NOT TRY TO SET IT YOURSELF.
     */
    system: ParticleSystem;

    /** Whether the emitter should be entirely deleted when it gets unloaded. */
    deleteOnUnload: boolean = false;

    constructor(position: Vector2D) {
        this.position = position;
    }

    /** Called when the emitter is loaded or reloaded. */
    onLoad(): void {}
    /** Called when the emitter is unloaded. */
    onUnload(): void {}
    /**
     * Updates the emitter.
     * @param dt The time between the last two updates in second, with the current time scale
     *      applied (unless the entity has the `KeplerTag.USES_RAW_DELTA_TIME` tag).
     */
    update(dt: number): void {}
}

/** Base class for particles. */
abstract class ParticleBase {
    markForDelete: boolean = false;
    position: Vector2D;

    constructor(position: Vector2D) {
        this.position = position;
    }

    /**
     * Draws the entity to the canvas.
     * @param rt The render target.
     */
    render(rt: p5|p5.Graphics) {}
    /**
     * Updates the emitter.
     * @param dt The time between the last two updates in second, with the current time scale
     *      applied (unless the entity has the `KeplerTag.USES_RAW_DELTA_TIME` tag).
     */
    update(dt: number): void {}
}

/* ----- end of file ----- */