/* ----- src/constants.ts ----- */
/** If true, skips the NPC logo and goes directly to the main menu when the page loads. */
const SKIP_LOGO = true;

/**
 * All keybinds. `keys` is for keyboard keys and mouse buttons, and `buttons` is for gamepad
 * buttons.
 */
const KEYBINDS: { [key: string]: { keys: string[], buttons: string[] } } = {
    "up": {
        keys: ["w"],
        buttons: ["dpad up"],
    },
    "down": {
        keys: ["s"],
        buttons: ["dpad down"],
    },
    "left": {
        keys: ["a"],
        buttons: ["dpad left"],
    },
    "right": {
        keys: ["d"],
        buttons: ["dpad right"],
    },
    "jump": {
        keys: ["w"],
        buttons: ["a"],
    },
    "wallrun": {
        keys: ["shift"],
        buttons: ["right trigger"],
    },
    "attack": {
        keys: ["left mouse"],
        buttons: ["x"]
    },
    "dash": {
        keys: ["right mouse"],
        buttons: ["b"]
    },
    "menu confirm": {
        keys: ["left mouse", "enter"],
        buttons: ["a"]
    },
    "menu back": {
        keys: ["backspace"],
        buttons: ["b"]
    },
};

/** Shared container for constants. */
const CONSTANTS = {
    GRAVITY: 900, // pixels per second squared

    PLAYER_GROUND_ACCELERATION: 1800, // pixels per second squared
    PLAYER_AIR_ACCELERATION: 1800, // pixels per second squared
    PLAYER_GROUND_FRICTION: 2400, // pixels per second squared
    PLAYER_AIR_FRICTION: 0, // pixels per second squared
    // this is a "soft" speed cap - you can't go faster than it just by running, but you get to keep
    // any speed above it that you get from other sources
    PLAYER_MAX_RUN_SPEED: 275, // pixels per second
    PLAYER_MAX_FALL_SPEED: 600, // pixels per second
    // how long you can jump for after falling off a platform or wall, or after exiting a wallrun
    PLAYER_COYOTE_TIME: 0.25, // seconds
    PLAYER_JUMP_IMPULSE: -325, // pixels per second

    PLAYER_MAX_WALLRUN_DURATION: 1.5, // seconds
    // upward impulse when jumping out of a wallrun
    PLAYER_WALLRUN_JUMP_IMPULSE: -325, // pixels per second
    // gravity multiplier when moving upward
    PLAYER_WALLRUN_UPWARD_GRAVITY_MULTIPLIER: 1,
    // gravity multiplier when moving downward
    PLAYER_WALLRUN_DOWNWARD_GRAVITY_MULTIPLIER: 0.1,
    PLAYER_MAX_WALLRUN_FALL_SPEED: 50, // pixels per second
    // minimum horizontal speed to maintain a wallrun
    PLAYER_MIN_WALLRUN_SPEED: 0, // pixels per second
    PLAYER_WALLRUN_FRICTION: 1200, // pixels per second squared

    // impulse away from the wall
    PLAYER_WALLJUMP_X_IMPULSE: 350, // pixels per second
    // upward impulse
    PLAYER_WALLJUMP_Y_IMPULSE: -300, // pixels per second
    PLAYER_MAX_WALL_SLIDE_SPEED: 75, // pixels per second

    PLAYER_ATTACK_ARC_START: -Math.PI / 3, // radians
    PLAYER_ATTACK_ARC_END: Math.PI / 3, // radians
    // the attack arc is cut out of an ellipse with this width and height
    PLAYER_ATTACK_ARC_WIDTH: 120, // pixels
    PLAYER_ATTACK_ARC_HEIGHT: 60, // pixels
    PLAYER_ATTACK_ARC_FORWARD_OFFSET: -5, // pixels
    PLAYER_ATTACK_SWING_SPEED: Math.PI * 3, // radians per second
    // attack cooldown starts after the animation finishes
    PLAYER_ATTACK_COOLDOWN: 0.1, // seconds

    // lunge speed is only applied if you're below the max lunge speed or you're lunging in a
    // different direction than you're moving
    PLAYER_ATTACK_LUNGE_SPEED: 450, // pixels per second
    PLAYER_LUNGE_TURNAROUND_ANGLE: Math.PI / 6, // radians

    PLAYER_DASH_SPEED: 750, // pixels per second
    PLAYER_DASH_DURATION: 0.175, // seconds
    // by default, how much of your dash velocity is preserved after the dash. this is a multiplier
    // applied to your velocity, not a velocity value
    PLAYER_DASH_PRESERVED_VELOCITY: 0,
    // hitstop after ending a dash
    PLAYER_DASH_END_HITSTOP: 0, // seconds

    // whether sliding on a wall recharges your attack lunge
    PLAYER_WALLSLIDE_RECHARGES_LUNGE: true,
    // whether sliding on a wall recharges your dash
    PLAYER_WALLSLIDE_RECHARGES_DASH: false,
    // whether sliding on a wall recharges your wallrun
    PLAYER_WALLSLIDE_RECHARGES_WALLRUN: true,
    // whether entering a wallrun recharges your attack lunge
    PLAYER_WALLRUN_RECHARGES_LUNGE: true,
    // whether entering a wallrun recharges your dash
    PLAYER_WALLRUN_RECHARGES_DASH: false,
    // whether dashing recharges your attack lunge
    PLAYER_DASH_RECHARGES_LUNGE: true,
    // whether dashing recharges your wallrun
    PLAYER_DASH_RECHARGES_WALLRUN: true,

    DEFLECTED_BULLET_SPEED: 900, // pixels per second

    // default hitstop when an enemy is killed
    BASE_ON_KILL_HITSTOP: 0,
    // hitstop when a bullet is deflected
    BULLET_DEFLECT_HITSTOP: 0,

    // how quickly turrets rotate
    TURRET_ENEMY_TRACKING_SPEED: Math.PI * 0.35, // radians per second
    // how far to either side of its mount a turret can aim
    TURRET_ENEMY_MAX_ANGLE: Math.PI / 2,
    // the turret will fire when it is within this angle of the player
    TURRET_ENEMY_AIM_TOLERANCE: Math.PI * 0.05, // radians
    // delay between turret shots
    TURRET_ENEMY_SHOT_DELAY: 1.25, // seconds
    TURRET_ENEMY_BULLET_SPEED: 600, // pixels per second

    BULLET_WALL_MIN_SHOT_DELAY: 0.05, // seconds
    BULLET_WALL_MAX_SHOT_DELAY: 0.15, // seconds
    BULLET_WALL_SHOT_VELOCITY: 900, // pixels per second

    MELEE_ENEMY_RUN_SPEED: 300, // pixels per second
    MELEE_ENEMY_ACCELERATION: 1800, // pixels per second squared
    MELEE_ENEMY_DETECTION_RADIUS: 300, // pixels

    // which input actions are press-type actions. don't touch this unless you know what you're
    // doing (or do, i'm not your mom)
    PRESS_ACTIONS: ["jump", "attack", "dash", "menu confirm", "menu back"],
};

