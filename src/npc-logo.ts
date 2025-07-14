/* ----- src/npc-logo.ts ----- */

/** Draws my personal logo. Returns `true` if the animation is finished. */
const drawNpcLogo: (p5: p5) => boolean = (()=>{
    const LOGO_COLORS = {
        // happy pride! technically these aren't the "true" colors, but they're close enough and
        // they look better
        BI_PINK: "#d60270",
        BI_PURPLE: "#9b4f96",
        BI_BLUE: "#1250cc",
        BACKGROUND: "#352a55",
        TEXT: "#ffffff"
    };

    // internal constants
    let t = 0;
    const line1Times = [0, 0, 0];
    const line2Times = [0, 0, 0, 0, 0, 0];
    const line3Times = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    let animationState = 0;

    function drawN(x: number, y: number, time: number, p5: p5) {
        const leftLength = p5.lerp(24, -20, p5.constrain(time, 0, 16) / 16);
        const arc1Angle = p5.lerp(0, 168, p5.constrain(time - 16, 0, 6) / 6);
        const middleX = p5.lerp(-5, 5, p5.constrain(time - 22, 0, 16) / 16);
        const middleY = p5.lerp(-21, 21, p5.constrain(time - 22, 0, 16) / 16);
        const arc2Angle = p5.lerp(168, 0, p5.constrain(time - 38, 0, 6) / 6);
        const rightLength = p5.lerp(20, -24, p5.constrain(time - 44, 0, 16) / 16);
        if (time > 0) {
            p5.line(x - 15, y + leftLength, x - 15, y + 24);
        }
        if (time > 16) {
            p5.arc(x - 10, y - 20, 10, 10, -180, -180 + arc1Angle);
        }
        if (time > 22) {
            p5.line(x - 5, y - 21, x + middleX, y + middleY);
        }
        if (time > 38) {
            p5.arc(x + 10, y + 20, 10, 10, arc2Angle, 168);
        }
        if (time > 44) {
            p5.line(x + 15, y + rightLength, x + 15, y + 20);
        }
    }
    function drawP(x: number, y: number, time: number, p5: p5) {
        const leftLength = p5.lerp(25, -25, p5.constrain(time, 0, 26) / 26);
        const topWidth = p5.lerp(-15, -5, p5.constrain(time - 26, 0, 6) / 6);
        const arc2Angle = p5.lerp(-90, 90, p5.constrain(time - 32, 0, 24) / 24);
        const bottomWidth = p5.lerp(-5, -15, p5.constrain(time - 56, 0, 4) / 4);
        if (time > 0) {
            p5.line(x - 15, y + 25, x - 15, y + leftLength);
        }
        if (time > 28) {
            p5.line(x - 15, y - 25, x + topWidth, y - 25);
        }
        if (time > 32) {
            p5.arc(x - 5, y - 11.5, 27, 27, -90, arc2Angle);
        }
        if (time > 56) {
            p5.line(x + bottomWidth, y + 2, x - 5, y + 2);
        }
    }
    function drawC(x: number, y: number, time: number, p5: p5) {
        const arcAngle = p5.lerp(45, 315, p5.constrain(time, 0, 60) / 60);
        if (time > 0) {
            p5.arc(x + 6, y, 42, 50, 45, arcAngle);
        }
    }
    function drawO(x: number, y: number, time: number, p5: p5) {
        const arcAngle = p5.lerp(90, 450, p5.constrain(time, 0, 60) / 60);
        if (time > 0) {
            p5.arc(x + 6, y, 42, 50, 90, arcAngle);
        }
    }
    function drawL(x: number, y: number, time: number, p5: p5) {
        const leftLength = p5.lerp(-25, 15, p5.constrain(time, 0, 36) / 36);
        const arcAngle = p5.lerp(180, 90, p5.constrain(time - 36, 0, 12) / 12);
        const bottomWidth = p5.lerp(-7, 5, p5.constrain(time - 48, 0, 12)/ 12);
        if (time > 0) {
            p5.line(x - 15, y + leftLength, x - 15, y - 25);
        }
        if (time > 36) {
            p5.arc(x - 7, y + 17, 16, 16, arcAngle, 180);
        }
        if (time > 48) {
            p5.line(x - 7, y + 25, x + bottomWidth, y + 25);
        }
    }
    function drawA(x: number, y: number, time: number, p5: p5) {
        const leftX = p5.lerp(-18, -6, p5.constrain(time, 0, 24) / 24);
        const leftY = p5.lerp(25, -22, p5.constrain(time, 0, 24) / 24);
        const arcAngle = p5.lerp(200, 350, p5.constrain(time - 24, 0, 12) / 12);
        const rightX = p5.lerp(6, 18, p5.constrain(time - 36, 0, 24) / 24);
        const rightY = p5.lerp(-22, 25, p5.constrain(time - 36, 0, 24) / 24);
        const barLength = p5.lerp(-10, 10, p5.constrain(time - 12, 0, 36) / 36);
        if (time > 0) {
            p5.line(x - 18, y + 25, x + leftX, y + leftY);
        }
        if (time > 24) {
            p5.arc(x, y - 20, 12, 12, 200, arcAngle);
        }
        if (time > 36) {
            p5.line(x + 6, y - 22, x + rightX, y + rightY);
        }
        if (time > 12) {
            p5.line(x - 10, y + 3, x + barLength, y + 3);
        }
    }
    function drawY(x: number, y: number, time: number, p5: p5) {
        const leftX = p5.lerp(-15, -6, p5.constrain(time, 0, 24) / 24);
        const leftY = p5.lerp(-25, -3, p5.constrain(time, 0, 24) / 24);
        const arcAngle = p5.lerp(155, 25, p5.constrain(time - 24, 0, 12) / 12);
        const rightX = p5.lerp(6, 15, p5.constrain(time - 36, 0, 24) / 24);
        const rightY = p5.lerp(-3, -25, p5.constrain(time - 36, 0, 24) / 24);
        const barLength = p5.lerp(1, 25, p5.constrain(time - 30, 0, 30) / 30);
        if (time > 0) {
            p5.line(x - 15, y - 25, x + leftX, y + leftY);
        }
        if (time > 24) {
            p5.arc(x, y - 5, 12, 12, arcAngle, 155);
        }
        if (time > 36) {
            p5.line(x + rightX, y + rightY, x + 6, y - 3);
        }
        if (time > 30) {
            p5.line(x, y + 1, x, y + barLength);
        }
    }
    function drawE(x: number, y: number, time: number, p5: p5) {
        const topLength = p5.lerp(10, -5, p5.constrain(time, 0, 10) / 10);
        const arc1Angle = p5.lerp(270, 180, p5.constrain(time - 10, 0, 10) / 10);
        const leftLength = p5.lerp(-15, 15, p5.constrain(time - 20, 0, 20) / 20);
        const arc2Angle = p5.lerp(180, 90, p5.constrain(time - 40, 0, 10) / 10);
        const bottomLength = p5.lerp(-5, 10, p5.constrain(time - 50, 0, 10) / 10);
        const middleLength = p5.lerp(-15, 10, p5.constrain(time - 30, 0, 30) / 30);
        if (time > 0) {
            p5.line(x + topLength, y - 25, x + 10, y - 25);
        }
        if (time > 10) {
            p5.arc(x - 5, y - 15, 20, 20, arc1Angle, 270);
        }
        if (time > 20) {
            p5.line(x - 15, y - 15, x - 15, y + leftLength);
        }
        if (time > 40) {
            p5.arc(x - 5, y + 15, 20, 20, arc2Angle, 180);
        }
        if (time > 50) {
            p5.line(x - 5, y + 25, x + bottomLength, y + 25);
        }
        if (time > 30) {
            p5.line(x - 15, y, x + middleLength, y);
        }
    }
    function drawR(x: number, y: number, time: number, p5: p5) {
        const leftLength = p5.lerp(25, -25, p5.constrain(time, 0, 26) / 26);
        const topWidth = p5.lerp(-15, -5, p5.constrain(time - 26, 0, 6) / 6);
        const arc2Angle = p5.lerp(-90, 90, p5.constrain(time - 32, 0, 24) / 24);
        const bottomWidth = p5.lerp(-5, -15, p5.constrain(time - 56, 0, 4) / 4);
        const legX = p5.lerp(5, -5, p5.constrain(time - 26, 0, 30) / 30);
        const legY = p5.lerp(25, 0, p5.constrain(time - 26, 0, 30) / 30);
        if (time > 0) {
            p5.line(x - 15, y + 25, x - 15, y + leftLength);
        }
        if (time > 28) {
            p5.line(x - 15, y - 25, x + topWidth, y - 25);
        }
        if (time > 32) {
            p5.arc(x - 5, y - 12.5, 25, 25, -90, arc2Angle);
        }
        if (time > 56) {
            p5.line(x + bottomWidth, y, x - 5, y);
        }
        if (time > 26) {
            p5.line(x + legX, y + legY, x + 5, y + 25);
        }
    }
    function drawH(x: number, y: number, time: number, p5: p5) {
        const legLength = p5.lerp(-25, 25, p5.constrain(time, 0, 60) / 60);
        const barLength = p5.lerp(-14, 14, p5.constrain(time - 30, 0, 30) / 30);
        if (time > 0) {
            p5.line(x - 15, y - 25, x - 15, y + legLength);
            p5.line(x + 15, y - legLength, x + 15, y + 25);
        }
        if (time > 30) {
            p5.line(x - 14, y, x + barLength, y);
        }
    }
    function drawT(x: number, y: number, time: number, p5: p5) {
        const barLength = p5.lerp(-15, 15, p5.constrain(time - 30, 0, 30) / 30);
        const legLength = p5.lerp(-25, 25, p5.constrain(time, 0, 60) / 60);
        if (time > 30) {
            p5.line(x - 15, y - 25, x + barLength, y - 25);
        }
        if (time > 0) {
            p5.line(x, y +- 25, x, y + legLength);
        }
    }

    function easeIn(x: number) {
        const t = (x - 0) / 1;
        return (
            x <= 0 ? 0 :
            x >= 1 ? 60 :
            x <= 0.5 ? 2 * Math.pow(t, 2) * 60 + 0 :
            60 - Math.pow(-2 * t + 2, 2) / 2 * 60
        );
    }

    function easeOut(x: number) {
        const t = (x - 3) / 0.5;
        return (
            x <= 3 ? 60 :
            x >= 3.5 ? 0 :
            x <= 3.25 ? 2 * Math.pow(t, 2) * -60 + 60 :
            0 - Math.pow(-2 * t + 2, 2) / 2 * -60
        );
    }

    function getTime(t: number) {
        t = (t < 0 ? 0 : t > 210 ? 210 : t);
        if (t < 1) { return easeIn(t); }
        else if (t < 3) { return 60; }
        else if (t < 3.5) { return easeOut(t); }
        else { return 0; }
    }
        
    return (p5: p5) => {
        // native delta time is in milliseconds
        t += (p5.deltaTime / 1000) * 1.25;
        if (t > 4) {
            return true;
        }
        else if (t > 3) { animationState = 1; }
        if (animationState === 0) {
            for (let i = 0; i < line1Times.length; ++i) {
                line1Times[i] = getTime(t - i * 0.1);
            }
            for (let i = 0; i < line2Times.length; ++i) {
                line2Times[i] = getTime(t - 0.25 - i * 0.1);
            }
            for (let i = 0; i < line3Times.length; ++i) {
                line3Times[i] = getTime(t - 0.5 - i * 0.1);
            }
        }
        else {
            for (let i = 0; i < line1Times.length; ++i) {
                line1Times[i] = getTime(t);
            }
            for (let i = 0; i < line2Times.length; ++i) {
                line2Times[i] = getTime(t);
            }
            for (let i = 0; i < line3Times.length; ++i) {
                line3Times[i] = getTime(t);
            }
        }
        p5.angleMode("degrees");
        p5.background(LOGO_COLORS.BACKGROUND);
        p5.strokeWeight(6);
        p5.noFill();
        p5.stroke(LOGO_COLORS.BI_PINK);
        drawN(125, 225, line1Times[0], p5);
        p5.stroke(LOGO_COLORS.BI_PURPLE);
        drawP(125, 300, line2Times[0], p5);
        p5.stroke(LOGO_COLORS.BI_BLUE);
        drawC(125, 375, line3Times[0], p5);
        p5.strokeWeight(4);
        p5.stroke(LOGO_COLORS.TEXT);
        drawO(173, 225, line1Times[1], p5);
        drawN(232, 225, line1Times[2], p5);
        drawL(170, 300, line2Times[1], p5);
        drawA(210, 301, line2Times[2], p5);
        drawY(255, 300, line2Times[3], p5);
        drawE(300, 300, line2Times[4], p5);
        drawR(345, 300, line2Times[5], p5);
        drawH(180, 375, line3Times[1], p5);
        drawA(233, 375, line3Times[2], p5);
        drawR(285, 375, line3Times[3], p5);
        drawA(328, 375, line3Times[4], p5);
        drawC(375, 375, line3Times[5], p5);
        drawT(425, 375, line3Times[6], p5);
        drawE(470, 375, line3Times[7], p5);
        drawR(515, 375, line3Times[8], p5);
        p5.angleMode("radians");
        return false;
    };
})();

/* ----- end of file ----- */