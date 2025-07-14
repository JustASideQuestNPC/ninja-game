/* ----- src/entities/bullet-wall.ts ----- */

/** A stationary wall of bullets. */
class BulletWall extends KEntityBase {
    displayLayer: number = -10;

    start: Vector2D;
    end: Vector2D;

    shotAngle: number;

    // for rendering
    renderLength: number;

    // the wall spawns 3 rows of bullets
    bulletSpawns: Vector2D[];
    bulletVelocity: Vector2D;
    // shot timers are offset to make them appear more random
    bulletShotTimers: number[] = [];

    constructor(x1: number, y1: number, x2: number, y2: number) {
        super();
        this.start = new Vector2D(x1, y1);
        this.end = new Vector2D(x2, y2);

        const delta = this.end.copy().sub(this.start);
        this.shotAngle = delta.heading() - Math.PI / 2;
        this.renderLength = delta.mag();

        // offset slightly forward so that the bullets don't appear on top of the mount
        const bulletOrigin = Vector2D.fromPolar(this.shotAngle + Math.PI / 2, 20).add(this.start);

        this.bulletSpawns = [
            bulletOrigin.copy(),
            Vector2D.fromPolar(this.shotAngle, 12).add(bulletOrigin),
            Vector2D.fromPolar(this.shotAngle, -12).add(bulletOrigin)
        ];

        // precalculate bullet velocity to save performance
        this.bulletVelocity = Vector2D.fromPolar(this.shotAngle + Math.PI / 2, 750);
        // add some random offsets to bullet timers
        for (let i = 0; i < this.bulletSpawns.length; ++i) {
            this.bulletShotTimers.push(
                Globals.random.float(
                    CONSTANTS.BULLET_WALL_MIN_SHOT_DELAY,
                    CONSTANTS.BULLET_WALL_MAX_SHOT_DELAY
                )
            );
        }
    }

    render(rt: p5 | p5.Graphics): void {
        rt.push();
        rt.translate(this.start.x, this.start.y);
        rt.rotate(this.shotAngle);
        rt.noStroke();

        // mounts
        rt.fill("#20272f");
        rt.quad(-15, 0, -12, 5, 12, 5, 15, 0);
        rt.quad(
            -15, this.renderLength,
            -12, this.renderLength - 5,
            12, this.renderLength - 5,
            15, this.renderLength
        );

        rt.pop();

        // rt.stroke("#ff00ff");
        // rt.strokeWeight(4);
        // for (const p of this.bulletSpawns) {
        //     rt.point(p.x, p.y);
        // }
    }

    update(dt: number): void {
        // update timers and spawn bullets
        for (let i = 0; i < this.bulletShotTimers.length; ++i) {
            this.bulletShotTimers[i] -= dt;
            if (this.bulletShotTimers[i] < 0) {
                this.bulletShotTimers[i] = Globals.random.float(
                    CONSTANTS.BULLET_WALL_MIN_SHOT_DELAY,
                    CONSTANTS.BULLET_WALL_MAX_SHOT_DELAY
                );

                Kepler.addEntity(
                    new Bullet(this.bulletSpawns[i].copy(), this.bulletVelocity.copy(), null)
                );
            }
        }
    }
}

/* ----- end of file ----- */