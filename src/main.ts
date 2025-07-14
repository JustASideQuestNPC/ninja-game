/* ----- src/main.ts ----- */

// creates the actual sketch instance
const sketch = (p5: p5) => {
    let lastFrameRate = 0;
    let frameRateUpdateTimer = 1;
    let elapsedFrames = 0;

    Globals.random = new SplitMix32();

    p5.setup = () => {
        Globals.p5 = p5;
        // environment setup
        const canvas = p5.createCanvas(600, 600);

        // get a second reference to the canvas i just created, which i need because p5js is a
        // PERFECT library with NO FLAWS WHATSOEVER
        const c = document.getElementById(canvas.id());
        // helps make mouse and keyboard functions only trigger when they should
        c.tabIndex = -1;
        // disable the right-click menu
        c.addEventListener("contextmenu", (e) => e.preventDefault());

        // initialize everything
        Input.init(canvas, new GamepadManager());
        Kepler.init(p5);
        Kepler.cameraEnabled = true;
        DevConsole.init(p5, canvas);

        // add commands to dev console
        for (const command of CONSOLE_COMMANDS) {
            DevConsole.registerFunction(command);
        }

        // setup inputs
        for (const [name, action] of Object.entries(KEYBINDS)) {
            if (name === "up" || name === "down" || name === "left" || name === "right") {
                // the menu needs press actions for directions
                Input.addAction({
                    name: `menu ${name}`,
                    keys: action.keys,
                    buttons: action.buttons,
                    type: "press"
                })
            }
            if (name === "wallrun") {
                // having a press action to initiate a wallrun simplifies some player movement code
                Input.addAction({
                    name: "start wallrun",
                    keys: action.keys,
                    buttons: action.buttons,
                    type: "press"
                });
            }
            Input.addAction({
                name: name,
                keys: action.keys,
                buttons: action.buttons,
                type: CONSTANTS.PRESS_ACTIONS.includes(name) ? "press" : "hold"
            });
        }

        // setup ui
        UIManager.init(p5);
        // main menu
        UIManager.addPage({
            name: "main menu",
            elements: {
                "start game": new TextButton({
                    x: 190,
                    y: 272,
                    width: 220,
                    height: 56,
                    text: "Start Game",
                    textSize: 36,
                    textFont: "Tomorrow",
                    callback() {
                        loadLevel(1); // level 0 is the debug level
                        changeGameState(GameState.GAMEPLAY);
                    },  
                }),
                "level select": new TextButton({
                    x: 185,
                    y: 362,
                    width: 230,
                    height: 56,
                    text: "Level Select",
                    textSize: 36,
                    textFont: "Tomorrow",
                    callback() {
                        changeGameState(GameState.LEVEL_SELECT);
                    },
                }),
            },
            cursorMap: {
                "start game": {
                    up: "level select",
                    down: "level select"
                },
                "level select": {
                    up: "start game",
                    down: "start game"
                }
            }
        });
        // level complete screen
        UIManager.addPage({
            name: "level complete",
            elements: {
                "next level": new TextButton({
                    x: 200,
                    y: 227,
                    width: 200,
                    height: 56,
                    text: "Next Level",
                    textSize: 36,
                    textFont: "Tomorrow",
                    callback() {
                        loadLevel(Globals.currentLevelIndex + 1);
                        changeGameState(GameState.GAMEPLAY);
                    },  
                }),
                "restart": new TextButton({
                    x: 242,
                    y: 317,
                    width: 116,
                    height: 56,
                    text: "Retry",
                    textSize: 36,
                    textFont: "Tomorrow",
                    callback() {
                        // load the current level again to reset it
                        loadLevel(Globals.currentLevelIndex);
                        changeGameState(GameState.GAMEPLAY);
                    },
                }),
                "main menu": new TextButton({
                    x: 140,
                    y: 407,
                    width: 320,
                    height: 56,
                    text: "Exit to Main Menu",
                    textSize: 36,
                    textFont: "Tomorrow",
                    callback() {
                        changeGameState(GameState.MAIN_MENU);
                    },
                }),
            },
            cursorMap: {
                "next level": {
                    up: "main menu",
                    down: "restart"
                },
                "restart": {
                    up: "next level",
                    down: "main menu"
                },
                "main menu": {
                    up: "restart",
                    down: "next level"
                },
            }
        });
        // alternate level complete screen without a next level button
        UIManager.addPage({
            name: "final level complete",
            elements: {
                "restart": new TextButton({
                    x: 242,
                    y: 272,
                    width: 116,
                    height: 56,
                    text: "Retry",
                    textSize: 36,
                    textFont: "Tomorrow",
                    callback() {
                        // load the current level again to reset it
                        loadLevel(Globals.currentLevelIndex);
                        changeGameState(GameState.GAMEPLAY);
                    },
                }),
                "main menu": new TextButton({
                    x: 140,
                    y: 362,
                    width: 320,
                    height: 56,
                    text: "Exit to Main Menu",
                    textSize: 36,
                    textFont: "Tomorrow",
                    callback() {
                        changeGameState(GameState.MAIN_MENU);
                    },
                }),
            },
            cursorMap: {
                "restart": {
                    up: "main menu",
                    down: "main menu"
                },
                "main menu": {
                    up: "restart",
                    down: "restart"
                },
            }
        });

        // generate level select buttons
        const levelSelectButtons: { [key: string]: TextButton } = {};
        const levelSelectCursorMap: {
            [key: string]: { up?: string, down?: string, left?: string, right?: string } } = {};

        // for the cursor map
        const bottomRow = Math.floor((LEVELS.length - 1) / 5);

        let levelIndex = 1;
        for (let y = 0; y < 4; ++y) {
            for (let x = 0; x < 5; ++x) {
                // use coordinates as the button name to make the cursor map easier
                const currentLevelIndex = levelIndex; // prevents some very strange bugs
                levelSelectButtons[`${x},${y}`] = new TextButton({
                    x: (x + 0.5) * 100 + 10,
                    y: (y + 1.25) * 100 + 10,
                    width: 80,
                    height: 80,
                    text: `${levelIndex}`,
                    textSize: 50,
                    textFont: "Tomorrow",
                    callback() {
                        loadLevel(currentLevelIndex);
                        changeGameState(GameState.GAMEPLAY);
                    }
                });

                // update cursor map
                const cursorMapNode: {
                    up?: string, down?: string, left?: string, right?: string } = {};

                if (x > 0) {
                    cursorMapNode.left = `${x - 1},${y}`;
                }
                if (x < 4 && levelIndex < LEVELS.length - 1) {
                    cursorMapNode.right = `${x + 1},${y}`;
                }
                if (y > 0) {
                    cursorMapNode.up = `${x},${y - 1}`;
                }
                // all buttons on the bottom row are linked to the exit button
                if (y === bottomRow) {
                    cursorMapNode.down = "exit";
                }
                else {
                    cursorMapNode.down = `${x},${y + 1}`;
                }

                levelSelectCursorMap[`${x},${y}`] = cursorMapNode;

                // stop once we run out of levels
                ++levelIndex;
                if (levelIndex >= LEVELS.length) {
                    break;
                }
            }

            // stop once we run out of levels
            if (levelIndex >= LEVELS.length) {
                break;
            }
        }

        // add exit button
        levelSelectButtons["exit"] = new TextButton({
            x: 260,
            y: 535,
            width: 80,
            height: 56,
            text: "Exit",
            textSize: 36,
            textFont: "Tomorrow",
            callback() {
                changeGameState(GameState.MAIN_MENU);
            },
        });
        levelSelectCursorMap["exit"] = {
            up: `0,${bottomRow}`
        };

        UIManager.addPage({
            name: "level select",
            elements: levelSelectButtons,
            cursorMap: levelSelectCursorMap
        });

        changeGameState(SKIP_LOGO ? GameState.MAIN_MENU : GameState.NPC_LOGO);
    };

    p5.draw = () => {
        p5.background("#ffffff");

        // the game is paused whenever the console is open
        if (!DevConsole.open) {
            GAME_STATE_HANDLERS[Globals.gameState].update();
        }

        GAME_STATE_HANDLERS[Globals.gameState].render(p5);

        DevConsole.update();

        // frame rate counter
        ++elapsedFrames;
        frameRateUpdateTimer -= p5.deltaTime / 1000;
        if (frameRateUpdateTimer <= 0) {
            lastFrameRate = elapsedFrames;
            frameRateUpdateTimer = 1;
            elapsedFrames = 0;
        }

        p5.noStroke();
        p5.fill("#000000a0");
        p5.rect(540, 0, 60, 20);
        p5.textAlign("right", "top");
        p5.fill("#00ff00");
        p5.textFont("Roboto Mono", 14);
        p5.text(`${lastFrameRate} FPS`, 595, 4);
    };
};

// error checks need to be disabled here because otherwise typescript explodes for some reason
// @ts-ignore
const instance = new p5(sketch);

/* ----- end of file ----- */