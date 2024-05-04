class SpriteAnimation {
    constructor(gfxPath, startAnim) {
        this.gfxPath = gfxPath;
        this.anim = startAnim; // anim that should be loaded (change this one)
        this.loadedAnim = -1; // anim that is currently loaded

        this.frame = 0; // frame of this animation

        this.animGfxPath = this.gfxPath + "anim" + startAnim + "/"; // this default value should not be used because it is immediately refreshed
        this.gfxDAsset = new DAsset();

        this.endFrame = 0;
        this.speed = 1.0;
        this.frameTimer = 0.0;

        this.loop = true;
        this.done = true;

        this.repeats = 0;
    }

    draw(spriteX, spriteY, scaleX, scaleY, rotation) {

        // update the frame
        this.frameTimer += this.speed;
        if (this.loop) {
            if (this.frameTimer > (this.endFrame + 1)) { this.frameTimer = 0; this.repeats++; }
            if (this.frameTimer < -1) { this.frameTimer = this.endFrame; this.repeats++; } // for reverse
        } else {
            this.frameTimer = constrain(this.frameTimer, 0, this.endFrame);
            if (this.frameTimer >= this.endFrame) this.done = true;
        }
        this.frame = ((int)(this.frameTimer));

        if (this.loadedAnim != this.anim) { // reload the animation
            this.animGfxPath = this.gfxPath + "anim" + this.anim + "/"; // new anim path
            this.loadedAnim = this.anim; // update anim ID
        }
        this.gfxDAsset.loadDImage(this.animGfxPath + this.frame + ".png"); // The way DAsset is designed, this should not actually load anything unless it's not already loaded

        if (this.gfxDAsset.isLoaded) {
            var sprite = this.gfxDAsset.asset;
            fill('#FFFFFFFF');
            push();
            translate(spriteX, spriteY);
            rotate(rotation);
            scale(scaleX, scaleY);
            imageMode(CENTER);
            image(sprite, 0, 0);
            pop();
        }
    }

    changeAnim(ID, endFrame, speed, loop) {
        this.anim = ID;
        this.endFrame = endFrame;
        this.speed = speed;
        this.done = false;
        this.loop = loop;
        this.repeats = 0;
    }
}