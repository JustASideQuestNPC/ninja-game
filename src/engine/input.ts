/* ----- src/engine/input.ts ----- */

/**
 * A button on the gamepad. Uses Xbox button names.
 */
const enum GpButton {
    /** X on Playstation controllers. */
    A,
    /** Circle on Playstation controllers. */
    B,
    /** Square on Playstation controllers. */
    X,
    /** Triangle on Playstation controllers. */
    Y,
    /** L1 on Playstation controllers. */
    LEFT_BUMPER,
    /** R1 on Playstation controllers. */
    RIGHT_BUMPER,
    /**
     * L2 on Playstation controllers. Active whenever the trigger is touched at all; use
     * `LEFT_TRIGGER_FULL_PULL` to check if it is held all the way down.
     */
    LEFT_TRIGGER,
    /**
     * R2 on Playstation controllers. Active whenever the trigger is touched at all; use
     * `RIGHT_TRIGGER_FULL_PULL` to check if it is held all the way down.
     */
    RIGHT_TRIGGER,
    SHARE,
    OPTIONS,
    /** L3 on Playstation controllers. */
    LEFT_STICK_CLICK,
    /** R3 on Playstation controllers */
    RIGHT_STICK_CLICK,
    DPAD_UP,
    DPAD_DOWN,
    DPAD_LEFT,
    DPAD_RIGHT,
    /** Xbox/Playstation logo button */
    HOME,
    /**
     * L2 on Playstation controllers. Only active when the trigger is all the way down; use
     * `LEFT_TRIGGER` to check if it is touched at all.
     */
    LEFT_TRIGGER_FULL_PULL,
    /**
     * R2 on Playstation controllers. Only active when the trigger is all the way down; use
     * `LEFT_TRIGGER` to check if it is touched at all.
     */
    RIGHT_TRIGGER_FULL_PULL
}

/**
 * An analog axis on the gamepad.
 */
const enum GpAxis {
    LEFT_STICK_X,
    LEFT_STICK_Y,
    RIGHT_STICK_X,
    RIGHT_STICK_Y,
    LEFT_TRIGGER,
    RIGHT_TRIGGER,
}

/**
 * A thumbstick on the gamepad.
 */
const enum GpThumbstick { LEFT, RIGHT }

/**
 * An action-based system for managing inputs.
 */
interface IINputManager {
    /**
     * How long press-type inputs can be buffered for, in seconds.
     */
    bufferDuration: number;
    /**
     * The gamepad to use for polling input.
     */
    readonly gamepad: GamepadManager | null;
    /**
     * Where the last input came from.
     */
    readonly lastInputSource: "keyboard" | "gamepad";
    /**
     * Stops updating actions and the gamepad if true. Mainly used by the dev console.
     */
    paused: boolean;
    /**
     * Initializes everything. This *must* be called before any other Input methods are used!
     */
    init(canvas: p5.Renderer, gamepad?: GamepadManager): void;
    /**
     * Adds an action to the manager.
     * @param name The name of the action; used to access it using `isActive()`.
     * @param keys All keyboard keys or mouse buttons that can activate the action. Actions must
     *      have at least one keyboard key, mouse button, or gamepad button assigned to them.
     * @param buttons All gamepad buttons that can activate the action. Actions must have at
     *      least one keyboard key, mouse button, or gamepad button assigned to them.
     * @param type The type of the action, either `"press"` or `"hold"`. A `"press"` action is
     *      active once when its key is initially pressed, and then deactivates until the key is
     *      released and re-pressed. A `"hold"` action is active whenever its keys are pressed.
     *      The default action type is `"hold"`,
     */
    addAction({ name, keys, buttons, type }: { name: string, keys?: string[],
        buttons?: (string|GpButton)[], type?: "press"|"hold" }): void;
    /**
     * Returns whether the named action is active. Throws an `InvalidArgumentError` if the
     * action does not exist.
     */
    isActive(name: string): boolean;
}

class GamepadManager {
    /** The JS Gamepad API object. */
    private gamepad: Gamepad = null;

    /**
     * Which gamepad to poll input from; useful for multiplayer games. If this is -1, any
     * connected gamepad will be used.
     */
    private padIndex_: number;

