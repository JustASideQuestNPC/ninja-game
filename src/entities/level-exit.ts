/* ----- src/entities/level-exit.ts ----- */

class LevelExit extends KEntityBase {
    constructor(x: number, y: number) {
        super();
        this.collider = new RectCollider(x - 25, y - 30, 40, 60);
    }

    render(rt: p5 | p5.Graphics): void {
        rt.noStroke();
        rt.fill("#007ef3");
        rt.rect(this.collider.x, this.collider.y, this.collider.width, this.collider.height);
        rt.fill("#51c8ff");
        rt.rect(
            this.collider.x + 5, this.collider.y + 5,
            this.collider.width - 10, this.collider.height - 10
        );
        rt.fill("#2c2f36");
        rt.circle(this.collider.x + 27, this.collider.y + 30, 6);
    }

    update(dt: number): void {
        if (this.collider.isColliding(Globals.player.collider)) {
            changeGameState(GameState.LEVEL_COMPLETE);
        }
    }
}

/* ----- end of file ----- */