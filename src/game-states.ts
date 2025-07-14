/* ----- src/game-states.ts ----- */

// lookup table for entity constructors
const ENTITY_CTORS: { [key in LevelEntity]: (new (...args: any[]) => KEntityBase) } = {
    [LevelEntity.WALL]: Wall,
    [LevelEntity.WALLRUN_SURFACE]: WallrunSurface,
    [LevelEntity.TURRET_ENEMY]: TurretEnemy,
    [LevelEntity.STATIC_LASER]: StaticLaser,
    [LevelEntity.FLOATING_TEXT]: FloatingText,
    [LevelEntity.CHECKPOINT]: Checkpoint,
    [LevelEntity.BULLET_WALL]: BulletWall,
    [LevelEntity.MELEE_ENEMY]: MeleeEnemy,
    [LevelEntity.LEVEL_EXIT]: LevelExit,
    [LevelEntity.SPIKES]: SpikeWall
}

/**
 * Loads a new level.
 */
function loadLevel(levelIndex: number) {
    console.log("Loading level...");
    
    Globals.currentLevelIndex = levelIndex;
    const levelData = LEVELS[levelIndex];

    // purge remaining entities (if any)
    Kepler.deleteAll();
    // reset camera
    Kepler.setViewportBounds(levelData.viewportBounds);

    // addEntity() returns a reference for faster access
    Globals.player = Kepler.addEntity(new Player(...levelData.playerSpawn));

    // add all entities
    for (const entityData of levelData.entities) {
        Kepler.addEntity(new ENTITY_CTORS[entityData[0]](...entityData.slice(1)));
    }

    Globals.playerSpawn = levelData.playerSpawn;
}

/**
 * Transitions to a new game state and runs any state-specific code. Use this to change the current
 * game state - do not set `Globals.gameState` directly!
 */
changeGameState = (newState: GameState) => {
    switch (newState) {
        case GameState.GAMEPLAY:
            UIManager.setCurrentPage("none");
            break;
        case GameState.MAIN_MENU:
            UIManager.setCurrentPage("main menu");
            break;
        case GameState.LEVEL_SELECT:
            UIManager.setCurrentPage("level select");
            break;
        case GameState.LEVEL_COMPLETE:
            if (Globals.currentLevelIndex === LEVELS.length - 1) {
                // alternate ui page that doesn't have a "next level" button
                UIManager.setCurrentPage("final level complete");
            }
            else {
                UIManager.setCurrentPage("level complete")
            }
            break;
    }
    Globals.gameState = newState;
};

interface IGameStateHandler {
    update(): void;
    render(rt?: p5 | p5.Graphics): void;
}

// update and render functions for every game state
const GAME_STATE_HANDLERS: { [key in GameState]: IGameStateHandler } = {
    [GameState.NPC_LOGO]: {
        update() {}, // does nothing
        render() {
            // drawNpcLogo() returns true when the animation is finished
            if (drawNpcLogo(Globals.p5)) {
                changeGameState(GameState.MAIN_MENU);
            }
        },
    },
    [GameState.MAIN_MENU]: {
        update() {
            UIManager.update();
        },  
        render(rt) {
            rt.background("#ffffff");

            rt.push();
            rt.fill("#000000");
            rt.textFont("Tomorrow", 100);
            rt.textAlign("center", "center");
            rt.textStyle("italic");
            rt.text("BladeRun", 300, 100);
            rt.pop();

            UIManager.render();
        },
    },
    [GameState.LEVEL_SELECT]: {
        update() {
            UIManager.update();

            if (Input.isActive("menu back")) {
                changeGameState(GameState.MAIN_MENU);
            }
        },
        render(rt) {
            rt.background("#ffffff");

            rt.push();
            rt.fill("#000000");
            rt.textFont("Tomorrow", 60);
            rt.textAlign("center", "center");
            rt.text("Level Select", 300, 65);
            rt.pop();

            rt.textFont("Tomorrow", 50);
            rt.textAlign("center", "center");

            UIManager.render();
        },
    },
    [GameState.GAMEPLAY]: {
        // update() is only called when the dev console is not open
        update() {
            Kepler.update();
        },
        // render() is called at all times
        render() {
            Kepler.render();
        },
    },
    [GameState.LEVEL_COMPLETE]: {
        update() {
            UIManager.update();
        },
        render(rt) {
            rt.background("#ffffff");

            rt.push();
            rt.fill("#000000");
            rt.textFont("Tomorrow", 70);
            rt.textAlign("center", "center");
            rt.text("Level Complete", 300, 100);
            rt.pop();

            UIManager.render();
        },
    },
};

/* ----- end of file ----- */