    /**
     * Whether triggers should be read from the gamepad's axes or its buttons.
     */
    private triggersAreAxes: boolean;

    /**
     * Inner deadzone for analog sticks - if the raw value is closer to 0 than this, it will be
     * snapped to 0.
     */
    innerDeadzone: number = 0.1;

    /**
     * Outer deadzone for analog sticks - if the raw value is closer to -1 or 1 than this, it
     * will be snapped to -1 or 1 respectively.
     */
    outerDeadzone: number = 0.05;

    private static applyDeadzone(value: number, inner: number, outer: number): number {
        if (Math.abs(value) < inner) { return 0; }
        
        // storing the outer deadzone as distance from the edge is more intuitive
        outer = 1 - outer;
        if (Math.abs(value) > outer) { return (value < 0 ? -1 : 1); }
        else {
            const mapped = (1 / (outer - inner)) * (Math.abs(value) - inner);
            return value < 0 ? -mapped : mapped;
        }
    }

    /**
     * Manages input for a gamepad.
     * @param [padIndex] Which gamepad to poll input from. Useful for multiplayer games. If this
     * is -1, any connected gamepad will be used.
     */
    constructor(padIndex: number=-1) {
        this.padIndex_ = padIndex;

        // add the correct method to poll input from the gamepad
        if (padIndex !== -1) {
            const pollInput = () => {
                this.gamepad = navigator.getGamepads()[this.padIndex_];
                // some browsers store the triggers using the axes, but other ones store them
                // using buttons array and this is the only good way i've found to get around
                // that
                if (this.gamepad !== null && this.triggersAreAxes === undefined) {
                    this.triggersAreAxes = this.gamepad.axes[4] != null;
                    console.log(
                        `[GamepadManager] Triggers are ` +
                        `${this.triggersAreAxes ? "axes" : "buttons"}`
                    );
                }
                // repeat every frame
                window.requestAnimationFrame(pollInput);
            };
            window.requestAnimationFrame(pollInput);
        }
        else {
            const pollInput = () => {
                this.gamepad = navigator.getGamepads().find((g) => g !== null) ?? null;
                if (this.gamepad !== null && this.triggersAreAxes === undefined) {
                    this.triggersAreAxes = this.gamepad.axes[4] != null;
                    console.log(
                        `[GamepadManager] Triggers are ` +
                        `${this.triggersAreAxes ? "axes" : "buttons"}`
                    );
                }
                window.requestAnimationFrame(pollInput);
            };
            window.requestAnimationFrame(pollInput);
        }
    }

    /**
     * Returns whether a button on the gamepad is pressed. If the gamepad is disconnected, this
     * method always returns false.
     */
    buttonPressed(button: GpButton): boolean {
        if (this.gamepad === null) { return false; }

        // full pull triggers are special cases - the entry in the button array is true whenever
        // the triggers have been touched at all, so we need to check their axes instead
        if (button === GpButton.LEFT_TRIGGER_FULL_PULL) {
            return (this.triggersAreAxes ? this.gamepad.axes[4] === 1 :
                                        this.gamepad.buttons[6].value === 1);
        }
        else if (button === GpButton.RIGHT_TRIGGER_FULL_PULL) {
            return (this.triggersAreAxes ? this.gamepad.axes[5] === 1 :
                                        this.gamepad.buttons[7].value === 1);
        }
        // otherwise, the enum is laid out so that each button maps directly to its location in 
        // the button array
        else {
            return this.gamepad.buttons[button].pressed;
        }
    }

    /**
     * Returns the value of an analog axis. Trigger values are between 0 and 1, where 1 is a
     * full pull. Thumbstick axes are between -1 and 1, where -1 is all the way left/up and 1 is
     * all the way right/down. If the gamepad is disconnected, this method always returns 0.
     * @param [rawValue=false] If true, deadzone is not applied to thumbstick values. Has no
     *      effect on triggers (because they never have deadzone). Defaults to false.
     */
    axisValue(axis: GpAxis, rawValue: boolean=false): number {
        if (this.gamepad === null) { return 0; }

        if (axis === GpAxis.LEFT_TRIGGER) {
            if (this.triggersAreAxes) {
                // TODO: fix bug where trigger values are initially 0.5 until updated
                // map value to between 0 and 1
                return (this.gamepad.axes[4] + 1) / 2;
            }
            else {
                // the button value is already between 0 and 1
                return this.gamepad.buttons[6].value;
            }
        }
        else if (axis === GpAxis.RIGHT_TRIGGER) {
            if (this.triggersAreAxes) {
                // map value to between 0 and 1
                return (this.gamepad.axes[5] + 1) / 2;
            }
            else {
                // the button value is already between 0 and 1
                return this.gamepad.buttons[7].value;
            }
        }
        else {
            // stick axes map directly to their location in the axes array (triggers also do,
            // but we handle them differently so it doesn't matter)
            const value = this.gamepad.axes[axis];
            
            return rawValue ? value : GamepadManager.applyDeadzone(
                value, this.innerDeadzone, this.outerDeadzone
            );
        }
    }

