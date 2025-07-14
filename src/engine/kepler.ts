/* ----- src/engine/kepler.ts ----- */

/** Allowed literal types for entity tags. */
type KEntityTagUnion = KeplerTag | EntityTag | string | number | Symbol;

interface IKepler {
    /**
     * Debug toggle to outline entity colliders.
     */
    showHitboxes: boolean;
    /**
     * How zoomed in or out the canvas is. Behaves the same as the scale() function. Default: 1
     */
    cameraZoom: number;
    /** The time between the last two frames in seconds, with the current time scale applied. */
    deltaTime: number;
    /**
     * The time between the last two frames in seconds, without the current time scale applied.
     */
    deltaTimeRaw: number;
    /** The number of entities being updated. */
    numEntities: number;
    /** "Speed of time". Must be greater than 0. Default: 1 */
    timeScale: number;
    /**
     * Whether to use the camera. Setting this to true without also setting the camera position
     * or target causes strange behavior. Default: false.
     */
    cameraEnabled: boolean;
    /**
     * If true, the camera is always locked to the target regardless of the camera tightness.
     * Default: false
     */
    cameraLocked: boolean;
    /**
     * Determines how quickly the camera glides toward the target (if the camera isn't locked).
     * Must be greater than 0. Default: 5
     */
    cameraTightness: number;
    /** The canvas to render entities to. */
    renderTarget: p5 | p5.Graphics;
    /**
     * Hitstop freezes everything for a (usually brief) duration. Gameplay-wise, small hitstops can
     * help "sell" hard hits, kills, and other such events. During hitstop, entities' `update()`
     * methods are not called at all, unless the entity has the `IGNORE_HITSTOP` tag.
     */
    hitstop: number;
    /**
     * Initializes everything. This *must* be called before any other Kepler methods are used!
     */
    init(sketch: p5, renderTarget?: p5.Graphics): void;
    /** Returns the current position of the camera. */
    getCameraPos(): Vector2D;
    /**
     * Sets the position of the camera. The camera will immediately be snapped here; use
     * setCameraTarget() to move it smoothly.
     */
    setCameraPos(x: number, y: number): void;
    /**
     * Sets the position of the camera. The camera will immediately be snapped here; use
     * setCameraTarget() to move it smoothly.
     */
    setCameraPos(pos: Vector2D): void;
    /** Returns the position the camera is moving towards. */
    getCameraTarget(): Vector2D;
    /**
     * Sets the camera target. The camera will move smoothly toward this position; use
     * setCameraPosition() to immediately move it.
     */
    setCameraTarget(x: number, y: number): void;
    /**
     * Sets the camera target. The camera will move smoothly toward this position; use
     * setCameraPosition() to immediately move it.
     */
    setCameraTarget(pos: Vector2D): void;
    /**
     * Returns the viewport (the area the camera can see) in the format
     * `[left, top, right, bottom]`.
     */
    getViewportBounds(): [number, number, number, number];
    /**
     * Sets the viewport, which determines the area that the camera can see.
     */
    setViewportBounds(left: number, top: number, right: number, bottom: number): void;
    /**
     * Sets the viewport, which determines the area that the camera can see.
     */
    setViewportBounds(bounds: [number, number, number, number]): void;
    /** Returns the area that is currently onscreen. */
    getViewableArea(): [number, number, number, number];
    /**
     * Adds an entity to the engine, then returns a reference to it (this is more useful than it
     * probably sounds).
     * @param [allowSetup=true] Whether to call the entity's `setup()` method (if it has one).
     */
    addEntity<T extends KEntityBase>(entity: T, allowSetup?: boolean): T;
    /**
     * Updates all entities. Should be called once per frame in `draw()`.
     */
    update(): void;
    /**
     * Draws all entities to the canvas.
     */
    render(): void;
    /**
     * Removes all entities without the `Kepler.IGNORE_REMOVE_ALL` tag.
     * @param [ignoreTag=false] If true, entities with the `Kepler.IGNORE_REMOVE_ALL` tag are also
     *      removed.
     * @param [silent=true] If true, entities' `onDelete()` methods are not called.
     */
    deleteAll(ignoreTag?: boolean, silent?: boolean): void;
    /**
     * Removes all entities that a predicate function returns true for.
     * @param [silent=false] If true, entities' `onDelete()` methods are not called.
     */
    deleteIf(predicate: (e: KEntityBase)=>boolean, ignoreTag?: boolean, silent?: boolean): void;
    /**
     * Removes all entities with a certain tag.
     * @param [silent=false] If true, entities' `onDelete()` methods are not called.
     */
    deleteTagged(tag: KEntityTagUnion, ignoreTag?: boolean, silent?: boolean): void;
    /**
     * Returns an array containing references to all entities.
     */
    getAll(): KEntityBase[];
    /**
     * Returns an array containing references to all entities that a predicate function returns
     * true for.
     */
    getIf(predicate: (e: KEntityBase)=>boolean): KEntityBase[];
    /**
     * Returns an array containing references to all entities that have a certain tag.
     */
    getTagged(tag: KEntityTagUnion): KEntityBase[];
    /**
     * Converts a position in screen space (relative to the top left corner of the canvas) to a
     * position in world space (relative to the camera).
     */
    screenPosToWorldPos(x: number, y: number): Vector2D;
    /**
     * Converts a position in screen space (relative to the top left corner of the canvas) to a
     * position in world space (relative to the camera).
     */
    screenPosToWorldPos(pos: Vector2D): Vector2D;
    /**
     * Converts a position in world space (relative to the camera) to a position in screen space
     * (relative to the top left corner of the canvas).
     */
    worldPosToScreenPos(x: number, y: number): Vector2D;
    /**
     * Converts a position in world space (relative to the camera) to a position in screen space
     * (relative to the top left corner of the canvas).
     */
    worldPosToScreenPos(pos: Vector2D): Vector2D;
    /**
     * Returns the position of the mouse in screen space. Mainly here for consistency with
     * `worldMousePos()`.
     */
    screenMousePos(): Vector2D;
    /**
     * Returns the position of the mouse in world space.
     */
    worldMousePos(): Vector2D;
}

