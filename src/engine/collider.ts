/* ----- src/engine/rect-collider.ts ----- */

/** A rectangular collider. */
class RectCollider {
    x: number;
    y: number;
    width: number;
    height: number;

    // pseudo-members for centering the bounding box on things
    get centerX() { return this.x + this.width / 2; }
    set centerX(value: number) { this.x = value - this.width / 2; }
    get centerY() { return this.y + this.height / 2; }
    set centerY(value: number) { this.y = value - this.height / 2; }

    constructor(x: number, y: number, width: number, height: number) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    /** Returns whether the collider contains a point. */
    containsPoint(point: Vector2D): boolean;
    /** Returns whether the collider contains a point. */
    containsPoint(x: number, y: number): boolean;
    containsPoint(x: number | Vector2D, y?: number): boolean {
        // handle overloads
        if (x instanceof Vector2D) {
            y = x.y;
            x = x.x;
        }

        return (
            x > this.x && x < this.x + this.width &&
            y > this.y && y < this.y + this.height
        );
    }

    /**
     * Returns whether the collider overlaps with another collider. Can optionally set a translation
     * vector that moves them apart.
     * @param [transVec] A reference to store the "minimum translation vector" in. If the colliders
     *      overlap, this will be set to the smallest vector that moves this collider completely out
     *      of the other one. If the colliders do not overlap, it will be set to a zero vector.
     */
    isColliding(other: RectCollider, transVec?: Vector2D): boolean {
        const intersecting = !(
            this.x > other.x + other.width ||
            this.x + this.width < other.x ||
            this.y > other.y + other.height ||
            this.y + this.height < other.y
        );

        // skip the rest if we don't need to set a vector
        if (!transVec) {
            return intersecting;
        }

        if (!intersecting) {
            transVec.set(0, 0);
            return false;
        }

        // distance between centers on each axis
        const dx = other.centerX - this.centerX;
        const dy = other.centerY - this.centerY;

        // how much the colliders "penetrate" on each axis
        const mx = (this.width / 2 + other.width / 2) - Math.abs(dx);
        const my = (this.height / 2 + other.height / 2) - Math.abs(dy);

        // move the collider along whatever axis it penetrates less
        if (mx <= my) {
            if (dx < 0) { transVec.set( mx, 0); }
            else        { transVec.set(-mx, 0); }
        }
        else {
            if (dy < 0) { transVec.set(0,  my); }
            else        { transVec.set(0, -my); }
        }

        return true;
    }

    private ccw(p1: [number, number], p2: [number, number], p3: [number, number]) {
        return ((p3[1] - p1[1]) * (p2[0] - p1[0]) > (p2[1] - p1[1]) * (p3[0] - p2[0]));
    }

    /**
     * Returns whether two line segments intersect. This has issues if some of the points are
     * colinear, but I have better things to do right now so I'll burn that bridge when I get there.
     */
    private lineIntersection(l1: [[number, number], [number, number]],
                             l2: [[number, number], [number, number]]) {
        return (
            this.ccw(l1[0], l2[0], l2[1]) !== this.ccw(l1[1], l2[0], l2[1]) &&
            this.ccw(l1[0], l1[1], l2[0]) !== this.ccw(l1[0], l1[1], l2[1])
        );
    }

    /**
     * Returns whether a line intersects with the collider or is inside it.
     */
    containsLine(start: Vector2D, end: Vector2D): boolean;
    /**
     * Returns whether a line intersects with the collider or is inside it.
     */
    containsLine(x1: number, y1: number, x2: number, y2: number): boolean;
    containsLine(x1: number | Vector2D, y1: number | Vector2D, x2?: number, y2?: number): boolean {
        // handle overloads
        if (x1 instanceof Vector2D) {
            x2 = (y1 as Vector2D).x;
            y2 = (y1 as Vector2D).y;
            y1 = x1.y;
            x1 = x1.x;
        }
        // keeps typescript happy
        y1 = y1 as number;

        // checking whether either endpoint is inside the collider is fast and rules out a lot of
        // collisions
        if (this.containsPoint(x1, y1) || this.containsPoint(x2, y2)) {
            return true;
        }

        // give the line a bounding box and check that to rule out even more cases
        const bboxOverlap = !(
            this.x > Math.max(x1, x2) ||
            this.x + this.width < Math.min(x1, x2) ||
            this.y > Math.max(y1, y2) ||
            this.y + this.width < Math.min(y1, y2)
        );
        if (!bboxOverlap) { return false; }

        // check whether each edge of the collider intersects with the line
        const edges: [[number, number], [number, number]][] = [
            [[this.x, this.y], [this.x + this.width, this.y]],
            [[this.x + this.width, this.y], [this.x + this.width, this.y + this.height]],
            [[this.x + this.width, this.y + this.height], [this.x, this.y + this.height]],
            [[this.x, this.y + this.height], [this.x, this.y]]
        ];
        const line: [[number, number], [number, number]] = [[x1, y1], [x2, y2]];

        // console.log("checking edges");
        for (const edge of edges) {
            if (this.lineIntersection(line, edge)) {
                return true;
            }
        }

        return false;
    };
}

/* ----- end of file ----- */