    /**
     * Returns the position of a thumbstick. If the gamepad is disconnected, this method always
     * returns a zero vector.
     * @param [rawValue=false] If true, deadzone is not applied to the position.
     */
    stickPos(stick: GpThumbstick, rawValue: boolean=false): Vector2D {
        if (stick === GpThumbstick.LEFT) {
            return new Vector2D(
                this.axisValue(GpAxis.LEFT_STICK_X, rawValue),
                this.axisValue(GpAxis.LEFT_STICK_Y, rawValue)
            );
        }
        else {
            return new Vector2D(
                this.axisValue(GpAxis.RIGHT_STICK_X, rawValue),
                this.axisValue(GpAxis.RIGHT_STICK_Y, rawValue)
            );
        }
    }

    /**
     * Returns a normalized (length 1) vector with the position of a thumbstick. If the gamepad
     * is disconnected, this method always returns a zero vector.
     */
    stickVector(stick: GpThumbstick): Vector2D {
        return this.stickPos(stick).normalize();
    }

    /**
     * Which gamepad to poll input from. Useful for multiplayer games. If this is -1, any
     * connected gamepad will be used.
     */
    get padIndex() { return this.padIndex_; }

    /**
     * Whether the manager is connected to a gamepad.
     */
    get connected() { return this.gamepad !== null; }
}

