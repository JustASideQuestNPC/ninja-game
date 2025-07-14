/* ----- src/entities/player.ts ----- */

/** The player. */
class Player extends KEntityBase {
    velocity: Vector2D;

    // slightly smaller hitbox used for checking hazards and attacks
    hurtbox: RectCollider;
    // whether the player has i-frames ("invincibility frames") and can't be killed by bullets or
    // melee enemies. the player (currently) only has i-frames during a dash
    hasIFrames = false;

    // "ground", "air", "wallslide", or "wallrun"
    groundState: "ground" | "air" | "wallslide" | "wallrun" = "air";
    coyoteTime = 0;
    // "left" or "right"
    facingAngle: "left" | "right" = "right";
    // "ground", "wallslide", or "wallrun" - this is required because of how coyote time works
    jumpState: "ground" | "wallslide" | "wallrun" = "ground";
    wallSide: "left" | "right" = "right";
    wallrunTime = 0;
    canWallrun = false;

    attacking = false;
    attackLungeAngle = 0;
    attackSwingAngle = 0;
    attackCooldown = 0;
    attackHitboxOffset: Vector2D;
    // lunge force can only be applied once while in the air
    canLunge = false;

    // for the sword animation trail
    swordTrailPositions: [Vector2D, Vector2D, number][] = [];
    swordTrailLifetime = 0.075;

    dashing = false;
    canDash = false;
    dashTime = 0;

    // base hitbox for bullet deflection
    centeredBulletDeflectHitbox: [number, number][] = [
        [-12, -20],
        [-5, -30],
        [20, -28],
        [42, -21],
        [56, -11],
        [60, 0],
        [56, 11],
        [42, 21],
        [20, 28],
        [-5, 30],
        [-12, 20],
    ];

    bulletDeflectHitbox: Vector2D[] = [];

    constructor(x: number, y: number) {
        super();
        this.position = new Vector2D(x, y);
        this.velocity = new Vector2D(); // defaults to a zero vector
        this.collider = new RectCollider(x - 10, y - 15, 20, 30);
        this.hurtbox = new RectCollider(x - 7, y - 12, 14, 24);
    }

    setup(): void {
        Kepler.setCameraPos(this.position);
    }

    render(rt: p5 | p5.Graphics): void {
        rt.push();
        rt.translate(this.position.x, this.position.y);

        // body
        rt.noStroke();
        rt.fill("#2483ff");
        rt.rect(
            -this.collider.width / 2, -this.collider.height / 2,
            this.collider.width, this.collider.height
        );

        // eye
        rt.fill("#000000");
        rt.circle(this.facingAngle === "left" ? -3 : 3, -7, 6);

        if (this.swordTrailPositions.length > 0) {
            // draw sword trail
            rt.strokeWeight(4);
            for (const [start, end, lifetime] of this.swordTrailPositions) {
                rt.stroke(100, 114, 135, map(lifetime, 0, this.swordTrailLifetime, 0, 255));
                rt.line(start.x, start.y, end.x, end.y);
            }
        }
        rt.pop();

        if (Kepler.showHitboxes) {
            rt.noFill();
            rt.stroke("#ff0000");
            rt.strokeWeight(2);
            rt.rect(
                this.hurtbox.x,
                this.hurtbox.y,
                this.hurtbox.width,
                this.hurtbox.height
            );

            if (this.bulletDeflectHitbox.length > 0) {
                rt.beginShape();
                for (const v of this.bulletDeflectHitbox) {
                    rt.vertex(v.x, v.y);
                }
                rt.endShape("close");
            }
        }
    }

