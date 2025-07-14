/* ----- src/levels.ts ----- */

interface ILevelData {
    viewportBounds: [number, number, number, number];
    playerSpawn: [number, number];
    entities: LevelEntityUnion[];
}

// type unions for every entity
type LevelEntityUnion = (
    [LevelEntity.WALL, number, number, number, number] |
    [LevelEntity.WALLRUN_SURFACE, number, number, number, number] |
    [LevelEntity.TURRET_ENEMY, number, number, number] |
    [LevelEntity.STATIC_LASER, number, number, number, number] |
    [LevelEntity.FLOATING_TEXT, number, number, (ITextChunk|IKeybindChunk)[][]] |
    [LevelEntity.CHECKPOINT, number, number] |
    [LevelEntity.BULLET_WALL, number, number, number, number] |
    [LevelEntity.MELEE_ENEMY, number, number] |
    [LevelEntity.LEVEL_EXIT, number, number] |
    [LevelEntity.SPIKES, number, number, "up" | "down" | "left" | "right"]
);

enum LevelEntity {
    WALL,
    WALLRUN_SURFACE,
    TURRET_ENEMY,
    STATIC_LASER,
    FLOATING_TEXT,
    CHECKPOINT,
    BULLET_WALL,
    MELEE_ENEMY,
    LEVEL_EXIT,
    SPIKES
}

// scale factor for all positions and sizes in the level scale. this exists exclusively to make my
// life easier because i drew all of these levels on graph paper first
const CELL_SIZE = 60

/**
 * Loadable objects for all levels. The object key is what is used by the `load_level` command.
 */
