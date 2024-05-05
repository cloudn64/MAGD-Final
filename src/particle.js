const PARTICLE_TEXT = 0;
const PARTICLE_SKILL_TEXT = 1;
const PARTICLE_MAGIC = 2;
const PARTICLE_SMALL_FIRE = 3;
const PARTICLE_LIFE_SPARKLE = 4;
const PARTICLE_SCAN = 5;
const PARTICLE_MEDIUM_FIRE = 6;
const PARTICLE_LARGE_FIRE = 7;
const PARTICLE_CHARGE = 8;
const PARTICLE_RAGE = 9;
const PARTICLE_MPDRAIN = 10;
const PARTICLE_REFLECT = 11;
const PARTICLE_TIME_SLOW = 12;
const PARTICLE_TIME_FAST = 13;

class Particle { // it refuses to accept that Particle is defined, so I named it Particle
    constructor(x, y, xVel, yVel, life, type, text, color) {
        this.x = x;
        this.y = y;
        this.xVel = xVel;
        this.yVel = yVel;
        this.life = life;
        this.type = type;
        this.text = text;
        this.color = color;
        this.animation = null;

        switch (this.type) {
            case (PARTICLE_MAGIC):
                this.animation = new SpriteAnimation("assets/particle/magic/", 0);
                this.animation.changeAnim(0, 2, 0.3, true);
                break;
            case (PARTICLE_SMALL_FIRE):
                this.animation = new SpriteAnimation("assets/particle/small_fire/", 0);
                this.animation.changeAnim(0, 1, 0.3, true);
                break;
            case (PARTICLE_LIFE_SPARKLE):
                this.animation = new SpriteAnimation("assets/particle/life_sparkle/", 0);
                this.animation.changeAnim(0, 6, 0.3, false);
                break;
            case (PARTICLE_SCAN):
                this.animation = new SpriteAnimation("assets/particle/scan/", 0);
                this.animation.changeAnim(0, 9, 0.3, true);
                break;
            case (PARTICLE_MEDIUM_FIRE):
                this.animation = new SpriteAnimation("assets/particle/small_fire/", 0);
                this.animation.changeAnim(1, 1, 0.3, true);
                break;
            case (PARTICLE_LARGE_FIRE):
                this.animation = new SpriteAnimation("assets/particle/small_fire/", 0);
                this.animation.changeAnim(2, 1, 0.3, true);
                break;
            case (PARTICLE_CHARGE):
                this.animation = new SpriteAnimation("assets/particle/charge/", 0);
                this.animation.changeAnim(0, 5, 0.4, true);
                break;
            case (PARTICLE_RAGE):
                this.animation = new SpriteAnimation("assets/particle/rage/", 0);
                this.animation.changeAnim(0, 0, 0.0, false);
                break;
            case (PARTICLE_MPDRAIN):
                this.animation = new SpriteAnimation("assets/particle/charge/", 0);
                this.animation.changeAnim(0, 5, 0.4, true);
                break;
            case (PARTICLE_REFLECT):
                this.animation = new SpriteAnimation("assets/particle/reflect/", 0);
                this.animation.changeAnim(0, 6, 0.4, true);
                break;
            case (PARTICLE_TIME_SLOW):
                this.animation = new SpriteAnimation("assets/particle/time/", 0);
                this.animation.changeAnim(0, 7, 0.2, true);
                break;
            case (PARTICLE_TIME_FAST):
                this.animation = new SpriteAnimation("assets/particle/time/", 0);
                this.animation.changeAnim(0, 7, 0.5, true);
                break;
        }
    }

    update() { // returns 1 if the particle is dead

        switch (this.type) {
            case PARTICLE_TEXT:
            case PARTICLE_SKILL_TEXT:
                this.y += this.yVel;
                this.yVel /= 1.1;
                break;
            case PARTICLE_MAGIC:
                break;
            case PARTICLE_SMALL_FIRE:
            case PARTICLE_MEDIUM_FIRE:
            case PARTICLE_LARGE_FIRE:
            case PARTICLE_CHARGE:
                this.y += this.yVel;
                this.yVel /= 1.01;
                this.x += this.xVel;
                this.xVel /= 1.01;
                break;
            case PARTICLE_RAGE:
            case PARTICLE_LIFE_SPARKLE:
            case PARTICLE_SCAN:
            case PARTICLE_REFLECT:
            case PARTICLE_TIME_FAST:
            case PARTICLE_TIME_SLOW:
                this.y += this.yVel;
                this.yVel /= 1.02;
                this.x += this.xVel;
                this.xVel /= 1.02;
                break;
            case PARTICLE_MPDRAIN:
                var travelFrames = 30;
                var speedX = (this.x - this.xVel) / travelFrames;
                var speedY = (this.y - this.yVel) / travelFrames;
                this.x -= speedX;
                this.y -= speedY;
                break;

        }

        this.life = constrain(this.life - 1, 0, this.life);

        if (this.life <= 0) {
            return 1;
        }
        return 0;
    }

    draw() {
        switch (this.type) {
            case PARTICLE_TEXT:
                fill(this.color);
                noStroke();
                textSize(9);
                text(this.text, this.x, this.y);
                break;
            case PARTICLE_SKILL_TEXT:
                fill('#FFFFFFEE');
                noStroke();
                textSize(15);
                text(this.text, this.x, this.y);
                break;
            case PARTICLE_MAGIC:
            case PARTICLE_SMALL_FIRE:
            case PARTICLE_MEDIUM_FIRE:
            case PARTICLE_LARGE_FIRE:
                fill(this.color);
                this.animation.drawImpl(this.x, this.y, 1, 1, 0, this.color);
                break;
            case PARTICLE_RAGE:
            case PARTICLE_LIFE_SPARKLE:
            case PARTICLE_CHARGE:
            case PARTICLE_MPDRAIN:
            case PARTICLE_REFLECT:
                this.animation.drawImpl(this.x, this.y, 0.5, 0.5, 0, this.color);
                break;
            case PARTICLE_SCAN:
            case PARTICLE_TIME_FAST:
            case PARTICLE_TIME_SLOW:
                this.animation.drawImpl(this.x, this.y, 0.2, 0.2, 0, this.color);
                break;
        }
    }
}