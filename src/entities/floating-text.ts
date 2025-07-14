/* ----- src/entities/floating-text.ts ----- */

/** ["text", color, displayed string] */
type ITextChunk = ["text", string, string];
/** ["keybind", text color, displayed text for keyboard, gamepad icon] */
type IKeybindChunk = ["keybind", string, string, keyof typeof GAMEPAD_ICONS];

interface ITextChunkParsed {
    type: "text";
    color: string;
    text: string;
    x: number;
    y: number;
}

interface IKeybindChunkParsed {
    type: "keybind";
    textColor: string;
    keyboardText: string;
    controllerIcon: keyof typeof GAMEPAD_ICONS;
    x: number;
    y: number;
}

/** Floating, multicolored text that can also display keyboard/controller bindings. */
class FloatingText extends KEntityBase {
    displayLayer: number = -5;

    // text is stored as a set of objects that represent either a colored block of text, or the
    // text/controller icon for a keybind
    private keyboardChunks: (ITextChunkParsed|IKeybindChunkParsed)[] = [];
    // TODO: figure out a way to do this that doesn't require parsing everything twice
    private gamepadChunks: (ITextChunkParsed|IKeybindChunkParsed)[] = [];

    constructor(centerX: number, centerY: number, chunks: (ITextChunk|IKeybindChunk)[][]) {
        super();
        this.position = new Vector2D(centerX, centerY);

        // parse chunks to figure out where everything should go
        const rt = Kepler.renderTarget;
        rt.push();
        // for some reason, textWidth() only works with the font p5 is using, rather than just
        // taking a font as a parameter
        rt.textFont("Tomorrow", 28);
        rt.textStyle("bold");

        // easier than trying to figure out which chunks to add a space to
        const spacerWidth = rt.textWidth(" "); 
        // all rows are 40 pixels tall including margins
        const topLineOffset = -((chunks.length - 1) * 40) / 2;

        // chunks are passed as an array of arrays where each sub-array is its own line of text
        for (const [y, row] of chunks.entries()) {
            // find the total width of everything - i wish there was a way to only iterate over each
            // row once, but if there is then i haven't been able to find it
            const keyboardChunkWidths: ({type: "spacer", width: number} |
                                {type: "chunk",  width: number})[] = [];
            const gamepadChunkWidths: ({type: "spacer", width: number} |
                                {type: "chunk",  width: number})[] = [];
            for (const [i, chunk] of row.entries()) {
                // chunks are arrays with different formats depending on whether the chunk is just
                // text or is a keybind (type is determined by the first array element):
                // text: ["text", <color>, <displayed string>]
                // keybind: ["keybind", <text color>, <displayed text for keyboard>, <gamepad icon>]
                if (chunk[0] === "text") {
                    // if the chunk is text, both the keyboard and gamepad widths are the same
                    keyboardChunkWidths.push({
                        type: "chunk",
                        width: rt.textWidth(chunk[2])
                    });
                    gamepadChunkWidths.push({
                        type: "chunk",
                        width: rt.textWidth(chunk[2])
                    });

                    // add a spacer if the next chunk is also text
                    if (i < row.length - 1 && row[i + 1][0] === "text") {
                        keyboardChunkWidths.push({
                            type: "spacer", width: spacerWidth
                        });
                        gamepadChunkWidths.push({
                            type: "spacer", width: spacerWidth
                        });
                    }
                }
                else {
                    keyboardChunkWidths.push({
                        type: "chunk",
                        width: rt.textWidth(chunk[2])
                    });
                    gamepadChunkWidths.push({
                        type: "chunk",
                        width: GAMEPAD_ICONS[chunk[3]].width
                    });

                    // add a spacer to the keyboard chunks because keybind chunks are really just
                    // text chunks there
                    if (i < row.length - 1 && row[i + 1][0] === "text") {
                        keyboardChunkWidths.push({
                            type: "spacer", width: spacerWidth
                        });
                    }
                }
            }

            // chain map() into reduce() to get an array of just widths and then sum them all
            const totalKeyboardWidth = keyboardChunkWidths.map((c) => c.width)
                                                          .reduce((a, b) => a + b);
            // build chunks and add them to the list
            let currentX = -totalKeyboardWidth / 2;
            let chunkIndex = 0;
            for (const widthBlock of keyboardChunkWidths) {
                if (widthBlock.type === "chunk") {
                    const rawChunk = row[chunkIndex];
                    ++chunkIndex; // advance to the next chunk

                    // text is positioned at the center of each chunk
                    currentX += widthBlock.width / 2;
                
                    if (rawChunk[0] === "text") {
                        this.keyboardChunks.push({
                            type: "text",
                            x: currentX,
                            y: topLineOffset + y * 40,
                            color: rawChunk[1],
                            text: rawChunk[2]
                        });
                    }
                    else {
                        this.keyboardChunks.push({
                            type: "keybind",
                            x: currentX,
                            y: topLineOffset + y * 40,
                            textColor: rawChunk[1],
                            keyboardText: rawChunk[2],
                            controllerIcon: rawChunk[3]
                        });
                    }

                    currentX += widthBlock.width / 2;
                }
                else {
                    currentX += widthBlock.width;
                }
            }

            // repeat for gamepad chunks
            const totalGamepadWidth = gamepadChunkWidths.map((c) => c.width)
                                                        .reduce((a, b) => a + b);
            currentX = -totalGamepadWidth / 2;
            chunkIndex = 0;
            for (const widthBlock of gamepadChunkWidths) {
                if (widthBlock.type === "chunk") {
                    const rawChunk = row[chunkIndex];
                    ++chunkIndex; // advance to the next chunk

                    // text is positioned at the center of each chunk
                    currentX += widthBlock.width / 2;
                
                    if (rawChunk[0] === "text") {
                        this.gamepadChunks.push({
                            type: "text",
                            x: currentX,
                            y: topLineOffset + y * 40,
                            color: rawChunk[1],
                            text: rawChunk[2]
                        });
                    }
                    else {
                        this.gamepadChunks.push({
                            type: "keybind",
                            x: currentX,
                            y: topLineOffset + y * 40,
                            textColor: rawChunk[1],
                            keyboardText: rawChunk[2],
                            controllerIcon: rawChunk[3]
                        });
                    }

                    currentX += widthBlock.width / 2;
                }
                else {
                    currentX += widthBlock.width;
                }
            }
        }

        rt.pop();
    }

    render(rt: p5 | p5.Graphics): void {
        rt.push();
        rt.translate(this.position.x, this.position.y);

        // render text
        rt.noStroke();
        rt.textFont("Tomorrow", 28);
        rt.textStyle("bold");
        rt.textAlign("center", "center");
        // use the chunk set for the current input source
        const chunks = (
            Input.lastInputSource === "gamepad" ? this.gamepadChunks : this.keyboardChunks
        )
        for (const chunk of chunks) {
            // if the chunk is text, just render the text
            if (chunk.type === "text") {
                rt.fill(chunk.color);
                rt.text(chunk.text, chunk.x, chunk.y);
            }
            else {
                if (Input.lastInputSource === "gamepad") {
                    GAMEPAD_ICONS[chunk.controllerIcon].render(rt, chunk.x, chunk.y, 0.5);
                }
                else {
                    rt.fill(chunk.textColor);
                    rt.text(chunk.keyboardText, chunk.x, chunk.y);
                }
            }
        }

        rt.pop();
    }
}

/* ----- end of file ----- */