/** Internal entity tags. */
enum KeplerTag {
    /** Entities with the `USES_RAW_DELTA_TIME` tag ignore the time scale when updating. */
    USES_RAW_DELTA_TIME = "USES_RAW_DELTA_TIME",
    /**
     * Entities with the `USES_SCREEN_SPACE_COORDS` tag ignore the camera position. (0, 0) will
     * always be the top left of the screen when rendering.
     */
    USES_SCREEN_SPACE_COORDS = "USES_SCREEN_SPACE_COORDS",
    /**
     * Entities with the `IGNORE_REMOVE` tag will remain in the engine when `removeAll()`,
     * `removeIf()`, or `removeTagged()` are called without setting any parameters.
     */
    IGNORE_REMOVE = "IGNORE_REMOVE",
    /**
     * Entities with the `IGNORE_HITSTOP` tag will continue to be updated during hitstop.
     */
    IGNORE_HITSTOP = "IGNORE_HITSTOP"
};

/** Kepler, my mildly questionable in-house game engine. */
const Kepler: IKepler = (()=>{
    // utility functions
    /** Framerate-independent version of `lerp()`; used for updating camera position. */
    function damp(a: number, b: number, t: number, dt: number) {
        t = 1 - Math.exp(-t * dt);
        // i can't use the p5 lerp function because we're running in instance mode
        return (b - a) * t + a;
    }

    function constrain(n: number, low: number, high: number): number {
        return (
            n < low  ? low  :
            n > high ? high :
            n
        );
    }

    // internal variables
    /** The p5.js sketch running the engine. */
    let p5: p5;
    
    let rtXScale: number = 1;
    let rtYScale: number = 1;

    /** Main entity list; used for everything except rendering. */
    let entities: KEntityBase[] = [];
    /** Entities grouped into display layers. */
    let displayLayers: { [key: number]: KEntityBase[] } = {};
    /** All active display layers. */
    let layerIndexes: number[] = [];
    
    let cameraPos: Vector2D = new Vector2D();
    let cameraTarget: Vector2D = new Vector2D();
    let renderX: number = 0;
    let renderY: number = 0;
    let minCameraX: number = -Infinity;
    let maxCameraX: number = Infinity;
    let minCameraY: number = -Infinity;
    let maxCameraY: number = Infinity;
    let viewportBounds: [number, number, number, number] = [
        -Infinity, -Infinity, Infinity, Infinity
    ];
    let cameraZoom_: number = 1;

    const Kepler: Partial<IKepler> = {
        showHitboxes: false,
        cameraEnabled: false,
        cameraLocked: false,
        cameraTightness: 5,
        timeScale: 1,
        hitstop: 0,

        // getters and setters to emulate public properties
        get cameraZoom(): number {
            return cameraZoom_;
        },
        set cameraZoom(value: number) {
            cameraZoom_ = value;
            minCameraX = viewportBounds[0] + Kepler.renderTarget.width / 2 / cameraZoom_;
            maxCameraX = viewportBounds[2] - Kepler.renderTarget.width / 2 / cameraZoom_;
            minCameraY = viewportBounds[1] + Kepler.renderTarget.height / 2 / cameraZoom_;
            maxCameraY = viewportBounds[3] - Kepler.renderTarget.height / 2 / cameraZoom_;
        },

        // getters for read-only properties
        get deltaTime(): number {
            // native delta time is in milliseconds
            return p5.deltaTime / 1000 * Kepler.timeScale;
        },
        get deltaTimeRaw(): number {
            return p5.deltaTime / 1000;
        },
        get numEntities(): number {
            return entities.length;
        },
    };

    function init(sketch: p5, renderTarget?: p5.Graphics) {
        p5 = sketch;
        Kepler.renderTarget = renderTarget ?? sketch;
        rtXScale = Kepler.renderTarget.width / p5.width;
        rtYScale = Kepler.renderTarget.height / p5.height;
    }
    Kepler.init = init;

    // normally i'd just define all the public methods on the Kepler object directly, but if i do
    // that then typescript freaks out if i try to overload things
    function getCameraPos(): Vector2D {
        return cameraPos.copy();
    }
    Kepler.getCameraPos = getCameraPos;

    function setCameraPos(x: number, y: number): void;
    function setCameraPos(pos: Vector2D): void;
    function setCameraPos(x: number|Vector2D, y?: number) {
        if (typeof x !== "number") {
            y = x.y;
            x = x.x;
        }
        
        cameraPos.set(
            constrain(x, minCameraX, maxCameraX),
            constrain(y, minCameraY, maxCameraY)
        );
        // also set the target to prevent the camera from snapping around
        cameraTarget.set(cameraPos);
    }
    Kepler.setCameraPos = setCameraPos;

    function getCameraTarget(): Vector2D {
        return cameraTarget.copy();
    }
    Kepler.getCameraTarget = getCameraTarget;

    function setCameraTarget(x: number, y: number): void;
    function setCameraTarget(pos: Vector2D): void;
    function setCameraTarget(x: number|Vector2D, y?: number) {
        if (typeof x !== "number") {
            y = x.y;
            x = x.x;
        }
        
        cameraTarget.set(
            constrain(x, minCameraX, maxCameraX),
            constrain(y, minCameraY, maxCameraY)
        );
    }
    Kepler.setCameraTarget = setCameraTarget;

    function getViewportBounds(): [number, number, number, number] {
        return viewportBounds.slice() as [number, number, number, number];
    }
    Kepler.getViewportBounds = getViewportBounds;

    function setViewportBounds(left: number, top: number, right: number, bottom: number): void;
    function setViewportBounds(bounds: [number, number, number, number]): void;
    function setViewportBounds(left: number|[number, number, number, number], top?: number,
                        right?: number, bottom?: number) {
        if (Array.isArray(left)) {
            viewportBounds = left.slice() as [number, number, number, number];
        }
        else {
            viewportBounds = [left, top, right, bottom];
        }
        minCameraX = viewportBounds[0] + Kepler.renderTarget.width / 2 / cameraZoom_;
        maxCameraX = viewportBounds[2] - Kepler.renderTarget.width / 2 / cameraZoom_;
        minCameraY = viewportBounds[1] + Kepler.renderTarget.height / 2 / cameraZoom_;
        maxCameraY = viewportBounds[3] - Kepler.renderTarget.height / 2 / cameraZoom_;
    }
    Kepler.setViewportBounds = setViewportBounds;

    function getViewableArea(): [number, number, number, number] {
        return [
            cameraPos.x - Kepler.renderTarget.width / 2,
            cameraPos.y - Kepler.renderTarget.height / 2,
            cameraPos.x + Kepler.renderTarget.width / 2,
            cameraPos.y + Kepler.renderTarget.height / 2
        ];
    }
    Kepler.getViewableArea = getViewableArea;

    function addEntity<T extends KEntityBase>(entity: T, allowSetup: boolean=true): T {
        if (allowSetup) {
            entity.setup(); // may or may not do something
        }

        entities.push(entity);

        if (layerIndexes.includes(entity.displayLayer)) {
            displayLayers[entity.displayLayer].push(entity);
        }
        else {
            displayLayers[entity.displayLayer] = [entity];
            layerIndexes.push(entity.displayLayer);
            // make sure layers actually stay in order
            layerIndexes.sort((a, b) => a - b);
            // console.log(layerIndexes);
        }

        return entity;
    }
    Kepler.addEntity = addEntity;

    function update() {
        // during hitstop, decrement the timer and only update enemies that specifically ignore it
        if (Kepler.hitstop > 0) {
            // i don't use deltaTimeRaw here for future-proofing if i ever add something that
            // applies some kind of global time scale
            Kepler.hitstop = Math.max(Kepler.hitstop - p5.deltaTime / 1000, 0);
            entities.forEach((e) => {
                if (!e.markForDelete && e.hasTag(KeplerTag.IGNORE_HITSTOP)) {
                    // delta time is always zero during hitstop
                    e.update(0);
                }
            });
        }
        else {
            entities.forEach((e) => {
                // don't update entities that have already been deleted
                if (!e.markForDelete) {
                    if (e.hasTag(KeplerTag.USES_RAW_DELTA_TIME)) {
                        e.update(Kepler.deltaTimeRaw);
                    }
                    else {
                        e.update(Kepler.deltaTime);
                    }
                }
            });

            // update the camera (if enabled)
            // console.log(Kepler.hitstop);
            if (Kepler.cameraEnabled && Kepler.hitstop <= 0) {
                cameraPos.x = constrain(cameraPos.x, minCameraX, maxCameraX);
                cameraPos.y = constrain(cameraPos.y, minCameraY, maxCameraY);
                cameraTarget.x = constrain(
                    cameraTarget.x, minCameraX, maxCameraX
                );
                cameraTarget.y = constrain(
                    cameraTarget.y, minCameraY, maxCameraY
                );

                if (Kepler.cameraLocked) {
                    cameraPos.set(cameraTarget);
                }
                else {
                    cameraPos.set(
                        damp(
                            cameraPos.x, cameraTarget.x, Kepler.cameraTightness,
                            Kepler.deltaTimeRaw
                        ),
                        damp(
                            cameraPos.y, cameraTarget.y, Kepler.cameraTightness,
                            Kepler.deltaTimeRaw
                        ),
                    );
                }
                // console.log(cameraPos);

                renderX = -Math.floor(
                    cameraPos.x - Kepler.renderTarget.width / 2 / Kepler.cameraZoom
                );
                renderY = -Math.floor(
                    cameraPos.y - Kepler.renderTarget.height / 2 / Kepler.cameraZoom
                );
            }
        }
        
        // always garbage collect
        Kepler.deleteIf((e) => e.markForDelete);
    }
    Kepler.update = update;
    
    // helper function for rendering hitboxes when enabled
    function renderEntity(entity: KEntityBase) {
        Kepler.renderTarget.push();
        entity.render(Kepler.renderTarget);

        if (Kepler.showHitboxes && entity.collider) {
            Kepler.renderTarget.noFill();
            Kepler.renderTarget.stroke("#ff00ff");
            Kepler.renderTarget.strokeWeight(2);
            Kepler.renderTarget.rect(
                entity.collider.x,
                entity.collider.y,
                entity.collider.width,
                entity.collider.height
            );
        }

        Kepler.renderTarget.pop();
    }
    function render() {
        if (Kepler.cameraEnabled) {
            Kepler.renderTarget.push();
            Kepler.renderTarget.scale(Kepler.cameraZoom);
            // console.log(`${renderX}, ${renderY}`);
            Kepler.renderTarget.translate(renderX, renderY);

            layerIndexes.forEach((i) => {
                displayLayers[i].forEach((entity) => {
                    if (entity.hasTag(KeplerTag.USES_SCREEN_SPACE_COORDS)) {
                        Kepler.renderTarget.translate(-renderX, -renderY);
                        Kepler.renderTarget.scale(1 / Kepler.cameraZoom);
                        renderEntity(entity);
                        Kepler.renderTarget.scale(Kepler.cameraZoom);
                        Kepler.renderTarget.translate(renderX, renderY);
                    }
                    else {
                        renderEntity(entity);
                    }
                });
            });

            Kepler.renderTarget.pop();
        }
        else {
            layerIndexes.forEach((i) => {
                displayLayers[i].forEach((entity) => {
                    renderEntity(entity);
                });
            });
        }
    }
    Kepler.render = render;

    function deleteAll(ignoreTag: boolean=false, silent: boolean=true) {
        if (ignoreTag) {
            if (!silent) {
                entities.forEach((e) => e.onDelete());
            }
            
            entities = [];
            displayLayers = {};
            layerIndexes = [];
        }
        else {
            // easier than doing this manually
            Kepler.deleteIf((e) => true, ignoreTag, silent);
        }
    }
    Kepler.deleteAll = deleteAll;

    function deleteIf(predicate: (e: KEntityBase)=>boolean, ignoreTag: boolean = false,
                      silent: boolean=false) {
        let filterFn: (e: KEntityBase)=>boolean;
        if (ignoreTag) {
            // filter() removes items that a predicate returns *false* for
            filterFn = (e) => !predicate(e);
        }
        else {
            filterFn = (e) => (!predicate(e) || e.hasTag(KeplerTag.IGNORE_REMOVE));
        }

        if (silent) {
            entities = entities.filter(filterFn);
        }
        else {
            const filtered: KEntityBase[] = [];
            entities.forEach((e) => {
                if (filterFn(e)) {
                    filtered.push(e);
                }
                else {
                    e.onDelete();
                }
            });
            entities = filtered;
        }

        // also remove entities from display layers
        layerIndexes.forEach((i) => {
            displayLayers[i] = displayLayers[i].filter(filterFn);
        });
        // remove empty display layers
        layerIndexes = layerIndexes.filter((i) => displayLayers[i].length > 0);
    }
    Kepler.deleteIf = deleteIf;

    function deleteTagged(tag: KEntityTagUnion, ignoreTag: boolean = false, silent: boolean=false) {
        deleteIf((e) => e.hasTag(tag), ignoreTag, silent);
    }
    Kepler.deleteTagged = deleteTagged;

    function getAll(): KEntityBase[] {
        // shallow copy the array to prevent issues if something modifies it
        return entities.slice();
    }
    Kepler.getAll = getAll;

    function getIf(predicate: (e: KEntityBase)=>boolean): KEntityBase[] {
        return entities.filter(predicate);
    }
    Kepler.getIf = getIf;

    function getTagged(tag: KEntityTagUnion): KEntityBase[] {
        return entities.filter((e) => e.hasTag(tag));
    }
    Kepler.getTagged = getTagged;

    function screenPosToWorldPos(x: number, y: number): Vector2D;
    function screenPosToWorldPos(pos: Vector2D): Vector2D;
    function screenPosToWorldPos(x: number|Vector2D, y?: number): Vector2D {
        if (typeof x !== "number") {
            y = x.y;
            x = x.x;
        }

        return new Vector2D((x * rtXScale) - renderX, (y * rtYScale) - renderY);
    }
    Kepler.screenPosToWorldPos = screenPosToWorldPos;

    function worldPosToScreenPos(x: number, y: number): Vector2D;
    function worldPosToScreenPos(pos: Vector2D): Vector2D;
    function worldPosToScreenPos(x: number|Vector2D, y?: number): Vector2D {
        if (typeof x !== "number") {
            y = x.y;
            x = x.x;
        }

        return new Vector2D((x + renderX) / rtXScale, (y + renderY) / rtYScale);
    }
    Kepler.worldPosToScreenPos = worldPosToScreenPos;

    function screenMousePos(): Vector2D {
        return new Vector2D(p5.mouseX, p5.mouseY);
    }
    Kepler.screenMousePos = screenMousePos;

    function worldMousePos(): Vector2D {
        return screenPosToWorldPos(screenMousePos());
    }
    Kepler.worldMousePos = worldMousePos;

    return Kepler as IKepler;
})();

