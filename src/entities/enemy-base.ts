/* ----- src/entities/enemy-base.ts ----- */

/** Base class for enemies that the player can kill. */
class EnemyBase extends KEntityBase {
    constructor() {
        super();
        // add tags here because some enemies have extra tags
        this.tags.push(EntityTag.IS_ENEMY);
    }

    /** Called when the player kills the enemy */
    onDeath(): void {}
}

/** Dummy enemy for testing; will probably be converted into a tutorial target or something. */
class DebugEnemy extends EnemyBase {

    constructor(x: number, y: number) {
        super();
        this.position = new Vector2D(x, y);
        this.collider = new RectCollider(x - 10, y - 15, 20, 30);
    }

    render(rt: p5 | p5.Graphics): void {
        rt.push();
        rt.translate(this.position.x, this.position.y);

        // body
        rt.noStroke();
        rt.fill("#384052");
        rt.rect(
            -this.collider.width / 2, -this.collider.height / 2,
            this.collider.width, this.collider.height
        );

        // accents
        rt.stroke("#f83f2a");
        rt.strokeWeight(3);
        rt.line(
            -this.collider.width / 2 + 4, -this.collider.height / 2 + 4,
            this.collider.width / 2 - 4, this.collider.height / 2 - 4
        );
        rt.line(
            this.collider.width / 2 - 4, -this.collider.height / 2 + 4,
            -this.collider.width / 2 + 4, this.collider.height / 2 - 4
        );
        rt.pop();
    }
}

/* ----- end of file ----- */