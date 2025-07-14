/* ----- src/entities/wall.ts ----- */

class Wall extends KEntityBase {
    displayLayer = -10;
    tags = [
        EntityTag.WALL_COLLISION,
        EntityTag.BLOCKS_PARTICLES
    ];

    constructor(x: number, y: number, width: number, height: number) {
        super(); // does literally nothing but is still required because javascript
        this.collider = new RectCollider(x, y, width, height);
    }

    render(rt: p5 | p5.Graphics) {
        rt.noStroke();
        rt.fill("#20272f");
        rt.rect(this.collider.x, this.collider.y, this.collider.width, this.collider.height);
    }
}

/* ----- end of file ----- */