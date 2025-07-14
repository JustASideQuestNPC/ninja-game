/* ----- src/entities/spikes.ts ----- */

/** Deadly spikes */
class SpikeWall extends KEntityBase {
    private spriteAngle: number;

    constructor(x: number, y: number, facingDirection: "up" | "down" | "left" | "right") {
        super();
        this.position = new Vector2D(x, y);
        // rotate collider and sprite to the correct angle
        switch (facingDirection) {
            case "up":
                this.collider = new RectCollider(x - 13, y + 3, 26, 12);
                this.spriteAngle = 0;
                break;
            case "down":
                this.collider = new RectCollider(x - 13, y - 15, 26, 12);
                this.spriteAngle = Math.PI;
                break;
            case "left":
                this.collider = new RectCollider(x + 3, y - 13, 12, 26);
                this.spriteAngle = -Math.PI / 2;
                break;
            case "right":
                this.collider = new RectCollider(x - 15, y - 13, 12, 26);
                this.spriteAngle = Math.PI / 2;
                break;
        }
    }

    render(rt: p5 | p5.Graphics): void {
        rt.push();
        rt.translate(this.position.x, this.position.y);
        rt.rotate(this.spriteAngle);

        rt.noStroke();
        rt.fill("#8b939e");
        rt.triangle(-10, 0, -15, 15, -5, 15);
        rt.triangle(0, 0, -5, 15, 5, 15);
        rt.triangle(10, 0, 5, 15, 15, 15);

        rt.pop();
    }

    update(dt: number): void {
        if (this.collider.isColliding(Globals.player.collider)) {
            Globals.player.onDeath();
        }
    }
}

/* ----- end of file ----- */