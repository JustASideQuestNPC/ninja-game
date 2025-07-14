/* ----- src/entities/bullet.ts ----- */

/** A bullet fired by enemies. */
class Bullet extends KEntityBase {
    displayLayer = 10;
    tags = [
        EntityTag.BULLET
    ];

    velocity: Vector2D;
    firedBy: KEntityBase;
    canHitEnemies: boolean = false;

    constructor(position: Vector2D, velocity: Vector2D, firedBy: KEntityBase) {
        super();
        this.position = position;
        this.velocity = velocity;
        this.firedBy = firedBy;

    }

    render(rt: p5 | p5.Graphics): void {
        const trailEnd = Vector2D.fromPolar(this.velocity.heading(), -15).add(this.position);
        rt.stroke("#fa1e1e");
        rt.strokeWeight(2);
        rt.line(this.position.x, this.position.y, trailEnd.x, trailEnd.y);
        rt.strokeWeight(6);
    }

    update(dt: number): void {
        this.position.add(this.velocity.copy().mult(dt));

        // collide with walls
        const walls = Kepler.getTagged(EntityTag.WALL_COLLISION);
        for (const wall of walls) {
            if (wall.collider.containsPoint(this.position)) {
                this.markForDelete = true;
                return;
            }
        }

        // collide with targets
        if (!this.canHitEnemies) {
            // the hurtbox is a slightly smaller collider that is used for checking hazards
            if (!Globals.player.hasIFrames && Globals.player.hurtbox.containsPoint(this.position)) {
                Globals.player.onDeath();
                this.markForDelete = true;
            }
        }
        else {
            const targets = Kepler.getTagged(EntityTag.IS_ENEMY) as EnemyBase[];
            for (const target of targets) {
                if (target.collider.containsPoint(this.position)) {
                    target.markForDelete = true;
                    target.onDeath();
                    Kepler.hitstop = CONSTANTS.BASE_ON_KILL_HITSTOP;
                    
                    this.markForDelete = true;
                    return;
                }
            }
        }
    }
}

/* ----- end of file ----- */