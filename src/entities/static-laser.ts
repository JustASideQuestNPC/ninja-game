/* ----- src/entities/death-laser.ts ----- */

/** A stationary deadly laser. */
class StaticLaser extends KEntityBase {
    start: Vector2D;
    end: Vector2D;

    // for rendering
    renderAngle: number;
    renderLength: number;

    // the laser has two hitboxes to make it slightly wider (i should probably write a real polygon
    // collider but i really don't feel like it right now)
    hitbox1: [Vector2D, Vector2D];
    hitbox2: [Vector2D, Vector2D];

    constructor(x1: number, y1: number, x2: number, y2: number) {
        super();
        this.start = new Vector2D(x1, y1);
        this.end = new Vector2D(x2, y2);

        const delta = this.end.copy().sub(this.start);
        this.renderAngle = delta.heading() - Math.PI / 2;
        this.renderLength = delta.mag();

        const leftHitboxOffset = Vector2D.fromPolar(this.renderAngle, -5);
        const rightHitboxOffset = Vector2D.fromPolar(this.renderAngle, 5);

        this.hitbox1 = [
            this.start.copy().add(leftHitboxOffset),
            this.end.copy().add(leftHitboxOffset)
        ];
        this.hitbox2 = [
            this.start.copy().add(rightHitboxOffset),
            this.end.copy().add(rightHitboxOffset)
        ];
    }

    render(rt: p5 | p5.Graphics): void {
        rt.push();
        rt.translate(this.start.x, this.start.y);
        rt.rotate(this.renderAngle);
        rt.noStroke();
        // laser core
        rt.fill("#ffc2c2");
        rt.rect(-10, 0, 20, this.renderLength);
        rt.fill("#ff8080");
        rt.rect(-7, 0, 14, this.renderLength);
        rt.fill("#fa1e1e");
        rt.rect(-3, 0, 6, this.renderLength);

        // mounts
        rt.fill("#20272f");
        rt.beginShape();
        rt.vertex(-15, 0);
        rt.vertex(-15, 10);
        rt.vertex(-12, 19);
        rt.vertex(-12, 29);
        rt.vertex(12, 29);
        rt.vertex(12, 19);
        rt.vertex(15, 10);
        rt.vertex(15, 0);
        rt.endShape("close");

        rt.fill("#9bacbf");
        rt.rect(-6, 0, 12, 24);
        
        rt.translate(0, this.renderLength);
        rt.fill("#20272f");
        rt.beginShape();
        rt.vertex(-15, -0);
        rt.vertex(-15, -10);
        rt.vertex(-12, -19);
        rt.vertex(-12, -29);
        rt.vertex(12, -29);
        rt.vertex(12, -19);
        rt.vertex(15, -10);
        rt.vertex(15, -0);
        rt.endShape("close");

        rt.fill("#9bacbf");
        rt.rect(-6, -24, 12, 24);

        rt.pop();

        if (Kepler.showHitboxes) {
            rt.stroke("#ff00ff");
            rt.strokeWeight(2);
            rt.line(this.hitbox1[0].x, this.hitbox1[0].y, this.hitbox1[1].x, this.hitbox1[1].y);
            rt.line(this.hitbox2[0].x, this.hitbox2[0].y, this.hitbox2[1].x, this.hitbox2[1].y);
        }
    }

    update(dt: number): void {
        const colliding = (
            Globals.player.collider.containsLine(this.hitbox1[0], this.hitbox1[1]) ||
            Globals.player.collider.containsLine(this.hitbox2[0], this.hitbox2[1])
        );
        if (colliding) {
            Globals.player.onDeath();
        }
    }
}

/* ----- end of file ----- */