const LEVELS: ILevelData[] = [
    // debug level (only accessible via console)
    {
        // defines the viewport, which limits where the camera can see
        viewportBounds: [0, 0, 10, 10], // [left, top, right, bottom]
        // player spawn point
        playerSpawn: [1.75, 9.25],
        // all entities as a list of arrays. the first item in each array is the entity type, and
        // the remaining items are the arguments passed to its constructor
        entities: [
            [LevelEntity.WALL, 0, 0, 0.5, 10],
            [LevelEntity.WALL, 9.5, 0, 0.5, 10],
            [LevelEntity.WALL, 0.5, 0, 9, 0.5],
            [LevelEntity.WALL, 0.5, 9.5, 9, 0.5],
        ],
    },
    // movement tutorial
    {
        // defines the viewport, which limits where the camera can see
        viewportBounds: [-14.5, -5, 13, 5], // [left, top, right, bottom]
        // player spawn point
        playerSpawn: [-9.5, 4.25],
        // all entities as a list of arrays. the first item in each array is the entity type, and
        // the remaining items are the arguments passed to its constructor
        entities: [
            [LevelEntity.WALL, -2.5, -2.5, 1.5, 0.5],
            [LevelEntity.WALL, -2.5, -2, 0.5, 7],
            [LevelEntity.WALL, -14.5, 4.5, 12, 0.5],
            [LevelEntity.WALL, -14.5, 0.5, 0.5, 4],
            [LevelEntity.WALL, -14.5, 0, 10, 0.5],
            [LevelEntity.WALL, -5, -5, 0.5, 5],
            [LevelEntity.WALL, -4.5, -5, 11, 0.5],
            [LevelEntity.WALL, 6.5, -5, 0.5, 5],
            [LevelEntity.WALL, 7, -0.5, 6, 0.5],
            [LevelEntity.WALL, 12.5, 0, 0.5, 8],
            [LevelEntity.WALL, 4, 4.5, 8.5, 0.5],
            [LevelEntity.WALL, 4, -2.5, 0.5, 7],
            [LevelEntity.WALL, 9, 3.5, 1.5, 1],

            [LevelEntity.WALLRUN_SURFACE, -1.5, -4.5, 6, 2.5],

            [LevelEntity.CHECKPOINT, -1.5, -2.5],
            [LevelEntity.LEVEL_EXIT, 12, 4],

            [LevelEntity.STATIC_LASER, -1, -2.25, 4, -2.25],
            
            [LevelEntity.SPIKES, 9.25, 3.25, "up"],
            [LevelEntity.SPIKES, 9.75, 3.25, "up"],
            [LevelEntity.SPIKES, 10.25, 3.25, "up"],
            [LevelEntity.SPIKES, 8.75, 4.25, "left"],
            [LevelEntity.SPIKES, 10.75, 4.25, "right"],
            [LevelEntity.SPIKES, 8.75, 3.75, "left"],
            [LevelEntity.SPIKES, 10.75, 3.75, "right"],

            [LevelEntity.FLOATING_TEXT, -9.5, 2.5, [
                [
                    ["keybind", "#ffb47a", "[WASD]", GpIcon.LEFT_STICK_NONE],
                    ["text", "#000000", "Move"]
                ],
                [
                    ["keybind", "#ffb47a", "[Space]", GpIcon.A],
                    ["text", "#000000", "Jump and walljump"]
                ]
            ]],
            [LevelEntity.FLOATING_TEXT, -1, -3.4, [
                [
                    ["keybind", "#ffb47a", "[Shift]", GpIcon.RIGHT_TRIGGER],
                    ["text", "#000000", "Wallrun"]
                ],
                [
                    ["text", "#000000", "(on gray surfaces)"],
                ]
            ]],
            [LevelEntity.FLOATING_TEXT, 9.75, 1.75, [
                [
                    ["keybind", "#ffb47a", "[Right Mouse]", GpIcon.B],
                    ["text", "#000000", "Dash"]
                ],
                [
                    ["text", "#000000", "Can be performed in midair"],
                ]
            ]]
        ],
    },
    // combat tutorial
    {
        // defines the viewport, which limits where the camera can see
        viewportBounds: [0, 0, 25, 11], // [left, top, right, bottom]
        // player spawn point
        playerSpawn: [2, 4.25],
        // all entities as a list of arrays. the first item in each array is the entity type, and
        // the remaining items are the arguments passed to its constructor
        entities: [
            [LevelEntity.WALL, 0, 0, 25, 0.5],
            [LevelEntity.WALL, 0, 0.5, 0.5, 4],
            [LevelEntity.WALL, 0, 4.5, 16, 0.5],
            [LevelEntity.WALL, 24.5, 0.5, 0.5, 10],
            [LevelEntity.WALL, 13.5, 10, 11, 0.5],
            [LevelEntity.WALL, 13, 8.5, 0.5, 2],
            [LevelEntity.WALL, 13.5, 8.5, 2, 0.5],
            [LevelEntity.WALL, 15.5, 5, 0.5, 4],
            [LevelEntity.WALL, 16, 6, 5, 0.5],
            [LevelEntity.WALL, 21, 5, 0.5, 3],
            [LevelEntity.WALL, 12, 2, 1, 1],
            [LevelEntity.WALL, 10.5, 2.25, 0.5, 0.25],
            [LevelEntity.WALL, 9.5, 2.75, 0.5, 0.25],
            [LevelEntity.WALL, 9.5, 3, 0.25, 0.5],

            [LevelEntity.BULLET_WALL, 7.25, 0.5, 7.25, 4.5],
            [LevelEntity.BULLET_WALL, 6.75, 0.5, 6.75, 4.5],
            [LevelEntity.BULLET_WALL, 12.25, 0.5, 12.25, 2],
            [LevelEntity.BULLET_WALL, 12.75, 0.5, 12.75, 2],

            [LevelEntity.STATIC_LASER, 12.25, 3, 12.25, 4.5],
            [LevelEntity.STATIC_LASER, 12.75, 3, 12.75, 4.5],

            [LevelEntity.MELEE_ENEMY, 18.5, 5.5],

            [LevelEntity.TURRET_ENEMY, 17.5, 6.75, -Math.PI / 2],
            [LevelEntity.TURRET_ENEMY, 19.5, 6.75, -Math.PI / 2],
            
            [LevelEntity.CHECKPOINT, 15, 4.5],
            [LevelEntity.CHECKPOINT, 23.5, 10],
            [LevelEntity.LEVEL_EXIT, 13.8, 9.5],

            [LevelEntity.FLOATING_TEXT, 3.5, 2.5, [
                [
                    ["text", "#000000", "While dashing, you are"]
                ],
                [
                    ["text", "#000000", "invulnerable to bullets"]
                ],
                [
                    ["text", "#000000", "and enemy attacks."]
                ],
            ]],
            [LevelEntity.FLOATING_TEXT, 17, 2.5, [
                [
                    ["keybind", "#ffb47a", "[Left Mouse]", GpIcon.X],
                    ["text", "#000000", "Attack"]
                ],
            ]],
            [LevelEntity.FLOATING_TEXT, 20, 8.5, [
                [
                    ["keybind", "#ffb47a", "[Left Mouse]", GpIcon.X],
                    ["text", "#000000", "Deflect bullets"]
                ],
            ]],
        ],
    },
    // no more levels :(
];

// preprocess all levels and apply cell size
for (const level of LEVELS) {
    level.viewportBounds[0] *= CELL_SIZE;
    level.viewportBounds[1] *= CELL_SIZE;
    level.viewportBounds[2] *= CELL_SIZE;
    level.viewportBounds[3] *= CELL_SIZE;

    level.playerSpawn[0] *= CELL_SIZE;
    level.playerSpawn[1] *= CELL_SIZE;

    for (const entity of level.entities) {
        for (let i = 1; i < entity.length; ++i) {
            if (typeof entity[i] === "number") {
                // by pure coincidence (seriously), turret enemies are the only ones that have a
                // number that shouldn't be scaled
                if (entity[0] !== LevelEntity.TURRET_ENEMY || i < entity.length - 1) {
                    (entity[i] as number) *= CELL_SIZE;
                }
            }
        }
    }
}

/* ----- end of file ----- */