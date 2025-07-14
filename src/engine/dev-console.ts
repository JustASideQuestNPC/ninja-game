/* ----- src/engine/dev-console.ts ----- */

/** Allowed argument types for console commands. */
type DevConsoleFunctionArgUnion = "int" | "float" | "string" | "bool";
interface IDevConsoleFunction {
    signatures: DevConsoleFunctionArgUnion[][];
    callback: (...args: (number|string|boolean)[]) => void;
    description: string;
}

interface IRegisterFunctionArgs {
    name: string;
    signatures: DevConsoleFunctionArgUnion[][];
    callback: (...args: (number|string|boolean)[]) => void;
    description?: string;
}

const CONSOLE_COLORS = {
    LOG:     "#c0c0c0",
    WARN:    "#ffb52b",
    ERROR:   "#ff4747",
    COMMAND: "#36f2ff"
};

interface IDevConsole {
    readonly open: boolean;
    init(p5: p5, canvas: p5.Renderer): void;
    update(): void;
    registerFunction({ name, signatures, callback, description }: IRegisterFunctionArgs): void;
}

const DevConsole: IDevConsole = (()=>{
    let textSize: number = 16;
    let numLines: number = 12;

    let p5: p5;
    let keyQueue: string[] = [];
    let lineLength: number = -1;
    let lineHeight: number = -1;
    let charWidth: number = -1;
    let backgroundHeight: number;

    // using a char array makes a bunch of things easier
    let currentLine: string[] = [];
    let outputHistory: { color: string, message: string }[] = [];
    let commandHistory: string[][] = [];
    let commandHistoryIndex: number = 0;
    let cursorPos: number = 0;
    let showCursor: boolean = true;
    let cursorFlashTimer: number = 0.5;
    let functionNames: string[] = [];
    let registeredFunctions: { [key: string]: IDevConsoleFunction } = {};

    let open_: boolean = false;

    /**
     * Prints a message in the log color (defaults to white). Also prints to the browser console.
     */
    function log(message: any) {
        printOutput(CONSOLE_COLORS.LOG, message.toString());
    }

    /**
     * Prints a message in the warning color (defaults to yellow). Also prints to the browser
     * console.
     */
    function warn(message: any) {
        printOutput(CONSOLE_COLORS.WARN, message.toString());
    }

    /**
     * Prints a message in the error color (defaults to red). Also prints to the browser console.
     */
    function error(message: any) {
        printOutput(CONSOLE_COLORS.ERROR, message.toString());
    }

    /**
     * Attempts to parse arguments and run a command.
     */
    function runCommand() {
        const command = currentLine.join("");
        commandHistory.push(currentLine.slice());
        commandHistoryIndex = commandHistory.length;
        currentLine = [];
        cursorPos = 0;
        printOutput(CONSOLE_COLORS.COMMAND, command);

        // you will never convince me that regex isn't a set of arcane runes we pulled out of a
        // cursed temple in the 1950s
        let rawArgs = command.match(/"[^"]+"|[^\s]+/g)
                             .map((e: string) => e.replace(/"(.+)"/, "$1"));

        // the first argument is the name of the function
        let fn: IDevConsoleFunction;
        if (!functionNames.includes(rawArgs[0])) {
            printOutput(CONSOLE_COLORS.ERROR,
                `Invalid command "${rawArgs[0]}".`
            );
            return;
        }
        
        fn = registeredFunctions[rawArgs[0]];
        // try to find a matching call signature
        for (const s of fn.signatures) {
            const args: (number|string|boolean)[] = [];
            let i = 0;
            for (; i < s.length && i < rawArgs.length - 1; ++i) {
                let raw = rawArgs[i + 1];
                let parsed: number|string|boolean;
                if (s[i] === "int") {
                    parsed = Number.parseInt(raw);
                    if (isNaN(parsed)) { break; }
                    // console.log("int");
                }
                else if (s[i] === "float") {
                    parsed = Number.parseFloat(raw);
                    if (isNaN(parsed)) { break; }
                    // console.log("float");
                }
                else if (s[i] === "bool") {
                    if (raw === "true" || raw === "t" || raw === "1") {
                        parsed = true;
                    }
                    else if (raw === "false" || raw === "f" || raw === "0") {
                        parsed = false;
                    }
                    else {
                        break;
                    }
                    // console.log("boolean");
                }
                else /* s[i] === "string" */ {
                    parsed = raw;
                    // console.log("string");
                }
                args.push(parsed);
            }

            if (i === s.length && i === rawArgs.length - 1) {
                try {
                    fn.callback(...args);
                }
                catch (e) {
                    // modify the stack so we can add the name of the command
                    const stack: string[] = e.stack.split("\n");
                    for (let i = 0; i < stack.length; ++i) {
                        if (stack[i].slice(0, stack[i].indexOf("@")) === "callback") {
                            const cmd = commandHistory[commandHistory.length - 1];
                            stack.splice(i + 1, 0, `devConsole: "${cmd.join("")}"`);
                            break;
                        }
                    }

                    // update the actual stack and send the error the rest of the way up
                    e.stack = stack.join("\n");
                    throw e;
                }
                return;
            }
        }

        printOutput(CONSOLE_COLORS.ERROR,
            `Invalid call signature for command "${rawArgs[0]}" (type "help ${rawArgs[0]}" to ` +
            "see all valid signatures)."
        );
    }

    /**
     * Handles line wrapping and puts text on the screen.
     */
    function printOutput(color: string, message: string) {
        const rawLines = message.split("\n");
        const lines: string[] = [];
        for (const line of rawLines) {
            for (let i = 0; i < line.length; i += lineLength) {
                lines.push(line.substring(i, i + lineLength).trimStart());
            }
        }

        for (const line of lines) {
            outputHistory.push({ color: color, message: line });
        }

        // remove offscreen lines
        while (outputHistory.length > numLines) {
            outputHistory.shift();
        }
    }

    function init(sketch: p5, canvas: p5.Renderer) {
        p5 = sketch;

        // figure out width and heights
        p5.push();
        p5.textFont("Roboto Mono", textSize);

        charWidth = p5.textWidth("#");
        lineHeight = p5.textLeading();
        lineLength = Math.floor((p5.width - 12) / charWidth);
        backgroundHeight = lineHeight * (numLines + 1) + 13;

        p5.pop();

        // having empty lines here makes displaying things easier
        for (let i = 0; i < numLines; ++i) {
            outputHistory.push({ color: "#00000000", message: "" });
        }

        // set up keyboard input
        const controlKeys = [
            "Enter", "Backspace", "Delete", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"
        ];
        const c = document.getElementById(canvas.id());
        c.addEventListener("keydown", (e) => {
            if (e.key === "`") {
                open_ = !open_;
                keyQueue = [];
                cursorFlashTimer = 0.5;
                showCursor = true;
            }
            else if (open) {
                if (e.key.length === 1 || controlKeys.includes(e.key)) {
                    keyQueue.push(e.key);
                }
            }
        });

        // hijack console functions to also print to this console
        (() => {
            const consoleLog = console.log;
            console.log = (message: any) => {
                log(message);
                consoleLog(message);
            };
            const consoleWarn = console.warn;
            console.warn = (message: any) => {
                warn(message);
                consoleWarn(message);
            };
            const consoleError = console.error;
            console.error = (message: any) => {
                error(message);
                consoleError(message);
            };
        })();

        // add default commands
        registerFunction({
            name: "help",
            description: "Prints help messages...I feel like this should be self-explanatory.",
            signatures: [
                [],
                ["string"]
            ],
            callback: (functionName?: string) => {
                if (functionName == null) {
                    let helpMessage = "Available commands:\n";
                    for (const name of functionNames) {
                        helpMessage += `${name}\n`;
                    }
                    helpMessage +=
                        'Command names are case-sensitive. Type "help <name>" for more ' +
                        "information on a command.";
                    console.log(helpMessage);
                }
                else {
                    if (functionNames.includes(functionName)) {
                        console.log(registeredFunctions[functionName].description);
                    }
                    else {
                        console.error(`"${functionName}" is not a command.`);
                    }
                }
            },
        });
        registerFunction({
            name: "clear",
            description: "Clears all console output.",
            signatures: [[]],
            callback: () => {
                outputHistory = [];
                for (let i = 0; i < numLines; ++i) {
                    outputHistory.push({ color: "#00000000", message: "" });
                }
            }
        });
    }

    /** Updates the console and renders it if it is active. */
    function update() {
        if (!open_) { return; }

        // native delta time is in milliseconds
        cursorFlashTimer -= p5.deltaTime / 1000;
        if (cursorFlashTimer <= 0) {
            showCursor = !showCursor;
            cursorFlashTimer = 0.5;
        }

        // update text
        while (keyQueue.length > 0) {
            const char = keyQueue.shift();
            switch (char) {
                case "Enter":
                    runCommand();
                    break;
                case "Backspace":
                    if (currentLine.length > 0 && cursorPos > 0) {
                        currentLine.splice(cursorPos - 1, 1);
                        --cursorPos;
                    }
                    commandHistoryIndex = commandHistory.length;
                    break;
                case "Delete":
                    if (currentLine.length > 0 && cursorPos < currentLine.length) {
                        currentLine.splice(cursorPos, 1);
                    }
                    commandHistoryIndex = commandHistory.length;
                    break;
                case "ArrowUp":
                    if (commandHistory.length === 0) { break; }
                    --commandHistoryIndex;
                    if (commandHistoryIndex < 0) {
                        commandHistoryIndex = commandHistory.length - 1;
                    }
                    currentLine = commandHistory[commandHistoryIndex].slice();
                    cursorPos = currentLine.length;
                    break;
                case "ArrowDown":
                    if (commandHistory.length === 0) { break; }
                    ++commandHistoryIndex;
                    if (commandHistoryIndex === commandHistory.length) {
                        commandHistoryIndex = 0;
                    }
                    currentLine = commandHistory[commandHistoryIndex].slice();
                    cursorPos = currentLine.length;
                    break;
                case "ArrowLeft":
                    if (cursorPos > 0) { --cursorPos; }
                    break;
                case "ArrowRight":
                    if (cursorPos < currentLine.length) { ++cursorPos; }
                    break;
                default:
                    commandHistoryIndex = commandHistory.length;
                    currentLine.splice(cursorPos, 0, char);
                    ++cursorPos;
                    break;
            }
            showCursor = true;
            cursorFlashTimer = 0.5;
        }

        p5.noStroke();
        p5.fill("#000000c0");
        p5.rect(0, 0, p5.width, backgroundHeight);

        p5.textFont("Roboto Mono", textSize);
        p5.textAlign("left", "top");
        for (let i = 0; i < outputHistory.length; ++i) {
            p5.fill(outputHistory[i].color);
            p5.text(outputHistory[i].message, 6, lineHeight * i + 5);
        }

        p5.stroke("#ffffff");
        p5.strokeWeight(2);
        p5.line(
            0, lineHeight * numLines + 7,
            p5.width, lineHeight * numLines + 7
        );

        const currentLinePos = lineHeight * numLines + 12;
        p5.noStroke();
        p5.fill("#ffffff");
        p5.text(currentLine.join(""), 6, currentLinePos);
        
        if (showCursor) {
            const cursorX = (charWidth + 0.04) * cursorPos + 8;
            p5.stroke("#ffffff");
            p5.strokeWeight(2);
            p5.line(
                cursorX, currentLinePos - 1, cursorX, currentLinePos + lineHeight - 2
            );
        }
    }

    /**
     * Adds a function to the console.
     */
    function registerFunction({ name, signatures, callback,
                                description="" }: IRegisterFunctionArgs) {
        // run error checking
        if (functionNames.includes(name)) {
            throw new InvalidArgumentError(
                `The function "${name}" already exists!`
            );
        }
        if (signatures.length === 0) {
            throw new InvalidArgumentError(
                `The function "${name}" has no call signatures!`
            );
        }

        // add signatures to the help message
        let fulldescription = description;
        if (fulldescription !== "") { fulldescription += "\n"; }
        fulldescription += "\n-- CALL SIGNATURES --";
        for (const s of signatures) {
            fulldescription += `\n${name} ` + s.map((arg) => `<${arg}>`).join(" ");
        }

        functionNames.push(name);
        registeredFunctions[name] = {
            signatures: signatures,
            callback: callback,
            description: fulldescription
        };
    }

    return {
        get open() { return open_; },
        init: init,
        update: update,
        registerFunction: registerFunction
    }
})();

/* ----- end of file ----- */