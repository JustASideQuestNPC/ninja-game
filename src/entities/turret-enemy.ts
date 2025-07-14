/* ----- src/entities/turret-enemy.ts ----- */

/** A wall-mounted turret that fires single bullets at the player. */
class TurretEnemy extends EnemyBase {
    mountAngle: number;
    turretAngle: number;
    minTurretAngle: number;
    maxTurretAngle: number;
    shotTimer: number;

    constructor(x: number, y: number, mountAngle: number) {
        super();
        this.position = new Vector2D(x, y);
        this.mountAngle = mountAngle;

        this.turretAngle = mountAngle + Math.PI;
        this.minTurretAngle = this.turretAngle - CONSTANTS.TURRET_ENEMY_MAX_ANGLE;
        this.maxTurretAngle = this.turretAngle + CONSTANTS.TURRET_ENEMY_MAX_ANGLE;

        this.collider = new RectCollider(x - 20, y - 20, 40, 40);
        this.shotTimer = 0;
    }

    render(rt: p5 | p5.Graphics): void {
        rt.push();
        rt.translate(this.position.x, this.position.y);

        // mount
        rt.push();
        rt.rotate(this.mountAngle);
        rt.noStroke();
        rt.fill("#20272f");
        // rt.triangle(0, 0, 25, -25, 25, 25);
        rt.quad(0, -12, 20, -25, 20, 25, 0, 12);
        rt.pop();

        // turret
        rt.push();
        rt.rotate(this.turretAngle);
        rt.fill("#435070");
        rt.circle(0, 0, 32);
        rt.rect(0, -7, 30, 14);

        rt.fill("#f83f2a");
        rt.circle(0, 0, 24);
        rt.rect(0, -3, 30, 6);

        rt.fill("#435070");
        rt.circle(0, 0, 16);
        rt.pop();
        rt.pop();
    }

    update(dt: number): void {
        // get an angle pointing to the player
        const playerAngle = Globals.player.position.copy().sub(this.position).heading();

        let delta = modulo((playerAngle - this.turretAngle) + Math.PI, Math.PI * 2) - Math.PI;

        // snap to the angle if we're close enough
        if (Math.abs(delta) < CONSTANTS.TURRET_ENEMY_TRACKING_SPEED * dt) {
            this.turretAngle = playerAngle;
        }
        else {
            if (delta < 0) {
                this.turretAngle -= CONSTANTS.TURRET_ENEMY_TRACKING_SPEED * dt;
            }
            else {
                this.turretAngle += CONSTANTS.TURRET_ENEMY_TRACKING_SPEED * dt;
            }
        }

        // apply aim limits
        this.turretAngle = clamp(this.turretAngle, this.minTurretAngle, this.maxTurretAngle);

        // update delta and fire if possible
        if (this.shotTimer <= 0) {
            delta = modulo((playerAngle - this.turretAngle) + Math.PI, Math.PI * 2) - Math.PI;
            if (Math.abs(delta) < CONSTANTS.TURRET_ENEMY_AIM_TOLERANCE) {
                this.shotTimer = CONSTANTS.TURRET_ENEMY_SHOT_DELAY;
                
                const shotAngleVector = Vector2D.fromPolar(this.turretAngle);

                Kepler.addEntity(new Bullet(
                    this.position.copy().add(shotAngleVector.copy().mult(26)),
                    shotAngleVector.copy().mult(CONSTANTS.TURRET_ENEMY_BULLET_SPEED),
                    this
                ));
            }
        }
        else {
            this.shotTimer -= dt;
        }
    }
}

/* ----- end of file ----- */