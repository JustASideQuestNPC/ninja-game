/* ----- src/entities/melee-enemy.ts ----- */

/** An enemy that charges at the player. */
class MeleeEnemy extends EnemyBase {
    velocity: Vector2D;
    canSeePlayer = false;

    constructor(x: number, y: number) {
        super();
        this.position = new Vector2D(x, y);
        this.velocity = new Vector2D(); // defaults to a zero vector
        this.collider = new RectCollider(x - 10, y - 15, 20, 30);
    }

    render(rt: p5 | p5.Graphics): void {
        // body
        rt.noStroke();
        rt.fill("#f71f1f");
        rt.rect(this.collider.x, this.collider.y, this.collider.width, this.collider.height);

        // show detection radius
        if (Kepler.showHitboxes) {
            rt.noFill();
            rt.stroke(this.canSeePlayer ? "#00ff00" : "#ff00ff");
            rt.strokeWeight(4);
            rt.circle(this.position.x, this.position.y, CONSTANTS.MELEE_ENEMY_DETECTION_RADIUS * 2);
        }
    }

    update(dt: number): void {
        // used for both collision and player detection
        const walls = Kepler.getTagged(EntityTag.WALL_COLLISION);

        // distance to the player, squared
        const playerDistance = Globals.player.position.copy().sub(this.position).magSq();
        this.canSeePlayer = (playerDistance < Math.pow(CONSTANTS.MELEE_ENEMY_DETECTION_RADIUS, 2));

        let moveDir = 0;
        // run at the player if we can see them, otherwise come to a stop
        if (this.canSeePlayer) {
            // run at the player
            if (Globals.player.position.x < this.position.x) {
                moveDir = -1;
            }
            else {
                moveDir = 1;
            }
        }
        else if (this.velocity.x !== 0) {
            if (this.velocity.x > 0) {
                moveDir = -1;
            }
            else {
                moveDir = 1;
            }
        }

        if (moveDir !== 0) {
            // prevents weird vibrations at low speed
            const snapSpeedZero = (
                Math.abs(this.velocity.x) < CONSTANTS.MELEE_ENEMY_ACCELERATION * dt &&
                (this.velocity.x < 0 && moveDir > 0) || (this.velocity.x > 0 && moveDir < 0)
            );
            if (snapSpeedZero) {
                this.velocity.x = 0;
            }
            else {
                this.velocity.x += CONSTANTS.MELEE_ENEMY_ACCELERATION * moveDir * dt;
                this.velocity.x = clamp(
                    this.velocity.x,
                    -CONSTANTS.MELEE_ENEMY_RUN_SPEED,
                    CONSTANTS.MELEE_ENEMY_RUN_SPEED
                );
            }
        }

        // apply gravity and move
        this.velocity.y += CONSTANTS.GRAVITY * dt;
        this.position.add(this.velocity.copy().mult(dt));
        this.collider.centerX = this.position.x;
        this.collider.centerY = this.position.y;

        // collide with walls
        for (const wall of walls) {
            // trans rights!
            const transVec = new Vector2D();
            // isColliding() sets a translation vector using a reference
            if (this.collider.isColliding(wall.collider, transVec)) {
                this.position.add(transVec);
                this.collider.centerX = this.position.x;
                this.collider.centerY = this.position.y;

                // cancel velocity on the correct axis
                if (transVec.x !== 0) {
                    this.velocity.x = 0;
                }
                // a translation vector where both components are nonzero (or both components are
                // zero) *should* be impossible
                else {
                    this.velocity.y = 0;
                }
            }
        }

        // collide with the player
        if (this.collider.isColliding(Globals.player.hurtbox) && !Globals.player.hasIFrames) {
            Globals.player.onDeath();
        }
    }
}

/* ----- end of file ----- */