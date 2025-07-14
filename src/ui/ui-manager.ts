/* ----- src/ui/ui-manager.ts ----- */

interface IAddPageArgs {
    name: string;
    elements: { [key: string]: UIElementBase };
    cursorMap?: { [key: string]: { up?: string, down?: string, left?: string, right?: string } };
}

interface IUIManager {
    renderTarget: p5 | p5.Graphics;
    init(p5: p5, rt?: p5.Graphics): void;
    getCurrentPage(): string;
    setCurrentPage(pageName: string): void;
    update(): void;
    render(): void;
    addPage(page: IAddPageArgs): void;
}

/** Manages a set of UI pages. */
const UIManager: IUIManager = (()=>{
    interface IUIPage {
        name: string;
        elements: { [key: string]: UIElementBase };
        cursorMap: { [key: string]: { up?: string, down?: string, left?: string, right?: string } };
    }

    // all UI elements, organized into pages
    let pages: { [key: string]: IUIPage } = {};
    let currentPage: IUIPage = null;
    let lastCursorPos: string = "none";

    // the canvas to draw elements on
    let _renderTarget: p5 | p5.Graphics;

    // the element that the mouse is over or the gamepad cursor is on
    let hoveredElement: UIElementBase = null;

    return {
        get renderTarget() { return _renderTarget; },
        set renderTarget(value: p5 | p5.Graphics) { _renderTarget = value; },
        init(p5: p5, rt?: p5.Graphics) {
            _renderTarget = rt ?? p5;
        },
        getCurrentPage() {
            return currentPage.name;
        },
        setCurrentPage(pageName: string) {
            // always unload the hovered element
            if (hoveredElement !== null) {
                hoveredElement.hovered = false;
                hoveredElement = null;
            }

            if (pageName === "none") {
                currentPage = null;
                return;
            }
            if (!Object.keys(pages).includes(pageName)) {
                throw new InvalidArgumentError(
                    `[UIManager] The ui page "${pageName}" does not exist!`
                );
            }
            else {
                currentPage = pages[pageName];
                lastCursorPos = Object.keys(currentPage.elements)[0];
            }
        },
        update() {
            if (currentPage === null) { return; }
            // update hovered element
            if (Input.lastInputSource === "keyboard") {
                if (hoveredElement !== null &&
                    !hoveredElement.checkHover(_renderTarget.mouseX, _renderTarget.mouseY)) {
                    
                    hoveredElement.hovered = false;
                    hoveredElement = null;
                }
                else {
                    for (const [name, element] of Object.entries(currentPage.elements)) {
                        if (element.checkHover(_renderTarget.mouseX, _renderTarget.mouseY)) {
                            hoveredElement = element;
                            hoveredElement.hovered = true;
                            lastCursorPos = name;
                        }
                    }
                }
            }
            else {
                if (hoveredElement !== null) {
                    hoveredElement.hovered = false;
                }

                const inputDir = (
                    Input.isActive("menu up") ? "up" :
                    Input.isActive("menu down") ? "down" :
                    Input.isActive("menu left") ? "left" :
                    Input.isActive("menu right") ? "right" :
                    "none"
                );
                if (inputDir !== "none" && currentPage.cursorMap[lastCursorPos]) {
                    if (currentPage.cursorMap[lastCursorPos][inputDir]) {
                        lastCursorPos = currentPage.cursorMap[lastCursorPos][inputDir];
                    }
                }

                if (lastCursorPos !== "none") {
                    hoveredElement = currentPage.elements[lastCursorPos];
                    hoveredElement.hovered = true;
                }
            }

            // activate menu element if possible
            if (Input.isActive("menu confirm") && hoveredElement !== null) {
                hoveredElement.onClick();
            }
        },
        render() {
            if (currentPage === null) { return; }
            for (const element of Object.values(currentPage.elements)) {
                _renderTarget.push();
                element.render(_renderTarget);
                _renderTarget.pop();
            }
        },
        addPage(page: IAddPageArgs) {
            if (page.name === "none") {
                throw new InvalidArgumentError("[UIManager] \"none\" is a reserved page name!");
            }
            if (Object.keys(pages).includes(page.name)) {
                throw new InvalidArgumentError(
                    `[UIManager] The page "${page.name}" already exists!`
                );
            }

            pages[page.name] = {
                name: page.name,
                elements: page.elements,
                cursorMap: page.cursorMap ?? {}
            };
        },
    };
})();

/** Base class for UI elements. */
abstract class UIElementBase {
    hovered: boolean = false;

    // returns whether the mouse is over the element
    checkHover(mouseX: number, mouseY: number): boolean {
        return false;
    }

    // called when the element is clicked on
    abstract onClick(): void;

    abstract render(rt: p5 | p5.Graphics): void;
}

/* ----- end of file ----- */