/* ----- src/utils/gamepad-icons.ts ----- */
interface IGamepadIcon {
    width: number;
    height: number;
    render(rt: p5 | p5.Graphics, x: number, y: number, scale?: number): void;
}

// these are free to use with credit
const GAMEPAD_ICONS: { [key in GpIcon]: IGamepadIcon } = {
    [GpIcon.A]: {
        width: 80,
        height: 80,
        render(rt: p5 | p5.Graphics, x: number, y: number, scale: number=1) {
            rt.push();
            rt.translate(x, y);
            rt.scale(scale);
            
            rt.noStroke();
            rt.fill(26, 28, 44);
            rt.ellipse(0, 0, 80, 80);
            
            rt.fill(92, 232, 79);
            rt.beginShape();
            rt.vertex(-7.4, 12);
            rt.vertex(-10, 20);
            rt.vertex(-20, 20);
            rt.vertex(-4, -24);
            rt.vertex(4, -24);
            rt.vertex(20, 20);
            rt.vertex(10, 20);
            rt.vertex(7.4, 12);
            rt.endShape("close");
            
            rt.fill(26, 28, 44);
            rt.beginShape();
            rt.vertex(0, -12);
            rt.vertex(5.6, 4);
            rt.vertex(-5.6, 4);
            rt.endShape("close");
            
            rt.pop();
        }
    },
    [GpIcon.A_COLORLESS]: {
        width: 80,
        height: 80,
        render(rt: p5 | p5.Graphics, x: number, y: number, scale: number=1) {
            rt.push();
            rt.translate(x, y);
            rt.scale(scale);
            
            rt.noStroke();
            rt.fill(26, 28, 44);
            rt.ellipse(0, 0, 80, 80);
            
            rt.fill(255);
            rt.beginShape();
            rt.vertex(-7.4, 12);
            rt.vertex(-10, 20);
            rt.vertex(-20, 20);
            rt.vertex(-4, -24);
            rt.vertex(4, -24);
            rt.vertex(20, 20);
            rt.vertex(10, 20);
            rt.vertex(7.4, 12);
            rt.endShape("close");
            
            rt.fill(26, 28, 44);
            rt.beginShape();
            rt.vertex(0, -12);
            rt.vertex(5.6, 4);
            rt.vertex(-5.6, 4);
            rt.endShape("close");
            
            rt.pop();
        }
    },
    [GpIcon.B]: {
        width: 80,
        height: 80,
        render(rt: p5 | p5.Graphics, x: number, y: number, scale: number=1) {
            rt.push();
            rt.translate(x, y);
            rt.scale(scale);
            
            rt.noStroke();
            rt.fill(26, 28, 44);
            rt.ellipse(0, 0, 80, 80);
            
            rt.fill(250, 82, 102);
            rt.rect(-14, -24, 8, 48);
            rt.rect(-14, -24, 20, 8);
            rt.rect(-14, -4, 20, 8);
            rt.rect(-14, 16, 20, 8);
            rt.arc(5, -10, 28, 28, -90, 90);
            rt.arc(5, 10, 28, 28, -90, 90);
            
            rt.fill(26, 28, 44);
            rt.ellipse(5, -10, 12, 12);
            rt.ellipse(5, 10, 12, 12);
            
            rt.pop();
        }
    },
    [GpIcon.B_COLORLESS]: {
        width: 80,
        height: 80,
        render(rt: p5 | p5.Graphics, x: number, y: number, scale: number=1) {
            rt.push();
            rt.translate(x, y);
            rt.scale(scale);
            
            rt.noStroke();
            rt.fill(26, 28, 44);
            rt.ellipse(0, 0, 80, 80);
            
            rt.fill(255);
            rt.rect(-15, -24, 8, 48);
            rt.rect(-15, -24, 20, 8);
            rt.rect(-15, -4, 20, 8);
            rt.rect(-15, 16, 20, 8);
            rt.arc(5, -10, 28, 28, -90, 90);
            rt.arc(5, 10, 28, 28, -90, 90);
            
            rt.fill(26, 28, 44);
            rt.ellipse(5, -10, 12, 12);
            rt.ellipse(5, 10, 12, 12);
            
            rt.pop();
        }
    },
    [GpIcon.X]: {
        width: 80,
        height: 80,
        render(rt: p5 | p5.Graphics, x: number, y: number, scale: number=1) {
            rt.push();
            rt.translate(x, y);
            rt.scale(scale * 2); // easier than redoing the math
            
            rt.noStroke();
            rt.fill(26, 28, 44);
            rt.ellipse(0, 0, 40, 40);
            
            rt.noStroke();
            rt.fill(65, 166, 246);
            rt.beginShape();
            rt.vertex(-10, -12);
            rt.vertex(-5, -12);
            rt.vertex(0, -4);
            rt.vertex(5, -12);
            rt.vertex(10, -12);
            rt.vertex(3, 0);
            rt.vertex(10, 12);
            rt.vertex(5, 12);
            rt.vertex(0, 4);
            rt.vertex(-5, 12);
            rt.vertex(-10, 12);
            rt.vertex(-3, 0);
            rt.endShape("close");
            
            rt.pop();
        }
    },
    [GpIcon.X_COLORLESS]: {
        width: 80,
        height: 80,
        render(rt: p5 | p5.Graphics, x: number, y: number, scale: number=1) {
            rt.push();
            rt.translate(x, y);
            rt.scale(scale * 2); // easier than redoing the math
            
            rt.noStroke();
            rt.fill(26, 28, 44);
            rt.ellipse(0, 0, 40, 40);
            
            rt.noStroke();
            rt.fill(255);
            rt.beginShape();
            rt.vertex(-10, -12);
            rt.vertex(-5, -12);
            rt.vertex(0, -4);
            rt.vertex(5, -12);
            rt.vertex(10, -12);
            rt.vertex(3, 0);
            rt.vertex(10, 12);
            rt.vertex(5, 12);
            rt.vertex(0, 4);
            rt.vertex(-5, 12);
            rt.vertex(-10, 12);
            rt.vertex(-3, 0);
            rt.endShape("close");
            
            rt.pop();
        }
    },
    [GpIcon.Y]: {
        width: 80,
        height: 80,
        render(rt: p5 | p5.Graphics, x: number, y: number, scale: number=1) {
            rt.push();
            rt.translate(x, y);
            rt.scale(scale);
            
            rt.noStroke();
            rt.fill(26, 28, 44);
            rt.ellipse(0, 0, 80, 80);
            
            rt.noStroke();
            rt.fill(255, 205, 117);
            rt.beginShape();
            rt.vertex(-21, -22);
            rt.vertex(-11, -22);
            rt.vertex(0, -5);
            rt.vertex(11, -22);
            rt.vertex(21, -22);
            rt.vertex(4, 5);
            rt.vertex(4, 26);
            rt.vertex(-4, 26);
            rt.vertex(-4, 5);
            rt.endShape("close");
            
            rt.pop();
        }
    },
    [GpIcon.Y_COLORLESS]: {
        width: 80,
        height: 80,
        render(rt: p5 | p5.Graphics, x: number, y: number, scale: number=1) {
            rt.push();
            rt.translate(x, y);
            rt.scale(scale);
            
            rt.noStroke();
            rt.fill(26, 28, 44);
            rt.ellipse(0, 0, 80, 80);
            
            rt.noStroke();
            rt.fill(255);
            rt.beginShape();
            rt.vertex(-21, -22);
            rt.vertex(-11, -22);
            rt.vertex(0, -5);
            rt.vertex(11, -22);
            rt.vertex(21, -22);
            rt.vertex(4, 5);
            rt.vertex(4, 26);
            rt.vertex(-4, 26);
            rt.vertex(-4, 5);
            rt.endShape("close");
            
            rt.pop();
        }
    },
    [GpIcon.DPAD_NONE]: {
        width: 90,
        height: 90,
        render(rt: p5 | p5.Graphics, x: number, y: number, scale: number=1) {
            rt.push();
            rt.translate(x, y);
            rt.scale(scale * 0.75); // easier than redoing the math
            
            rt.noFill();
            rt.stroke(26, 28, 44);
            rt.strokeWeight(4);
            rt.arc(8, 46, 24, 24, 0, 90);
            rt.arc(-8, 46, 24, 24, 90, 180);
            rt.arc(-8, -46, 24, 24, 180, 270);
            rt.arc(8, -46, 24, 24, 270, 360);
            rt.arc(46, 8, 24, 24, 0, 90);
            rt.arc(-46, 8, 24, 24, 90, 180);
            rt.arc(-46, -8, 24, 24, 180, 270);
            rt.arc(46, -8, 24, 24, 270, 360);
            
            rt.line(-8, -58, 8, -58);
            rt.line(-8, 58, 8, 58);
            rt.line(-58, -8, -58, 8);
            rt.line(58, -8, 58, 8);
            
            rt.line(-20, -46, -20, -20);
            rt.line(20, -46, 20, -20);
            rt.line(-20, 46, -20, 20);
            rt.line(20, 46, 20, 20);
            rt.line(-46, -20, -20, -20);
            rt.line(46, -20, 20, -20);
            rt.line(-46, 20, -20, 20);
            rt.line(46, 20, 20, 20);
            rt.pop();
        }
    },
    [GpIcon.DPAD_UP]: {
        width: 90,
        height: 90,
        render(rt: p5 | p5.Graphics, x: number, y: number, scale: number=1) {
            rt.push();
            rt.translate(x, y);
            rt.scale(scale * 0.75); // easier than redoing the math
            
            rt.noStroke();
            rt.fill(26, 28, 44);
            // if you call rt.rect() with 8 parameters, the last
            // 4 specify the radius of each corner individually
            rt.rect(-22, -60, 44, 42, 15, 15, 0, 0);
            
            rt.stroke(26, 28, 44);
            rt.strokeWeight(4);
            rt.noFill();
            rt.arc(8, 46, 24, 24, 0, 90);
            rt.arc(-8, 46, 24, 24, 90, 180);
            rt.arc(46, 8, 24, 24, 0, 90);
            rt.arc(-46, 8, 24, 24, 90, 180);
            rt.arc(-46, -8, 24, 24, 180, 270);
            rt.arc(46, -8, 24, 24, 270, 360);
            
            rt.line(-8, 58, 8, 58);
            rt.line(-58, -8, -58, 8);
            rt.line(58, -8, 58, 8);
            
            rt.line(-20, 46, -20, 20);
            rt.line(20, 46, 20, 20);
            rt.line(-46, -20, -20, -20);
            rt.line(46, -20, 20, -20);
            rt.line(-46, 20, -20, 20);
            rt.line(46, 20, 20, 20);
            rt.pop();
        }
    },
    [GpIcon.DPAD_DOWN]: {
        width: 90,
        height: 90,
        render(rt: p5 | p5.Graphics, x: number, y: number, scale: number=1) {
            rt.push();
            rt.translate(x, y);
            rt.scale(scale * 0.75); // easier than redoing the math
            
            rt.noStroke();
            rt.fill(26, 28, 44);
            rt.rect(-22, 18, 44, 42, 0, 0, 15, 15);
            
            rt.stroke(26, 28, 44);
            rt.strokeWeight(6);
            rt.noFill();
            rt.arc(-8, -46, 24, 24, 180, 270);
            rt.arc(8, -46, 24, 24, 270, 360);
            rt.arc(46, 8, 24, 24, 0, 90);
            rt.arc(-46, 8, 24, 24, 90, 180);
            rt.arc(-46, -8, 24, 24, 180, 270);
            rt.arc(46, -8, 24, 24, 270, 360);
            
            rt.line(-8, -58, 8, -58);
            rt.line(-58, -8, -58, 8);
            rt.line(58, -8, 58, 8);
            
            rt.line(-20, -46, -20, -20);
            rt.line(20, -46, 20, -20);
            rt.line(-46, -20, -20, -20);
            rt.line(46, -20, 20, -20);
            rt.line(-46, 20, -20, 20);
            rt.line(46, 20, 20, 20);
            rt.pop();
        },
    },
    [GpIcon.DPAD_LEFT]: {
        width: 90,
        height: 90,
        render(rt: p5 | p5.Graphics, x: number, y: number, scale: number=1) {
            rt.push();
            rt.translate(x, y);
            rt.scale(scale * 0.75); // easier than redoing the math
            
            rt.noStroke();
            rt.fill(26, 28, 44);
            rt.rect(-60, -22, 42, 44, 15, 0, 0, 15);
            
            rt.stroke(26, 28, 44);
            rt.strokeWeight(4);
            rt.noFill();
            rt.arc(8, 46, 24, 24, 0, 90);
            rt.arc(-8, 46, 24, 24, 90, 180);
            rt.arc(-8, -46, 24, 24, 180, 270);
            rt.arc(8, -46, 24, 24, 270, 360);
            rt.arc(46, 8, 24, 24, 0, 90);
            rt.arc(46, -8, 24, 24, 270, 360);
            
            rt.line(-8, -58, 8, -58);
            rt.line(-8, 58, 8, 58);
            rt.line(58, -8, 58, 8);
            
            rt.line(-20, -46, -20, -20);
            rt.line(20, -46, 20, -20);
            rt.line(-20, 46, -20, 20);
            rt.line(20, 46, 20, 20);
            rt.line(46, -20, 20, -20);
            rt.line(46, 20, 20, 20);
            rt.pop();
        },
    },
    [GpIcon.DPAD_RIGHT]: {
        width: 90,
        height: 90,
        render(rt: p5 | p5.Graphics, x: number, y: number, scale: number=1) {
            rt.push();
            rt.translate(x, y);
            rt.scale(scale * 0.75); // easier than redoing the math
            
            rt.noStroke();
            rt.fill(26, 28, 44);
            rt.rect(18, -22, 42, 44, 0, 15, 15, 0);
            
            rt.stroke(26, 28, 44);
            rt.strokeWeight(4);
            rt.noFill();
            rt.arc(8, 46, 24, 24, 0, 90);
            rt.arc(-8, 46, 24, 24, 90, 180);
            rt.arc(-8, -46, 24, 24, 180, 270);
            rt.arc(8, -46, 24, 24, 270, 360);
            rt.arc(-46, 8, 24, 24, 90, 180);
            rt.arc(-46, -8, 24, 24, 180, 270);
            
            rt.line(-8, -58, 8, -58);
            rt.line(-8, 58, 8, 58);
            rt.line(-58, -8, -58, 8);
            
            rt.line(-20, -46, -20, -20);
            rt.line(20, -46, 20, -20);
            rt.line(-20, 46, -20, 20);
            rt.line(20, 46, 20, 20);
            rt.line(-46, -20, -20, -20);
            rt.line(-46, 20, -20, 20);
            rt.pop();
        }
    },
    [GpIcon.DPAD_VERTICAL]: {
        width: 90,
        height: 90,
        render(rt: p5 | p5.Graphics, x: number, y: number, scale: number=1) {
            rt.push();
            rt.translate(x, y);
            rt.scale(scale * 0.75); // easier than redoing the math
            
            rt.noStroke();
            rt.fill(26, 28, 44);
            rt.rect(-22, -60, 44, 42, 15, 15, 0, 0);
            rt.rect(-22, 18, 44, 42, 0, 0, 15, 15);
            
            rt.stroke(26, 28, 44);
            rt.strokeWeight(4);
            rt.noFill();
            rt.arc(46, 8, 24, 24, 0, 90);
            rt.arc(-46, 8, 24, 24, 90, 180);
            rt.arc(-46, -8, 24, 24, 180, 270);
            rt.arc(46, -8, 24, 24, 270, 360);
            
            rt.line(-58, -8, -58, 8);
            rt.line(58, -8, 58, 8);
            
            rt.line(-46, -20, -20, -20);
            rt.line(46, -20, 20, -20);
            rt.line(-46, 20, -20, 20);
            rt.line(46, 20, 20, 20);
            rt.pop();
        }
    },
    [GpIcon.DPAD_HORIZONTAL]: {
        width: 90,
        height: 90,
        render(rt: p5 | p5.Graphics, x: number, y: number, scale: number=1) {
            rt.push();
            rt.translate(x, y);
            rt.scale(scale * 0.75); // easier than redoing the math
            
            rt.noStroke();
            rt.fill(26, 28, 44);
            rt.rect(-60, -22, 42, 44, 15, 0, 0, 15);
            rt.rect(18, -22, 42, 44, 0, 15, 15, 0);
            
            rt.stroke(26, 28, 44);
            rt.strokeWeight(4);
            rt.noFill();
            rt.arc(8, 46, 24, 24, 0, 90);
            rt.arc(-8, 46, 24, 24, 90, 180);
            rt.arc(-8, -46, 24, 24, 180, 270);
            rt.arc(8, -46, 24, 24, 270, 360);
            
            rt.line(-8, -58, 8, -58);
            rt.line(-8, 58, 8, 58);
            
            rt.line(-20, -46, -20, -20);
            rt.line(20, -46, 20, -20);
            rt.line(-20, 46, -20, 20);
            rt.line(20, 46, 20, 20);
            rt.pop();
        },
    },
    [GpIcon.DPAD_ALL]: {
        width: 90,
        height: 90,
        render(rt: p5 | p5.Graphics, x: number, y: number, scale: number=1) {
            rt.push();
            rt.translate(x, y);
            rt.scale(scale * 0.75); // easier than redoing the math
            
            rt.noStroke();
            rt.fill(26, 28, 44);
            rt.rect(-22, -60, 44, 120, 15);
            rt.rect(-60, -22, 120, 44, 15);
            rt.pop();
        }
    },
    [GpIcon.LEFT_BUMPER]: {
        width: 90,
        height: 60,
        render(rt: p5 | p5.Graphics, x: number, y: number, scale: number=1) {
            rt.push();
            rt.translate(x, y - 2);
            rt.scale(scale);
            
            rt.noStroke();
            rt.fill(26, 28, 44);
            rt.ellipse(-25, 12, 40, 40);
            rt.ellipse(25, 12, 40, 40);
            rt.ellipse(-35, -18, 20, 20);
            rt.ellipse(35, -11, 20, 20);
            rt.beginShape();
            rt.vertex(35, -21);
            rt.vertex(45, -10);
            rt.vertex(45, 12);
            rt.vertex(25, 32);
            rt.vertex(-25, 32);
            rt.vertex(-45, 15);
            rt.vertex(-45, -19);
            rt.vertex(-35, -28);
            rt.vertex(-2, -28);
            rt.vertex(8, -21);
            rt.endShape("close");
            
            rt.fill(255);
            rt.rect(-24, -10, 6, 32);
            rt.rect(-24, 16, 22, 6);
            
            rt.fill(255);
            rt.rect(2, -10, 6, 32);
            rt.rect(2, -10, 14, 6);
            rt.rect(2, 3, 14, 6);
            rt.rect(2, 16, 14, 6);
            
            rt.noFill();
            rt.stroke(255);
            rt.strokeWeight(6);
            rt.arc(16.5, -0.5, 13, 13, -90, 90);
            rt.arc(16.5, 12.5, 13, 13, -90, 90);
            rt.pop();
        }
    },
    [GpIcon.RIGHT_BUMPER]: {
        width: 90,
        height: 60,
        render(rt: p5 | p5.Graphics, x: number, y: number, scale: number=1) {
            rt.push();
            rt.translate(x, y - 2);
            rt.scale(scale);
            
            rt.noStroke();
            rt.fill(26, 28, 44);
            rt.ellipse(25, 12, 40, 40);
            rt.ellipse(-25, 12, 40, 40);
            rt.ellipse(35, -18, 20, 20);
            rt.ellipse(-35, -11, 20, 20);
            rt.beginShape();
            rt.vertex(-35, -21);
            rt.vertex(-45, -10);
            rt.vertex(-45, 12);
            rt.vertex(-25, 32);
            rt.vertex(25, 32);
            rt.vertex(45, 15);
            rt.vertex(45, -19);
            rt.vertex(35, -28);
            rt.vertex(2, -28);
            rt.vertex(-8, -21);
            rt.endShape("close");
            
            rt.noStroke();
            rt.fill(255);
            rt.rect(-26, -10, 6, 32);
            rt.rect(-26, -10, 14, 6);
            rt.rect(-26, 6, 14, 6);
            rt.beginShape();
            rt.vertex(-16, 10);
            rt.vertex(-10, 22);
            rt.vertex(-2, 22);
            rt.vertex(-8, 10);
            rt.endShape("close");
            rt.noFill();
            rt.stroke(255);
            rt.strokeWeight(6);
            rt.arc(-14, 1, 16, 16, -90, 90);
            
            rt.noStroke();
            rt.fill(255);
            rt.rect(4, -10, 6, 32);
            rt.rect(4, -10, 13, 6);
            rt.rect(4, 3, 13, 6);
            rt.rect(4, 16, 13, 6);
            
            rt.noFill();
            rt.stroke(255);
            rt.strokeWeight(6);
            rt.arc(17.5, -0.5, 13, 13, -90, 90);
            rt.arc(17.5, 12.5, 13, 13, -90, 90);
            rt.pop();
        }
    },
    [GpIcon.LEFT_TRIGGER]: {
        width: 90,
        height: 100,
        render(rt: p5 | p5.Graphics, x: number, y: number, scale: number=1) {
            rt.push();
            rt.translate(x, y);
            rt.scale(scale);
            
            rt.noStroke();
            rt.fill(26, 28, 44);
            rt.ellipse(33, -38, 24, 24);
            rt.ellipse(-33, -38, 24, 24);
            rt.ellipse(33, 38, 24, 24);
            rt.ellipse(0, 20, 60, 60);
            rt.beginShape();
            rt.vertex(45, -38);
            rt.vertex(33, -50);
            rt.vertex(-33, -50);
            rt.vertex(-45, -38);
            rt.vertex(-30, 25);
            rt.vertex(0, 50);
            rt.vertex(33, 50);
            rt.vertex(45, 38);
            rt.endShape("close");
            
            rt.fill(255);
            rt.rect(-16, -16, 6, 32);
            rt.rect(-16, 10, 22, 6);
            
            rt.rect(17, -16, 6, 32);
            rt.rect(8, -16, 24, 6);
            rt.pop();
        }
    },
    [GpIcon.RIGHT_TRIGGER]: {
        width: 90,
        height: 100,
        render(rt: p5 | p5.Graphics, x: number, y: number, scale: number=1) {
            rt.push();
            rt.translate(x, y);
            rt.scale(scale);
            
            rt.noStroke();
            rt.fill(26, 28, 44);
            rt.ellipse(-33, -38, 24, 24);
            rt.ellipse(33, -38, 24, 24);
            rt.ellipse(-33, 38, 24, 24);
            rt.ellipse(0, 20, 60, 60);
            rt.beginShape();
            rt.vertex(-45, -38);
            rt.vertex(-33, -50);
            rt.vertex(33, -50);
            rt.vertex(45, -38);
            rt.vertex(30, 25);
            rt.vertex(0, 50);
            rt.vertex(-33, 50);
            rt.vertex(-45, 38);
            rt.endShape("close");
            
            rt.noStroke();
            rt.fill(255);
            rt.rect(-32, -16, 6, 32);
            rt.rect(-32, -16, 14, 6);
            rt.rect(-32, 0, 14, 6);
            rt.beginShape();
            rt.vertex(-22, 4);
            rt.vertex(-16, 16);
            rt.vertex(-8, 16);
            rt.vertex(-14, 4);
            rt.endShape("close");
            rt.noFill();
            rt.stroke(255);
            rt.strokeWeight(6);
            rt.arc(-18, -5, 16, 16, -90, 90);
            
            rt.noStroke();
            rt.fill(255);
            rt.rect(9, -16, 6, 32);
            rt.rect(0, -16, 24, 6);
            rt.pop();
        }
    },
    [GpIcon.LEFT_STICK_CLICK]: {
        width: 60,
        height: 60,
        render(rt: p5 | p5.Graphics, x: number, y: number, scale: number=1) {
            rt.push();
            rt.translate(x, y - 2);
            rt.scale(scale);
            
            rt.noStroke();
            rt.fill(26, 28, 44);
            rt.rect(-15, 18, 30, 12);
            rt.rect(-30, 6, 60, 12, 6);
            
            rt.fill(255);
            rt.triangle(0, 22, -12, 12, 12, 12);
            
            rt.fill(26, 28, 44);
            rt.rect(-11, -30, 6, 32);
            rt.rect(-11, -4, 22, 6);
            rt.pop();
        }
    },
    [GpIcon.RIGHT_STICK_CLICK]: {
        width: 60,
        height: 60,
        render(rt: p5 | p5.Graphics, x: number, y: number, scale: number=1) {
            rt.push();
            rt.translate(x, y - 2);
            rt.scale(scale);
            
            rt.noStroke();
            rt.fill(26, 28, 44);
            rt.rect(-15, 18, 30, 12);
            rt.rect(-30, 6, 60, 12, 6);
            
            rt.fill(255);
            rt.triangle(0, 22, -12, 12, 12, 12);
            
            // rt.fill(255, 0, 0);
            // rt.rect(-24, -10, 6, 32);
            // rt.rect(-24, 16, 22, 6);
            
            rt.noStroke();
            rt.fill(26, 28, 44);
            rt.rect(-12, -30, 6, 32);
            rt.rect(-12, -30, 14, 6);
            rt.rect(-12, -14, 14, 6);
            rt.beginShape();
            rt.vertex(-2, -10);
            rt.vertex(4, 2);
            rt.vertex(12, 2);
            rt.vertex(6, -10);
            rt.endShape("close");
            rt.noFill();
            rt.stroke(26, 28, 44);
            rt.strokeWeight(6);
            rt.arc(0, -19, 16, 16, -90, 90);
            rt.pop();
        }
    },
    [GpIcon.LEFT_STICK_NONE]: {
        width: 70,
        height: 70,
        render(rt: p5 | p5.Graphics, x: number, y: number, scale: number=1) {
            rt.push();
            rt.translate(x, y);
            rt.scale(scale);
            
            rt.noStroke();
            rt.fill(26, 28, 44);
            rt.ellipse(0, 0, 70, 70);
            
            rt.noFill();
            rt.stroke(255);
            rt.strokeWeight(2);
            rt.ellipse(0, 0, 58, 58);
            
            rt.noStroke();
            rt.fill(255);
            rt.rect(-10, -16, 6, 32);
            rt.rect(-10, 10, 22, 6);
            rt.pop();
        }
    },
    [GpIcon.LEFT_STICK_UP]: {
        width: 70,
        height: 90,
        render(rt: p5 | p5.Graphics, x: number, y: number, scale: number=1) {
            rt.push();
            rt.translate(x, y);
            rt.scale(scale);
            
            rt.noStroke();
            rt.fill(26, 28, 44);
            rt.ellipse(0, 0, 70, 70);
            
            rt.triangle(0, -55, 15, -41, -15, -41);
            
            rt.noFill();
            rt.stroke(255);
            rt.strokeWeight(2);
            rt.ellipse(0, 0, 58, 58);
            
            rt.noStroke();
            rt.fill(255);
            rt.rect(-10, -16, 6, 32);
            rt.rect(-10, 10, 22, 6);
            rt.pop();
        }
    },
    [GpIcon.LEFT_STICK_DOWN]: {
        width: 70,
        height: 90,
        render(rt: p5 | p5.Graphics, x: number, y: number, scale: number=1) {
            rt.push();
            rt.translate(x, y);
            rt.scale(scale);
            
            rt.noStroke();
            rt.fill(26, 28, 44);
            rt.ellipse(0, 0, 70, 70);
            
            rt.triangle(0, 55, 15, 41, -15, 41);
            
            rt.noFill();
            rt.stroke(255);
            rt.strokeWeight(2);
            rt.ellipse(0, 0, 58, 58);
            
            rt.noStroke();
            rt.fill(255);
            rt.rect(-10, -16, 6, 32);
            rt.rect(-10, 10, 22, 6);
            rt.pop();
        }
    },
    [GpIcon.LEFT_STICK_LEFT]: {
        width: 90,
        height: 70,
        render(rt: p5 | p5.Graphics, x: number, y: number, scale: number=1) {
            rt.push();
            rt.translate(x, y);
            rt.scale(scale);
            
            rt.noStroke();
            rt.fill(26, 28, 44);
            rt.ellipse(0, 0, 70, 70);
            
            rt.triangle(-55, 0, -41, 15, -41, -15);
            
            rt.noFill();
            rt.stroke(255);
            rt.strokeWeight(2);
            rt.ellipse(0, 0, 58, 58);
            
            rt.noStroke();
            rt.fill(255);
            rt.rect(-10, -16, 6, 32);
            rt.rect(-10, 10, 22, 6);
            rt.pop();
        }
    },
    [GpIcon.LEFT_STICK_RIGHT]: {
        width: 90,
        height: 70,
        render(rt: p5 | p5.Graphics, x: number, y: number, scale: number=1) {
            rt.push();
            rt.translate(x, y);
            rt.scale(scale);
            
            rt.noStroke();
            rt.fill(26, 28, 44);
            rt.ellipse(0, 0, 70, 70);
            
            rt.triangle(55, 0, 41, 15, 41, -15);
            
            rt.noFill();
            rt.stroke(255);
            rt.strokeWeight(2);
            rt.ellipse(0, 0, 58, 58);
            
            rt.noStroke();
            rt.fill(255);
            rt.rect(-10, -16, 6, 32);
            rt.rect(-10, 10, 22, 6);
            rt.pop();
        }
    },
    [GpIcon.LEFT_STICK_VERTICAL]: {
        width: 70,
        height: 110,
        render(rt: p5 | p5.Graphics, x: number, y: number, scale: number=1) {
            rt.push();
            rt.translate(x, y);
            rt.scale(scale);
            
            rt.noStroke();
            rt.fill(26, 28, 44);
            rt.ellipse(0, 0, 70, 70);
            
            rt.triangle(0, -55, 15, -41, -15, -41);
            rt.triangle(0, 55, 15, 41, -15, 41);
            
            rt.noFill();
            rt.stroke(255);
            rt.strokeWeight(2);
            rt.ellipse(0, 0, 58, 58);
            
            rt.noStroke();
            rt.fill(255);
            rt.rect(-10, -16, 6, 32);
            rt.rect(-10, 10, 22, 6);
            rt.pop();
        }
    },
    [GpIcon.LEFT_STICK_HORIZONTAL]: {
        width: 110,
        height: 90,
        render(rt: p5 | p5.Graphics, x: number, y: number, scale: number=1) {
            rt.push();
            rt.translate(x, y);
            rt.scale(scale);
            
            rt.noStroke();
            rt.fill(26, 28, 44);
            rt.ellipse(0, 0, 70, 70);
            
            rt.triangle(-55, 0, -41, 15, -41, -15);
            rt.triangle(55, 0, 41, 15, 41, -15);
            
            rt.noFill();
            rt.stroke(255);
            rt.strokeWeight(2);
            rt.ellipse(0, 0, 58, 58);
            
            rt.noStroke();
            rt.fill(255);
            rt.rect(-10, -16, 6, 32);
            rt.rect(-10, 10, 22, 6);
            rt.pop();
        }
    },
    [GpIcon.LEFT_STICK_ALL]: {
        width: 110,
        height: 110,
        render(rt: p5 | p5.Graphics, x: number, y: number, scale: number=1) {
            rt.push();
            rt.translate(x, y);
            rt.scale(scale);
            
            rt.noStroke();
            rt.fill(26, 28, 44);
            rt.ellipse(0, 0, 70, 70);
            
            rt.triangle(0, -55, 15, -41, -15, -41);
            rt.triangle(0, 55, 15, 41, -15, 41);
            rt.triangle(-55, 0, -41, 15, -41, -15);
            rt.triangle(55, 0, 41, 15, 41, -15);
            
            rt.noFill();
            rt.stroke(255);
            rt.strokeWeight(2);
            rt.ellipse(0, 0, 58, 58);
            
            rt.noStroke();
            rt.fill(255);
            rt.rect(-10, -16, 6, 32);
            rt.rect(-10, 10, 22, 6);
            rt.pop();
        }
    },
    [GpIcon.RIGHT_STICK_NONE]: {
        width: 70,
        height: 70,
        render(rt: p5 | p5.Graphics, x: number, y: number, scale: number=1) {
            rt.push();
            rt.translate(x, y);
            rt.scale(scale);
            
            rt.noStroke();
            rt.fill(26, 28, 44);
            rt.ellipse(0, 0, 70, 70);
            
            rt.noFill();
            rt.stroke(255);
            rt.strokeWeight(2);
            rt.ellipse(0, 0, 58, 58);
            
            rt.scale(0.75); // easier than redoing all the math
            rt.noStroke();
            rt.fill(255);
            rt.rect(-18, -24, 8, 48);
            rt.rect(-17, -24, 19, 8);
            rt.rect(-17, 0, 19, 8);
            rt.beginShape();
            rt.vertex(-3, 0);
            rt.vertex(8, 24);
            rt.vertex(18, 24);
            rt.vertex(7, 0);
            rt.endShape("close");
            
            rt.noFill();
            rt.stroke(255);
            rt.strokeWeight(8);
            rt.arc(2, -8, 24, 24, -90, 90);
            rt.pop();
        }
    },
    [GpIcon.RIGHT_STICK_UP]: {
        width: 70,
        height: 90,
        render(rt: p5 | p5.Graphics, x: number, y: number, scale: number=1) {
            rt.push();
            rt.translate(x, y);
            rt.scale(scale);
            
            rt.noStroke();
            rt.fill(26, 28, 44);
            rt.ellipse(0, 0, 70, 70);
            
            rt.triangle(0, -55, 15, -41, -15, -41);
            
            rt.noFill();
            rt.stroke(255);
            rt.strokeWeight(2);
            rt.ellipse(0, 0, 58, 58);
            
            rt.scale(0.75); // easier than redoing all the math
            rt.noStroke();
            rt.fill(255);
            rt.rect(-18, -24, 8, 48);
            rt.rect(-17, -24, 19, 8);
            rt.rect(-17, 0, 19, 8);
            rt.beginShape();
            rt.vertex(-3, 0);
            rt.vertex(8, 24);
            rt.vertex(18, 24);
            rt.vertex(7, 0);
            rt.endShape("close");
            
            rt.noFill();
            rt.stroke(255);
            rt.strokeWeight(8);
            rt.arc(2, -8, 24, 24, -90, 90);
            rt.pop();
        }
    },
    [GpIcon.RIGHT_STICK_DOWN]: {
        width: 70,
        height: 90,
        render(rt: p5 | p5.Graphics, x: number, y: number, scale: number=1) {
            rt.push();
            rt.translate(x, y);
            rt.scale(scale);
            
            rt.noStroke();
            rt.fill(26, 28, 44);
            rt.ellipse(0, 0, 70, 70);
            
            rt.triangle(0, 55, 15, 41, -15, 41);
            
            rt.noFill();
            rt.stroke(255);
            rt.strokeWeight(2);
            rt.ellipse(0, 0, 58, 58);
            
            rt.scale(0.75); // easier than redoing all the math
            rt.noStroke();
            rt.fill(255);
            rt.rect(-18, -24, 8, 48);
            rt.rect(-17, -24, 19, 8);
            rt.rect(-17, 0, 19, 8);
            rt.beginShape();
            rt.vertex(-3, 0);
            rt.vertex(8, 24);
            rt.vertex(18, 24);
            rt.vertex(7, 0);
            rt.endShape("close");
            
            rt.noFill();
            rt.stroke(255);
            rt.strokeWeight(8);
            rt.arc(2, -8, 24, 24, -90, 90);
        rt.pop();
        }
    },
    [GpIcon.RIGHT_STICK_LEFT]: {
        width: 90,
        height: 70,
        render(rt: p5 | p5.Graphics, x: number, y: number, scale: number=1) {
            rt.push();
            rt.translate(x, y);
            rt.scale(scale);
            
            rt.noStroke();
            rt.fill(26, 28, 44);
            rt.ellipse(0, 0, 70, 70);
            
            rt.triangle(-55, 0, -41, 15, -41, -15);
            
            rt.noFill();
            rt.stroke(255);
            rt.strokeWeight(2);
            rt.ellipse(0, 0, 58, 58);
            
            rt.scale(0.75); // easier than redoing all the math
            rt.noStroke();
            rt.fill(255);
            rt.rect(-18, -24, 8, 48);
            rt.rect(-17, -24, 19, 8);
            rt.rect(-17, 0, 19, 8);
            rt.beginShape();
            rt.vertex(-3, 0);
            rt.vertex(8, 24);
            rt.vertex(18, 24);
            rt.vertex(7, 0);
            rt.endShape("close");
            
            rt.noFill();
            rt.stroke(255);
            rt.strokeWeight(8);
            rt.arc(2, -8, 24, 24, -90, 90);
            rt.pop();
        }
    },
    [GpIcon.RIGHT_STICK_RIGHT]: {
        width: 90,
        height: 70,
        render(rt: p5 | p5.Graphics, x: number, y: number, scale: number=1) {
            rt.push();
            rt.translate(x, y);
            rt.scale(scale);
            
            rt.noStroke();
            rt.fill(26, 28, 44);
            rt.ellipse(0, 0, 70, 70);
            
            rt.triangle(55, 0, 41, 15, 41, -15);
            
            rt.noFill();
            rt.stroke(255);
            rt.strokeWeight(2);
            rt.ellipse(0, 0, 58, 58);
            
            rt.scale(0.75); // easier than redoing all the math
            rt.noStroke();
            rt.fill(255);
            rt.rect(-18, -24, 8, 48);
            rt.rect(-17, -24, 19, 8);
            rt.rect(-17, 0, 19, 8);
            rt.beginShape();
            rt.vertex(-3, 0);
            rt.vertex(8, 24);
            rt.vertex(18, 24);
            rt.vertex(7, 0);
            rt.endShape("close");
            
            rt.noFill();
            rt.stroke(255);
            rt.strokeWeight(8);
            rt.arc(2, -8, 24, 24, -90, 90);
            rt.pop();
        }
    },
    [GpIcon.RIGHT_STICK_VERTICAL]: {
        width: 70,
        height: 110,
        render(rt: p5 | p5.Graphics, x: number, y: number, scale: number=1) {
            rt.push();
            rt.translate(x, y);
            rt.scale(scale);
            
            rt.noStroke();
            rt.fill(26, 28, 44);
            rt.ellipse(0, 0, 70, 70);
            
            rt.triangle(0, -55, 15, -41, -15, -41);
            rt.triangle(0, 55, 15, 41, -15, 41);
            
            rt.noFill();
            rt.stroke(255);
            rt.strokeWeight(2);
            rt.ellipse(0, 0, 58, 58);
            
            rt.scale(0.75); // easier than redoing all the math
            rt.noStroke();
            rt.fill(255);
            rt.rect(-18, -24, 8, 48);
            rt.rect(-17, -24, 19, 8);
            rt.rect(-17, 0, 19, 8);
            rt.beginShape();
            rt.vertex(-3, 0);
            rt.vertex(8, 24);
            rt.vertex(18, 24);
            rt.vertex(7, 0);
            rt.endShape("close");
            
            rt.noFill();
            rt.stroke(255);
            rt.strokeWeight(8);
            rt.arc(2, -8, 24, 24, -90, 90);
            rt.pop();
        }
    },
    [GpIcon.RIGHT_STICK_HORIZONTAL]: {
        width: 110,
        height: 90,
        render(rt: p5 | p5.Graphics, x: number, y: number, scale: number=1) {
            rt.push();
            rt.translate(x, y);
            rt.scale(scale);
            
            rt.noStroke();
            rt.fill(26, 28, 44);
            rt.ellipse(0, 0, 70, 70);
            
            rt.triangle(-55, 0, -41, 15, -41, -15);
            rt.triangle(55, 0, 41, 15, 41, -15);
            
            rt.noFill();
            rt.stroke(255);
            rt.strokeWeight(2);
            rt.ellipse(0, 0, 58, 58);
            
            rt.scale(0.75); // easier than redoing all the math
            rt.noStroke();
            rt.fill(255);
            rt.rect(-18, -24, 8, 48);
            rt.rect(-17, -24, 19, 8);
            rt.rect(-17, 0, 19, 8);
            rt.beginShape();
            rt.vertex(-3, 0);
            rt.vertex(8, 24);
            rt.vertex(18, 24);
            rt.vertex(7, 0);
            rt.endShape("close");
            
            rt.noFill();
            rt.stroke(255);
            rt.strokeWeight(8);
            rt.arc(2, -8, 24, 24, -90, 90);
            rt.pop();
        }
    },
    [GpIcon.RIGHT_STICK_ALL]: {
        width: 110,
        height: 110,
        render(rt: p5 | p5.Graphics, x: number, y: number, scale: number=1) {
            rt.push();
            rt.translate(x, y);
            rt.scale(scale);
            
            rt.noStroke();
            rt.fill(26, 28, 44);
            rt.ellipse(0, 0, 70, 70);
            
            rt.triangle(0, -55, 15, -41, -15, -41);
            rt.triangle(0, 55, 15, 41, -15, 41);
            rt.triangle(-55, 0, -41, 15, -41, -15);
            rt.triangle(55, 0, 41, 15, 41, -15);
            
            rt.noFill();
            rt.stroke(255);
            rt.strokeWeight(2);
            rt.ellipse(0, 0, 58, 58);
            
            rt.scale(0.75); // easier than redoing all the math
            rt.noStroke();
            rt.fill(255);
            rt.rect(-18, -24, 8, 48);
            rt.rect(-17, -24, 19, 8);
            rt.rect(-17, 0, 19, 8);
            rt.beginShape();
            rt.vertex(-3, 0);
            rt.vertex(8, 24);
            rt.vertex(18, 24);
            rt.vertex(7, 0);
            rt.endShape("close");
            
            rt.noFill();
            rt.stroke(255);
            rt.strokeWeight(8);
            rt.arc(2, -8, 24, 24, -90, 90);
            rt.pop();
        }
    }
};
/* ----- end of file ----- */