/** Tags for marking entity attributes. */
enum EntityTag {
    WALL_COLLISION, // entity collides with the player and blocks their movement
    WALLRUN_SURFACE, // background surface that the player can wallrun on
    IS_ENEMY, // any enemy the player can kill
    BLOCKS_PARTICLES, // particles collide with the entity
    BULLET, // self-explanatory
    CHECKPOINT, // also self-explanatory
}

enum GameState {
    NPC_LOGO,
    MAIN_MENU,
    GAMEPLAY,
    LEVEL_SELECT,
    LEVEL_COMPLETE
}

// names of all gamepad icons
enum GpIcon {
    A, A_COLORLESS,
    B, B_COLORLESS,
    X, X_COLORLESS,
    Y, Y_COLORLESS,
    DPAD_NONE,
    DPAD_UP,
    DPAD_DOWN,
    DPAD_LEFT,
    DPAD_RIGHT,
    DPAD_VERTICAL,
    DPAD_HORIZONTAL,
    DPAD_ALL,
    LEFT_BUMPER,
    RIGHT_BUMPER,
    LEFT_TRIGGER,
    RIGHT_TRIGGER,
    LEFT_STICK_CLICK,
    RIGHT_STICK_CLICK,
    LEFT_STICK_NONE,
    LEFT_STICK_UP,
    LEFT_STICK_DOWN,
    LEFT_STICK_LEFT,
    LEFT_STICK_RIGHT,
    LEFT_STICK_VERTICAL,
    LEFT_STICK_HORIZONTAL,
    LEFT_STICK_ALL,
    RIGHT_STICK_NONE,
    RIGHT_STICK_UP,
    RIGHT_STICK_DOWN,
    RIGHT_STICK_LEFT,
    RIGHT_STICK_RIGHT,
    RIGHT_STICK_VERTICAL,
    RIGHT_STICK_HORIZONTAL,
    RIGHT_STICK_ALL,
}

interface IGlobals {
    p5: p5;
    gameState: GameState;
    player: Player;
    playerSpawn: [number, number];
    random: SplitMix32;
    currentLevelIndex: number;
}

/** Shared container for global variables. */
const Globals: IGlobals = {
    p5: null, // the main sketch instance
    gameState: null, // the current game state
    player: null, // shared reference to the player
    playerSpawn: [-1, -1], // current player spawn point
    random: null, // the random number generator (yes, this is extremely unnecessary)
    currentLevelIndex: 0 // self-explanatory
};

// predefines to keep typescript happy
let changeGameState: (newState: GameState) => void;

/* ----- end of file ----- */