/* ----- src/entities/wallrun-surface.ts ----- */

class WallrunSurface extends KEntityBase {
    displayLayer = -20;
    tags = [
        EntityTag.WALLRUN_SURFACE
    ];

    constructor(x: number, y: number, width: number, height: number) {
        super(); // does literally nothing but is still required because javascript
        this.collider = new RectCollider(x, y, width, height);
    }

    render(rt: p5 | p5.Graphics) {
        rt.noStroke();
        rt.fill("#9aa6b4");
        rt.rect(this.collider.x, this.collider.y, this.collider.width, this.collider.height);
    }
}

/* ----- end of file ----- */