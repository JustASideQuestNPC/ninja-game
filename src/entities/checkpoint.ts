/* ----- src/entities/checkpoint.ts ----- */

/** A checkpoint. */
class Checkpoint extends KEntityBase {
    displayLayer: number = -7;
    tags: KEntityTagUnion[] = [
        EntityTag.CHECKPOINT
    ];

    private _active: boolean = false;
    private animationDirection: number = 0; // 1 = raising flag, -1 = lowering flag
    private animationTime = 0;
    private animating = false;
    // where the player should spawn when the checkpoint is active
    private playerSpawn: [number, number] = [-1, -1];

    // getter/setter to automatically start animations when the checkpoint is activated
    get active() { return this._active; }
    set active(value: boolean) {
        this._active = value;
        this.animating = true;
        if (this._active) {
            this.animationTime = 0;
            this.animationDirection = 1;
        }
        // only animate if the flag was actually raised
        else if (this.animationTime >= 0.5) {
            this.animationTime = 0.5;
            this.animationDirection = -1;
        }
    }

    // for animating the flag
    static easeFlagPos(x: number) {
        let t = x / 0.5;
        return (
            x <= 0 ? 0 :
            x >= 0.5 ? -50 :
            (1 - Math.pow(1 - t, 3)) * -50
        );
    }

    constructor(x: number, y: number) {
        super();
        this.position = new Vector2D(x, y);
        this.collider = new RectCollider(x - 17, y - 50, 34, 50);
        this.playerSpawn = [x, y - 15];
    }

    render(rt: p5 | p5.Graphics): void {
        rt.push();
        rt.translate(this.position.x, this.position.y);

        // flagpole
        rt.noStroke();
        rt.fill("#3e3e60");
        rt.rect(-17, -50, 5, 50);

        // flag
        if (this.animating) {
            rt.fill("#386fe5");
            const flagHeight = Checkpoint.easeFlagPos(this.animationTime);
            // draw different polygons depending on where the flag is
            if (flagHeight > -10) {
                rt.beginShape();
                rt.vertex(-12, flagHeight);
                rt.vertex(12, flagHeight);
                rt.vertex(2 - flagHeight, 0);
                rt.vertex(-12, 0);
                rt.endShape("close");
            }
            else if (flagHeight > -20) {
                rt.beginShape();
                rt.vertex(-12, flagHeight);
                rt.vertex(12, flagHeight);
                rt.vertex(2, flagHeight + 10);
                rt.vertex(12 + flagHeight, 0);
                rt.vertex(-12, 0);
                rt.endShape("close");
            }
            else {
                rt.beginShape();
                rt.vertex(-12, flagHeight);
                rt.vertex(12, flagHeight);
                rt.vertex(2, flagHeight + 10);
                rt.vertex(12, flagHeight + 20);
                rt.vertex(-12, flagHeight + 20);
                rt.endShape("close");
            }
        }
        else if (this._active) {
            rt.fill("#386fe5");
            rt.beginShape();
            rt.vertex(-12, -50);
            rt.vertex(12, -50);
            rt.vertex(2, -40);
            rt.vertex(12, -30);
            rt.vertex(-12, -30);
            rt.endShape("close");
        }

        rt.pop();
    }

    update(dt: number): void {
        // update animation
        if (this.animating) {
            this.animationTime += dt * this.animationDirection;
            if (this.animationTime <= 0 || this.animationTime >= 0.5) {
                this.animating = false;
            }
        }

        // only check collisions if we aren't the active checkpoint
        if (this._active) { return; }
        if (Globals.player.collider.isColliding(this.collider)) {
            this.active = true; // also starts the animation
            Globals.playerSpawn = this.playerSpawn;
            // deactivate all other checkpoints
            const checkpoints = Kepler.getTagged(EntityTag.CHECKPOINT) as Checkpoint[];
            for (const c of checkpoints) {
                if (c !== this) {
                    c.active = false;
                }
            }
        }
    }
}

/* ----- end of file ----- */