/**
 * Abstract base class that all game entities should extend.
 */
abstract class KEntityBase {
    /**
     * Which display layer the entity is on. Entities on a higher display layer will always be
     * drawn on top of entities on a lower display layer, regardless of what order they were
     * added to the engine in. Display layers can be any number, including non-integers and
     * negative numbers.
     */
    displayLayer: number = 0;
    /** All of the entity's tags (if it has any). */
    tags: KEntityTagUnion[] = [];
    /** If true, the entity will be removed from the engine at the end of the current update. */
    markForDelete: boolean = false;
    /** The entity's collider; used when `Kepler.showHitboxes` is true. */
    collider: RectCollider;
    /**
     * The entity's position. This isn't used by the engine, but so many entities have it that
     * declaring it here makes it much easier to keep typescript happy.
     */
    position: Vector2D;

    /** Called when the entity is added to the engine. */
    setup() {}
    /** Called when the entity is removed from the engine. */
    onDelete() {}
    /**
     * Draws the entity to the canvas.
     * @param rt The render target.
     */
    render(rt: p5|p5.Graphics) {}
    /**
     * Updates the entity.
     * @param dt The time between the last two updates in second, with the current time scale
     *      applied (unless the entity has the `KeplerTag.USES_RAW_DELTA_TIME` tag).
     */
    update(dt: number) {}
    /**
     * Returns whether the entity has a certain tag.
     */
    hasTag(tag: KEntityTagUnion): boolean {
        return this.tags.includes(tag);
    }
}

/* ----- end of file ----- */