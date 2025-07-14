/* ----- src/engine/random.ts ----- */

/**
 * A seedable pseudorandom number generator using the SplitMix32 PRNG algorithm.
 */
class SplitMix32 {
    /**
     * The seed used to initialize the generator (this is stored here because using the generator
     * changes the seed).
     */
    private initialSeed: number | string;

    /** The number or string seed used to initialize the generator. Read-only. */
    get seed() { return this.initialSeed; }

    // The next seed to use when a number is generated. This is initially determined by the starting
    // seed and is updated each time a number is generated.
    private currentSeed: number;

    /**
     * A seedable pseudorandom number generator using the SplitMix32 PRNG algorithm.
     * @param [seed] A string or number to initialize the generator with. The same seed will always
     *      produce the same sequence of values. The default seed is random and produces a unique
     *      sequence of values.
     */
    // you have no idea how viscerally wrong it feels to use a function in a default parameter
    constructor(seed: number | string = Date.now()) {
        this.initialSeed = seed;

        // the actual PRNG always uses a number so strings need to be hashed
        if (typeof seed === "string") {
            // hash functions convert a string into a number such that the same string always
            // produces the same number, but different strings will never produce the same number.
            // this is djb2, which isn't the greatest hash but it's also only 6 lines
            this.currentSeed = 0;
            for (const char of seed) {
                // bitwise operations are faster and (much more importantly) probably make me look
                // smarter. this is equivalent to "this.currentSeed = this.currentSeed * 32 + char"
                this.currentSeed = (this.currentSeed << 5) + this.currentSeed + char.charCodeAt(0);
                this.currentSeed |= 0; // constrain to 32-bit integer
            }
        }
        // numeric seeds can be used directly
        else {
            this.currentSeed = seed;
        }

        // similar seeds can sometimes produce the same first few values, so we get past those here
        for (let i = 0; i < 20; ++i) { this.gen(); }
    }

    /** The core SplitMix32 PRNG. Returns a pseudorandom number between 0 and 1. */
    private gen(): number {
        // note: | and |= are used to make JS use bitwise operations, which are significantly faster
        // than normal mutiplication and addition. they also probably make me look smarter, which is
        // always a plus.
        this.currentSeed |= 0;
        this.currentSeed = this.currentSeed + 0x9e3779b9 | 0;
        let t = this.currentSeed ^ this.currentSeed >>> 16;
        t = Math.imul(t, 0x21f0aaad);
        t = t ^ t >>> 15;
        t = Math.imul(t, 0x735a2d97);
        return ((t = t ^ t >>> 15) >>> 0) / 4294967296;
    }

    /**
     * Returns a random floating-point number between 0 and 1.
     */
    float(): number;
    /**
     * Returns a random floating-point number between 0 and `high`.
     */
    float(high: number): number;
    /**
     * Returns a random floating-point number between `low` and `high`.
     */
    float(low: number, high: number): number;
    float(low?: number, high?: number): number {
        // handle overloads
        if (high === undefined) {
            high = (low !== undefined ? low : 1);
            low = 0;
        }

        return low + this.gen() * (high - low);
    }

    /**
     * Returns a random integer number between 0 and `high`.
     */
    int(high: number): number;
    /**
     * Returns a random integer number between `low` and `high`.
     */
    int(low: number, high: number): number;
    int(low: number, high?: number): number {
        return Math.floor(this.float(low, high));
    }

    /**
     * Returns a random boolean (true or false).
     * @param [bias] An optional value between 0 and 1 that makes one result more likely. A value of
     *      0 always returns false and a value of 1 always returns true. Defaults to 0.5, which
     *      makes both results equally likely.
     */
    bool(bias: number = 0.5) {
        // handle edge cases
        if (bias <= 0) { return false; }
        if (bias >= 1) { return true; }

        return this.gen() < bias;
    }

    /**
     * Shuffles an array. An empty array is (obviously) unchanged.
     */
    shuffle<T>(array: T[]): T[] {
        // normally i don't check for things like this, but using a non-array could potentially
        // result in an infinite loop
        if (!Array.isArray(array)) {
            throw new TypeError("[SplitMix32] Cannot shuffle a non-array.");
        }

        const shuffled = array.slice(); // fisher-yates shuffles in-place
        let currentIndex = array.length;
        while (currentIndex !== 0) {
            // pick a remaining element
            const randomIndex = this.int(currentIndex);
            --currentIndex;

            // swap with the current element
            [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
        }

        return shuffled;
    }

    /**
     * Returns a random item in an array, or null if the array is empty.
     */
    choose<T>(array: T[]): T {
        if (array.length === 0) { return null; }
        return array[this.int(array.length)];
    }
}

/* ----- end of file ----- */