const Input: IINputManager = (()=>{
    /**
     * A single input action.
     */
    interface IInputAction {
        active: boolean,
        keys: string[],
        buttons: GpButton[],
        update: (pressed: boolean, dt: number)=>void,
        wasActive: boolean,
        bufferDuration: number
    }

    // lookup table for gamepad button names
    const GAMEPAD_BUTTON_LOOKUP: {[key: string]: GpButton} = {
        "a": GpButton.A,
        "b": GpButton.B,
        "x": GpButton.X,
        "y": GpButton.Y,
        "left bumper": GpButton.LEFT_BUMPER,
        "right bumper": GpButton.RIGHT_BUMPER,
        "left trigger": GpButton.LEFT_TRIGGER,
        "right trigger": GpButton.RIGHT_TRIGGER,
        "share": GpButton.SHARE,
        "options": GpButton.OPTIONS,
        "left stick click": GpButton.LEFT_STICK_CLICK,
        "right stick click": GpButton.RIGHT_STICK_CLICK,
        "dpad up": GpButton.DPAD_UP,
        "dpad down": GpButton.DPAD_DOWN,
        "dpad left": GpButton.DPAD_LEFT,
        "dpad right": GpButton.DPAD_RIGHT,
        "home": GpButton.HOME,
        "left trigger full pull": GpButton.LEFT_TRIGGER_FULL_PULL,
        "right trigger full pull": GpButton.RIGHT_TRIGGER_FULL_PULL
    };

    // lookup table to map some key names to more intuitive ones
    const ALTERNATE_KEY_NAMES: {[key: string]: string} = {
        "Space": " ",
        "Backquote": "`",
        "Minus": "-",
        "Equal": "=",
        "BracketLeft": "[",
        "BracketRight": "]",
        "Backslash": "\\",
        "Semicolon": ";",
        "Quote": "'",
        "Comma": ",",
        "Period": ".",
        "Slash": "/",
        "ShiftLeft": "left shift",
        "ShiftRight": "right shift",
        "ControlLeft": "left control",
        "ControlRight": "right control",
        "AltLeft": "left alt",
        "AltRight": "right alt",
        "CapsLock": "caps lock",
        "NumLock": "num lock",
        "ScrollLock": "scroll lock",
        "PageUp": "page up",
        "PageDown": "page down",
        "ArrowUp": "up",
        "ArrowDown": "down",
        "ArrowLeft": "left",
        "ArrowRight": "right",
        "Numpad0": "numpad 0",
        "Numpad1": "numpad 1",
        "Numpad2": "numpad 2",
        "Numpad3": "numpad 3",
        "Numpad4": "numpad 4",
        "Numpad5": "numpad 5",
        "Numpad6": "numpad 6",
        "Numpad7": "numpad 7",
        "Numpad8": "numpad 8",
        "Numpad9": "numpad 9",
        "NumpadAdd": "numpad +",
        "NumpadSubtract": "numpad -",
        "NumpadMultiply": "numpad *",
        "NumpadDivide": "numpad /",
        "NumpadEnter": "numpad enter",
        "NumpadDecimal": "numpad ."
    };

    /**
     * All active actions.
     */
    const actions: {[key: string]: IInputAction} = {};
    /**
     * The state of every keyboard key and mouse button
     */
    const keyStates: {[key: string]: boolean} = {};

    /** Where the last input came from. */
    let lastInputSource: "gamepad"|"keyboard" = "keyboard";

    /**
     * Timestamp of the previous update; used for updating buffers.
     */
    let prevTimestamp = 0;

    /**
     * The gamepad to use for polling input.
     */
    let gamepad_: GamepadManager | null = null;

    /**
     * Disables updates when true.
     */
    let paused_: boolean = false;

    function findLastInputSource(): "gamepad"|"keyboard" {
        if (gamepad_ !== null && gamepad_.connected) {
            // gamepad input overrides keyboard input
            for (let i = 0; i < 6; ++i) {
                if (gamepad_.axisValue(i) !== 0) {
                    return "gamepad";
                }
            }
            for (let i = 0; i < 17; ++i) {
                if (gamepad_.buttonPressed(i)) {
                    return "gamepad";
                }
            }

            // check for keyboard or mouse input
            if (Object.values(keyStates).includes(true)) { return "keyboard"; }

            // preserve the last input source if there haven't been any new inputs
            return lastInputSource;
        }
        // always use the keyboard if there's no gamepad
        return "keyboard";
    }

    return {
        bufferDuration: 0.03,
        get lastInputSource() { return lastInputSource; },
        get gamepad() { return gamepad_; },
        get paused() { return paused_; },
        set paused(value: boolean) { paused_ = value; },
        init(canvas: p5.Renderer, gamepad: GamepadManager=null) {
            const canvas_ = document.getElementById(canvas.id())

            // attach input listeners to the canvas - a bonus of doing it this way is that we don't
            // overwrite any listeners we created somewhere else
            canvas_.addEventListener("keydown", (event) => {
                // special keys have entries in the key table
                if (ALTERNATE_KEY_NAMES[event.code] !== undefined) {
                    keyStates[ALTERNATE_KEY_NAMES[event.code]] = true;
                }
                // the codes for letter keys start with "Key"
                else if (event.code.startsWith("Key")) {
                    keyStates[event.code.slice(3).toLowerCase()] = true;
                }
                // the codes for number keys start with "Digit"
                else if (event.code.startsWith("Digit")) {
                    keyStates[event.code.slice(5).toLowerCase()] = true;
                }
                // the original code is always still used
                keyStates[event.code.toLowerCase()] = true;

                // prevents any browser-specific things from happening
                event.preventDefault();
            });
            canvas_.addEventListener("keyup", (event) => {
                // special keys have entries in the key table
                if (ALTERNATE_KEY_NAMES[event.code] !== undefined) {
                    keyStates[ALTERNATE_KEY_NAMES[event.code]] = false;
                }
                // the codes for letter keys start with "Key"
                else if (event.code.startsWith("Key")) {
                    keyStates[event.code.slice(3).toLowerCase()] = false;
                }
                // the codes for number keys start with "Digit"
                else if (event.code.startsWith("Digit")) {
                    keyStates[event.code.slice(5).toLowerCase()] = false;
                }
                // the original code is always still used
                keyStates[event.code.toLowerCase()] = false;

                event.preventDefault();
            });
            canvas_.addEventListener("mousedown", (event) => {
                if (event.button === 0) {
                    keyStates["left click"] = true;
                    keyStates["left mouse"] = true;
                }
                else if (event.button === 1) {
                    keyStates["middle click"] = true;
                    keyStates["middle mouse"] = true;
                }
                else if (event.button === 2) {
                    keyStates["right click"] = true;
                    keyStates["right mouse"] = true;
                }
            });
            canvas_.addEventListener("mouseup", (event) => {
                if (event.button === 0) {
                    keyStates["left click"] = false;
                    keyStates["left mouse"] = false;
                }
                else if (event.button === 1) {
                    keyStates["middle click"] = false;
                    keyStates["middle mouse"] = false;
                }
                else if (event.button === 2) {
                    keyStates["right click"] = false;
                    keyStates["right mouse"] = false;
                }
            });

            gamepad_ = gamepad;

            // start the counter
            prevTimestamp = window.performance.now();
            // setup a callback to update everything
            const updateCallback = () => {
                // delta time is always updated
                const currentTimestamp = window.performance.now();
                const dt = currentTimestamp - prevTimestamp;
                prevTimestamp = currentTimestamp;

                if (!paused_) {
                    lastInputSource = findLastInputSource();

                    // update all actions
                    for (const action of Object.values(actions)) {
                        // figure out whether the action is pressed
                        let actionPressed = action.keys.some((k) => keyStates[k]);
                        // check gamepad buttons if the gamepad is connected
                        if (!actionPressed && gamepad_ !== null && gamepad_.connected) {
                            actionPressed = action.buttons.some((b) => gamepad_.buttonPressed(b));
                        }

                        action.update(actionPressed, dt);
                    }
                }

                // run every frame
                window.requestAnimationFrame(updateCallback);
            };
            window.requestAnimationFrame(updateCallback);
        },
        addAction({ name, keys=[], buttons=[], type="hold" }: { name: string, keys?: string[],
            buttons?: (string|GpButton)[], type?: "press"|"hold" }) {
            // make sure the action has something assigned to it
            if (keys.length === 0 && buttons.length === 0) {
                throw new InvalidArgumentError(
                    `The action ${name} has no keys or buttons assigned to it.`
                );
            }

            // keys have to be handled manually because of shift, alt, and control
            const actionKeys: string[] = [];
            for (let k of keys) {
                k = k.toLowerCase();
                if (k === "shift") {
                    actionKeys.push("left shift", "right shift");
                }
                else if (k === "alt") {
                    actionKeys.push("left alt", "right alt");
                }
                else if (k === "control") {
                    actionKeys.push("left control", "right control");
                }
                else {
                    actionKeys.push(k);
                }
            }

            const action: IInputAction = {
                active: false,
                keys: actionKeys,
                // convert strings to gamepad buttons
                buttons: buttons.map((b) => typeof b === "string" ? GAMEPAD_BUTTON_LOOKUP[b] : b),
                // we'll set this up a bit later
                update: null,
                wasActive: false,
                bufferDuration: 0
            };

            // set update method based on action type
            if (type === "hold") {
                action.update = (pressed: boolean, dt: number) => {
                    action.active = pressed;
                };
            }
            else {
                action.update = (pressed: boolean, dt: number) => {
                    if (pressed) {
                        if (action.bufferDuration > 0) {
                            action.bufferDuration -= dt;
                            action.active = true;
                        }
                        else if (action.wasActive) {
                            action.active = false;
                        }
                        else {
                            action.active = true;
                            action.wasActive = true;
                            action.bufferDuration = Input.bufferDuration;
                        }
                    }
                    else {
                        action.wasActive = false;
                        action.active = false;
                    }
                };
            }

            actions[name] = action;
        },
        /**
         * Returns whether the named action is active. Throws an `InvalidArgumentError` if the
         * action does not exist.
         */
        isActive(name: string): boolean {
            if (actions.hasOwnProperty(name)) {
                const active = actions[name].active;
                // clear the buffers for press inputs to prevent them from activating multiple times
                actions[name].bufferDuration = 0;
                return active;
            }
            throw new InvalidArgumentError(`The action "${name}" does not exist.`);
        }
    }
})();

/* ----- end of file ----- */