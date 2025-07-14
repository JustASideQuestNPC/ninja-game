/* ----- src/console-commands.ts ----- */ 

/** All console commands. */
const CONSOLE_COMMANDS: IRegisterFunctionArgs[] = [
    {
        name: "sv_showHitboxes",
        description: "Enables or disables rendering entity hitboxes.",
        signatures: [
            [],
            ["bool"]
        ],
        callback(value: boolean) {
            Kepler.showHitboxes = value;
            console.log(`sv_showHitboxes = ${value}`);
        }
    },
    {
        name: "load_level",
        description: (
            "Loads a new level. This command uses the level ID, not the level's display name."
        ),
        signatures: [
            ["int"]
        ],
        callback(levelId: number) {
            if (LEVELS[levelId]) {
                loadLevel(levelId);
                changeGameState(GameState.GAMEPLAY);
            }
            else {
                console.error(`The level ID "${levelId}" does not exist!`);
            }
        }
    },
    {
        name: "kill_player",
        description: "Self-explanatory",
        signatures: [[]],
        callback() {
            Globals.player.onDeath();
        }
    }
];

/* ----- end of file ----- */ 