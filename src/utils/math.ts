/* ----- src/utils/math.ts ----- */

/**
 * Returns the radius of an ellipse at a specific angle in radians.
 */
function ellipseRadius(width: number, height: number, angle: number): number {
    return (
        (width / 2 * height / 2) / Math.sqrt(
            Math.pow(width / 2, 2) * Math.pow(Math.sin(angle), 2) +
            Math.pow(height / 2, 2) * Math.pow(Math.cos(angle), 2)
        )
    );
}

/**
 * Maps a value from one range to another.
 */
function map(value: number, inputStart: number, inputEnd: number, outputStart: number,
             outputEnd: number): number {
    
    const slope = (outputEnd - outputStart) / (inputEnd - inputStart);
    return outputStart + slope * (value - inputStart);
}

/**
 * Version of the modulo (%) operator that correctly handles negative numbers.
 */
function modulo(n: number, m: number): number {
    return ((n % m) + m) % m;
}

/**
 * Limits a number to within a range.
 */
function clamp(n: number, low: number, high: number): number {
    if (n < low) { return low; }
    if (n > high) { return high; }
    return n;
}

/* ----- end of file ----- */