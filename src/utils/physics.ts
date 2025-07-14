/* ----- src/utils/physics.ts ----- */
/**
 * Returns whether a point is inside of a polygon.
 */
function pointInPolygon(point: Vector2D, polygon: Vector2D[]) {
    const x = point.x, y = point.y;

    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const xi = polygon[i].x, yi = polygon[i].y;
        const xj = polygon[j].x, yj = polygon[j].y;

        let intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) { inside = !inside; }
    }

    return inside;
}

/* ----- end of file ----- */