    update(dt: number): void {
        if (this.attackCooldown > 0) {
            this.attackCooldown -= dt;
        }
        // attack if possible
        else if (!this.dashing && Input.isActive("attack")) {
            this.attacking = true;
            this.attackSwingAngle = CONSTANTS.PLAYER_ATTACK_ARC_START;
            this.swordTrailPositions = [];
            
            // find lunge direction
            let aimDir = new Vector2D();
            // only lunge if we're in midair and haven't already
            let lungeInput = true;
            if (Input.lastInputSource === "gamepad") {
                aimDir = Input.gamepad.stickVector(GpThumbstick.LEFT);
            }
            else {
                aimDir = Kepler.worldMousePos().sub(this.position);
            }

            // if there's no directional input, use our facing direction and don't lunge
            if (!aimDir.nonZero()) {
                lungeInput = false;
                aimDir.x = (this.facingAngle === "left" ? -1 : 1);
            }

            this.attackLungeAngle = aimDir.heading();
            if (lungeInput && this.canLunge && this.groundState !== "wallrun") {
                // console.log("lunging");
                let shouldLunge = true;
                // if we're on the ground, only lunge if we're aimed off of it
                if (this.groundState === "ground") {
                    shouldLunge = (
                        this.attackLungeAngle < -CONSTANTS.PLAYER_LUNGE_TURNAROUND_ANGLE ||
                        this.attackLungeAngle > CONSTANTS.PLAYER_LUNGE_TURNAROUND_ANGLE + Math.PI
                    );
                    // console.log("grounded lunge");
                }
                // if we're moving above the lunge speed, check whether to perform a turnaround
                else if (this.velocity.mag() > CONSTANTS.PLAYER_ATTACK_LUNGE_SPEED) {
                    const angleDelta = this.attackLungeAngle - this.velocity.heading();
                    // console.log(angleDelta);
                    shouldLunge = Math.abs(angleDelta) >= CONSTANTS.PLAYER_LUNGE_TURNAROUND_ANGLE;
                }

                // always make sure we won't be lunging straight down
                if (this.attackLungeAngle > Math.PI / 4 &&
                    this.attackLungeAngle < Math.PI * 3 / 4) {

                    shouldLunge = false;
                }

                if (shouldLunge) {
                    this.velocity.set(Vector2D.fromPolar(
                        this.attackLungeAngle, CONSTANTS.PLAYER_ATTACK_LUNGE_SPEED
                    ));
                    this.canLunge = false;
                }
            }

            this.attackHitboxOffset = Vector2D.fromPolar(
                this.attackLungeAngle, CONSTANTS.PLAYER_ATTACK_ARC_FORWARD_OFFSET
            );
        }

        // assume we don't have i-frames so i don't have to remember to reset them everywhere this
        // method cancels a dash
        this.hasIFrames = false;
        if (this.dashing) {
            this.hasIFrames = true;
            this.dashTime -= dt;
            if (this.dashTime < 0) {
                this.dashing = false;
                this.velocity.mult(CONSTANTS.PLAYER_DASH_PRESERVED_VELOCITY);
                if (CONSTANTS.PLAYER_DASH_RECHARGES_LUNGE) {
                    this.canLunge = true;
                }
                if (CONSTANTS.PLAYER_DASH_RECHARGES_WALLRUN) {
                    this.canWallrun = true;
                }
                Kepler.hitstop = CONSTANTS.PLAYER_DASH_END_HITSTOP;
            }
        }
        // dash if possible
        else if (!this.attacking && this.canDash && Input.isActive("dash")) {
            // find lunge direction
            let aimDir = new Vector2D();
            if (Input.lastInputSource === "gamepad") {
                aimDir = Input.gamepad.stickVector(GpThumbstick.LEFT);
            }
            else {
                aimDir = Kepler.worldMousePos().sub(this.position).normalize();
            }

            // if there's no directional input, cancel the dash
            if (aimDir.nonZero()) {
                this.dashing = true;
                this.velocity.set(aimDir.mult(CONSTANTS.PLAYER_DASH_SPEED));
                this.dashTime = CONSTANTS.PLAYER_DASH_DURATION;
                this.canDash = false;
                this.coyoteTime = 0;

                if (this.groundState === "wallrun") {
                    this.wallrunTime = 0;
                    this.canWallrun = false;
                }
            }
        }

        // normal movement is disabled during the attack swing/lunge and during dashes
        if (this.attacking) {
            // update where the hitbox is
            const prevSwingAngle = this.attackSwingAngle;
            this.attackSwingAngle += CONSTANTS.PLAYER_ATTACK_SWING_SPEED * dt;
            let attackHitboxEnd = Vector2D.fromPolar(
                this.attackSwingAngle + this.attackLungeAngle, ellipseRadius(
                    CONSTANTS.PLAYER_ATTACK_ARC_WIDTH, CONSTANTS.PLAYER_ATTACK_ARC_HEIGHT,
                    this.attackSwingAngle
                )
            ).add(this.attackHitboxOffset);

            const midAngle = prevSwingAngle + (this.attackSwingAngle - prevSwingAngle) / 2;
            
            // update animation trail
            const innerEndpoint = Vector2D.fromPolar(
                this.attackSwingAngle + this.attackLungeAngle,
                ellipseRadius(50, 43, this.attackSwingAngle)
            ).add(this.attackHitboxOffset);
            this.swordTrailPositions.push([
                innerEndpoint, attackHitboxEnd, this.swordTrailLifetime
            ]);

            // add a second segment halfway between the current and previous ones so that the trail
            // looks at least kind of smooth
            const midPointInner = Vector2D.fromPolar(
                midAngle + this.attackLungeAngle, ellipseRadius(50, 43, midAngle)
            ).add(this.attackHitboxOffset);
            const midPointOuter = Vector2D.fromPolar(
                midAngle + this.attackLungeAngle, ellipseRadius(
                    CONSTANTS.PLAYER_ATTACK_ARC_WIDTH, CONSTANTS.PLAYER_ATTACK_ARC_HEIGHT, midAngle
                )
            ).add(this.attackHitboxOffset);
            this.swordTrailPositions.push([
                midPointInner, midPointOuter, this.swordTrailLifetime
            ]);

            // check whether we've hit an enemy
            // extend the hitbox backward so hitting nearby enemies is easier
            const attackHitboxStart = Vector2D.fromPolar(
                this.attackSwingAngle + this.attackLungeAngle + Math.PI, 3
            ).add(this.attackHitboxOffset);

            // this.swordTrailPositions.push([
            //     attackHitboxStart.copy(), attackHitboxEnd, this.swordTrailLifetime
            // ]);

            attackHitboxEnd = attackHitboxEnd.copy().add(this.position);
            attackHitboxStart.add(this.position);

            // console.log(`${attackHitboxStart}, ${attackHitboxEnd}`);

            const enemies = Kepler.getTagged(EntityTag.IS_ENEMY) as EnemyBase[];
            for (const enemy of enemies) {
                if (enemy.collider.containsLine(attackHitboxStart, attackHitboxEnd)) {
                    enemy.markForDelete = true;
                    enemy.onDeath();
                    Kepler.hitstop = CONSTANTS.BASE_ON_KILL_HITSTOP;
                    break; // only hit one enemy per frame so the hitstop stacks up
                }
            }

            // update where the blade is - this is so that bullets appear to be deflected as the
            // sword passes them
            this.bulletDeflectHitbox = [];
            for (const vertex of this.centeredBulletDeflectHitbox) {
                this.bulletDeflectHitbox.push(
                    new Vector2D(vertex[0], vertex[1])
                        .rotate(this.attackLungeAngle)
                        .add(this.position)
                );
            }

            
            const bullets = Kepler.getTagged(EntityTag.BULLET) as Bullet[];
            for (const bullet of bullets) {
                // only check bullets that haven't already been deflected
                if (!bullet.canHitEnemies &&
                    pointInPolygon(bullet.position, this.bulletDeflectHitbox)) {
                    
                    // if the shooter exists, send the bullet back at them
                    if (bullet.firedBy !== null && !bullet.firedBy.markForDelete) {
                        const delta = bullet.firedBy.position.copy().sub(bullet.position);
                        bullet.velocity = delta.setMag(CONSTANTS.DEFLECTED_BULLET_SPEED);
                        bullet.canHitEnemies = true;
                    }
                    // otherwise, just destroy the bullet
                    else {
                        bullet.markForDelete = true;
                    }

                    Kepler.hitstop = CONSTANTS.BULLET_DEFLECT_HITSTOP;
                    break;
                }
            }

            // end the attack
            if (this.attackSwingAngle > CONSTANTS.PLAYER_ATTACK_ARC_END) {
                this.attacking = false;
                this.attackCooldown = CONSTANTS.PLAYER_ATTACK_COOLDOWN;
                this.bulletDeflectHitbox = [];
            }
        }
        else if (!this.dashing) {
            // horizontal movement
            let moveDir = 0;
            if (Input.lastInputSource === "gamepad") {
                const stickPos = Input.gamepad.axisValue(GpAxis.LEFT_STICK_X);
                if (stickPos <= -0.75) { moveDir = -1; }
                else if (stickPos >= 0.75) { moveDir = 1; }
            }
            else {
                if (Input.isActive("left"))  { --moveDir; }
                if (Input.isActive("right")) { ++moveDir; }
            }

            if ((moveDir < 0 && this.velocity.x >= -CONSTANTS.PLAYER_MAX_RUN_SPEED) ||
                (moveDir > 0 && this.velocity.x <= CONSTANTS.PLAYER_MAX_RUN_SPEED)) {
                
                let acceleration = (
                    this.groundState === "air" ? CONSTANTS.PLAYER_AIR_ACCELERATION :
                    CONSTANTS.PLAYER_GROUND_ACCELERATION
                );

                // apply speed cap
                if (moveDir < 0) {
                    this.velocity.x = Math.max(
                        this.velocity.x - acceleration * dt, -CONSTANTS.PLAYER_MAX_RUN_SPEED
                    );
                }
                else {
                    this.velocity.x = Math.min(
                        this.velocity.x + acceleration * dt, CONSTANTS.PLAYER_MAX_RUN_SPEED
                    );
                }
            }
            else if (this.velocity.x !== 0) {
                const friction = (
                    this.groundState === "air" ? CONSTANTS.PLAYER_AIR_FRICTION :
                    this.groundState === "wallrun" ? CONSTANTS.PLAYER_WALLRUN_FRICTION :
                    CONSTANTS.PLAYER_GROUND_FRICTION
                );
                
                // snap to zero to prevent weird oscillations
                if (Math.abs(this.velocity.x) < friction * dt) {
                    this.velocity.x = 0;
                }
                else {
                    if (this.velocity.x < 0) {
                        this.velocity.x += friction * dt;
                    }
                    else {
                        this.velocity.x -= friction * dt;
                    }
                }
            }

            // update facing angle
            if (this.velocity.x < 0) { this.facingAngle = "left"; }
            else if (this.velocity.x > 0) { this.facingAngle = "right"; }

            // check if we're over a wallrun surface
            if (this.canWallrun) {
                let onWallrunSurface = false;
                const wallRunSurfaces = Kepler.getTagged(EntityTag.WALLRUN_SURFACE);
                for (const surface of wallRunSurfaces) {
                    // wallrunning requires you to be mostly over the surface
                    if (surface.collider.containsPoint(this.position)) {
                        onWallrunSurface = true;
                        break;
                    }
                }

                if (onWallrunSurface) {
                    if (this.groundState === "wallrun") {
                        // console.log(Math.abs(this.velocity.x));
                        if (Math.abs(this.velocity.x) < CONSTANTS.PLAYER_MIN_WALLRUN_SPEED ||
                            this.wallrunTime < 0 || !Input.isActive("wallrun")) {
                            
                            this.groundState = "air";
                            this.wallrunTime = 0;
                            this.canWallrun = false;
                        }
                        else {
                            this.wallrunTime -= dt;
                            this.coyoteTime = CONSTANTS.PLAYER_COYOTE_TIME;
                        }
                    }
                    // initiate a wallrun if possible
                    else if (Input.isActive("start wallrun")) {
                        this.wallrunTime = CONSTANTS.PLAYER_MAX_WALLRUN_DURATION;
                        this.groundState = "wallrun";
                        this.jumpState = "wallrun";
                        this.coyoteTime = CONSTANTS.PLAYER_COYOTE_TIME;
                        if (CONSTANTS.PLAYER_WALLRUN_RECHARGES_LUNGE) {
                            this.canLunge = true;
                        }
                        if (CONSTANTS.PLAYER_WALLRUN_RECHARGES_DASH) {
                            this.canDash = true;
                        }
                    }
                }
                else if (this.groundState === "wallrun") {
                    this.groundState = "air";
                    this.wallrunTime = 0;
                    this.canWallrun = false;
                }
            }
        }
        
        // update sword trail here so that it fades out after the attack finishes
        if (this.swordTrailPositions.length > 0) {
            for (let i = 0; i < this.swordTrailPositions.length; ++i) {
                this.swordTrailPositions[i][2] -= dt;
            }
            // the front segments will always have the lowest lifetimes
            while (this.swordTrailPositions.length > 0 && this.swordTrailPositions[0][2] <= 0) {
                this.swordTrailPositions.shift();
            }
        }

        // jump or apply gravity
        if (!this.dashing) {
            if (this.coyoteTime > 0 && Input.isActive("jump")) {
                if (this.jumpState === "wallslide") {
                    // jumping is an impulse so delta time doesn't affect it
                    this.velocity.y = CONSTANTS.PLAYER_WALLJUMP_Y_IMPULSE;
                    this.velocity.x = (
                        this.wallSide === "left" ? -CONSTANTS.PLAYER_WALLJUMP_X_IMPULSE :
                        CONSTANTS.PLAYER_WALLJUMP_X_IMPULSE
                    );
                }
                else if (this.jumpState === "wallrun") {
                    this.velocity.y = CONSTANTS.PLAYER_WALLRUN_JUMP_IMPULSE;
                }
                else {
                    this.velocity.y = CONSTANTS.PLAYER_JUMP_IMPULSE;
                }

                this.coyoteTime = 0;
            }
            else {
                let gravity = CONSTANTS.GRAVITY * dt;
                if (this.groundState === "wallrun") {
                    if (this.velocity.y < 0) {
                        gravity *= CONSTANTS.PLAYER_WALLRUN_UPWARD_GRAVITY_MULTIPLIER;
                    }
                    else {
                        gravity *= CONSTANTS.PLAYER_WALLRUN_DOWNWARD_GRAVITY_MULTIPLIER;
                    }
                }
                this.velocity.y += gravity;

                if (this.groundState === "wallrun") {
                    this.velocity.y = Math.min(
                        this.velocity.y, CONSTANTS.PLAYER_MAX_WALLRUN_FALL_SPEED
                    );
                }
                else if (this.groundState === "wallslide") {
                    this.velocity.y = Math.min(
                        this.velocity.y, CONSTANTS.PLAYER_MAX_WALL_SLIDE_SPEED
                    );
                }
                else {
                    this.velocity.y = Math.min(
                        this.velocity.y, CONSTANTS.PLAYER_MAX_FALL_SPEED
                    );
                }
            }
        }

        // apply delta time and move
        this.position.add(this.velocity.copy().mult(dt));
        this.collider.centerX = this.position.x;
        this.collider.centerY = this.position.y;
        this.hurtbox.centerX = this.position.x;
        this.hurtbox.centerY = this.position.y;

        // collide with walls
        if (this.groundState !== "wallrun") {
            this.groundState = "air"; // assume we're falling
        }
        const walls = Kepler.getTagged(EntityTag.WALL_COLLISION) as Wall[];
        for (const wall of walls) {
            // trans rights!
            const transVec = new Vector2D();
            // isColliding() sets a translation vector using a reference
            if (this.collider.isColliding(wall.collider, transVec)) {
                // console.log(transVec);
                this.position.add(transVec);
                this.collider.centerX = this.position.x;
                this.collider.centerY = this.position.y;  
                this.hurtbox.centerX = this.position.x;
                this.hurtbox.centerY = this.position.y;

                // cancel velocity and reset jumps and all that
                if (transVec.x !== 0) {
                    this.velocity.x = 0;
                    if (this.groundState !== "ground") {
                        this.groundState = "wallslide";
                        this.jumpState = "wallslide";
                        this.wallSide = (transVec.x < 0 ? "left" : "right");
                        this.facingAngle = this.wallSide;
                        this.coyoteTime = CONSTANTS.PLAYER_COYOTE_TIME;

                        if (CONSTANTS.PLAYER_WALLSLIDE_RECHARGES_LUNGE) {
                            this.canLunge = true;
                        }
                        if (CONSTANTS.PLAYER_WALLSLIDE_RECHARGES_WALLRUN) {
                            this.canWallrun = true;
                        }
                        if (CONSTANTS.PLAYER_WALLSLIDE_RECHARGES_DASH) {
                            this.canDash = true;
                        }
                    }
                    // if (this.dashing) {
                    //     this.dashTime = 0;
                    //     this.dashing = false;
                    //     this.velocity.y *= CONSTANTS.PLAYER_DASH_PRESERVED_VELOCITY;
                    // }
                }
                // a translation vector where both components are nonzero (or both components are
                // zero) *should* be impossible
                else {
                    this.velocity.y = 0;
                    // floor collision
                    if (transVec.y < 0) {
                        this.groundState = "ground";
                        this.jumpState = "ground";
                        this.coyoteTime = CONSTANTS.PLAYER_COYOTE_TIME;
                        this.canLunge = true;
                        this.canWallrun = true;
                        this.canDash = true;
                    }
                    // if (this.dashing) {
                    //     this.dashTime = 0;
                    //     this.dashing = false;
                    //     this.velocity.x *= CONSTANTS.PLAYER_DASH_PRESERVED_VELOCITY;
                    // }
                }
            }
        }

        // final camera update
        Kepler.setCameraTarget(this.position);

        // update timers
        this.coyoteTime -= dt;
    }

    // called when the player is killed
    onDeath() {
        this.velocity.set(0, 0);
        this.position.set(Globals.playerSpawn);
        // TODO: reset game back to where it was when the player last hit a checkpoint
    }
}

/* ----- end of file ----- */