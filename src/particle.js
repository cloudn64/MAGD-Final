const PARTICLE_TEXT = 0
const PARTICLE_SKILL_TEXT = 1
const PARTICLE_MAGIC = 2
const PARTICLE_SMALL_FIRE = 3

class Particle { // it refuses to accept that Particle is defined, so I named it Particle
    constructor(x, y, xVel, yVel, life, type, text) {
        this.x = x;
        this.y = y;
        this.xVel = xVel;
        this.yVel = yVel;
        this.life = life;
        this.type = type;
        this.text = text;
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
                this.y += this.yVel;
                this.yVel /= 1.01;
                this.x += this.xVel;
                this.xVel /= 1.01;
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
                fill('#FFFFFFEE');
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
                this.animation.draw(this.x, this.y, 1, 1, 0);
                break;
        }
    }
}