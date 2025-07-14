/* ----- src/ui/ui-page.ts ----- */

interface ITextButtonArgs {
    x: number;
    y: number;
    width: number;
    height: number;
    text: string;
    textSize: number;
    textFont: string;
    callback: () => void;
}

/** A UI button with some text on it. */
class TextButton extends UIElementBase {
    x: number;
    y: number;
    width: number;
    height: number;
    text: string;
    textSize: number;
    textFont: string;
    callback: () => void;

    constructor({x, y, width, height, text, textSize, textFont, callback}: ITextButtonArgs) {
        super();
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.text = text;
        this.textSize = textSize;
        this.textFont = textFont;
        this.callback = callback;
    }

    checkHover(mouseX: number, mouseY: number): boolean {
        return (
            mouseX >= this.x && mouseX <= this.x + this.width &&
            mouseY >= this.y && mouseY <= this.y + this.height
        );
    }

    render(rt: p5 | p5.Graphics): void {
        // if (this.hovered) {            
        //     console.log("hover");
        // }

        // rt.stroke("#000000");
        // rt.strokeWeight(4);
        // rt.fill("#ffffff");
        // rt.rect(this.x, this.y, this.width, this.height);

        rt.noStroke();
        rt.fill("#000000");
        rt.textAlign("center", "center");
        rt.textFont(this.textFont, this.textSize);
        rt.text(this.text, this.x + this.width / 2, this.y + this.height / 2);

        if (this.hovered) {
            rt.noFill();
            rt.stroke("#000000");
            rt.strokeWeight(4);

            rt.beginShape();
            rt.vertex(this.x, this.y + 15);
            rt.vertex(this.x, this.y);
            rt.vertex(this.x + 15, this.y);
            rt.endShape();

            rt.beginShape();
            rt.vertex(this.x + this.width, this.y + 15);
            rt.vertex(this.x + this.width, this.y);
            rt.vertex(this.x + this.width - 15, this.y);
            rt.endShape();

            rt.beginShape();
            rt.vertex(this.x, this.y + this.height - 15);
            rt.vertex(this.x, this.y + this.height);
            rt.vertex(this.x + 15, this.y + this.height);
            rt.endShape();

            rt.beginShape();
            rt.vertex(this.x + this.width, this.y + this.height - 15);
            rt.vertex(this.x + this.width, this.y + this.height);
            rt.vertex(this.x + this.width - 15, this.y + this.height);
            rt.endShape();
        }
    }

    onClick(): void {
        this.callback();
    }
}

/* ----- end of file ----- */