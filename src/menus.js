/*

    Menus

    Helpful classes for UI

*/

// Button - The ultimate and frankly overcooked button class.
// Has so much extra stuff that it might be slow to process.
// Note to self- this would be cleaner if I used more vector2s and stuff
class Button {
    constructor(name, x, y, width, height) {
        // Basic button information
        this.name = name; // The text on the button
        this.x = x; // X coordinate of button
        this.y = y; // Y coordinate of button
        this.width = width; // Width of button
        this.height = height; // Height of button

        // Various button states updated by the update function. Don't change these.
        this.highlight = false;
        this.click = false;
        this.release = false;
        this.hold = false;

        // These are cosmetic fields for the border
        this.border = true; // must be true for border to exist
        this.borderColor = '#FFFFFFFF';
        this.borderUnavailableColor = '#FFFFFF99';
        this.borderThickness = 4;

        // These are cosmetic fields for the button (defaults because long constructors are annoying)
        this.buttonNormalColor = '#0000FFCC';
        this.buttonHighlightColor = '#2222FFDD';
        this.buttonDownColor = '#0000CCDD';
        this.buttonUnavailableColor = '#00009999';
        this.buttonAlignX = CENTER;
        this.buttonAlignY = CENTER;

        // These are cosmetic fields for the text (defaults because long constructors are annoying)
        this.textColor = '#FFFFFFFF';
        this.textUnavailableColor = '#99999999';
        this.textSize = 30; 
        this.textAlignX = CENTER; // Supports LEFT and CENTER. Does not support RIGHT because I have no use for that.
        this.textAlignY = CENTER; // Supports LEFT and CENTER. Does not support RIGHT because I have no use for that.
        this.textOffsetX = this.width / 2; // Offsets the text by this value on the X axis
        this.textOffsetY = this.height / 2; // Offsets the text by this value on the Y axis
        
        // These are cosmetic fields for everything (defaults because long constructors are annoying)
        this.offsetX = 0; // useful for animating
        this.offsetY = 0; // useful for animating
        this.highlightOffsetX = 0; // X offset when button is highlighted
        this.highlightOffsetY = 1; // Y offset when button is highlighted
        this.pressOffsetX = 0; // X offset when button is pressed down
        this.pressOffsetY = 2; // Y offset when button is pressed down

        // Special cosmetic fields
        this.font = null; // If not null, uses this font for the text
        this.image = null; // If not null, uses this image instead of a rectangle (still colors it with above colors)
        this.highlightSfx = null; // If not null, uses this sound when the button is highlighted
        this.pressSfx = null; // If not null, uses this sound when the button is pressed
        this.releaseSfx = null; // If not null, uses this sound when the button is released
        this.unavailableSfx = null; // If not null, uses this sound when the disabled button is pressed

        // Shadows
        this.buttonDropShadow = true;
        this.buttonShadowColor = '#FFFFFF33';
        this.textDropShadow = true;
        this.textShadowColor = '#000000CC';
        this.lightSourceX = 2;
        this.lightSourceY = 2;

        this.disabled = false; // If true, this makes the button unusable and uses the "unavailable" colors
        this.ignore = false; // If true, the button doesn't work at all.
    }

    // Updates the button states
    update() {
        var thickness = (this.border) ? this.borderThickness : 0;
        var xOffset = -this.offsetX + ((this.buttonAlignX == CENTER) ? this.width / 2 : 0);
        var yOffset = -this.offsetY + ((this.buttonAlignY == CENTER) ? this.height / 2 : 0);

        if (this.ignore) {
            this.highlight = false;
            this.click = false;
            this.hold = false;
            this.release = false;
            return;
        }

        this.highlight = false;
        if (mouseX > (this.x - thickness - xOffset) && mouseX < (this.x + this.width + thickness - xOffset) &&
            mouseY > (this.y - thickness - yOffset) && mouseY < (this.y + this.height + thickness - yOffset)) {
                if (this.highightSfx != null) {
                    this.highlightSfx.play(); // assumes this is a sound and tries to play it
                }
                this.highlight = true;
        }

        if (this.highlight) {
            if (mouseIsPressed) { // mouse is pressed over button
                this.release = false; // you're pushing the button so you're not releasing it.
                if (!this.click && !this.hold) { // If not click or hold, set click
                    this.click = true;
                    if (!this.disabled && this.clickSfx != null) {
                        this.clickSfx.play(); // assumes this is a sound and tries to play it
                    } else if (this.disabled && this.unavailableSfx != null) {
                        this.unavailableSfx.play(); // assumes this is a sound and tries to play it
                    }
                } else if (this.click && !this.hold) { // If click but not hold, click is two frames, change to hold
                    this.click = false;
                    this.hold = true;
                }
            } else { // mouse is over button but not pressed
                if (this.click || this.hold) { // button was being clicked or held and isn't anymore
                    this.release = true;
                } else if (this.release) { // button has been released for over a frame
                    this.release = false;
                }
                this.click = false;
                this.hold = false;
            }
        } else { // mouse is not over the button
            if (this.click || this.hold) { // button was being clicked or held and isn't anymore because you dragged the mouse off of it
                this.click = false;
                this.hold = false;
                this.release = true;
            } else if (this.release) { // button has been released for over a frame after you dragged the mouse off of it
                this.release = false;
                this.click = false;
                this.hold = false;
            }
        }
    }

    // Draws the button
    draw() {
        var boxOffsetX = this.offsetX;
        var boxOffsetY = this.offsetY;

        noStroke(); // no stroke

        if (this.hold || this.click) {
            boxOffsetX += this.pressOffsetX;
            boxOffsetY += this.pressOffsetY;
        } else if (this.highlight) {
            boxOffsetX += this.highlightOffsetX;
            boxOffsetY += this.highlightOffsetY;
        }

        if (this.buttonAlignX == CENTER) {
            boxOffsetX -= this.width / 2;
        }
        if (this.buttonAlignY == CENTER) {
            boxOffsetY -= this.height / 2;
        }

        // Draw shadow
        if (this.buttonDropShadow) {
            fill(this.buttonShadowColor);
            rect(this.x + boxOffsetX - ((this.border) ? this.borderThickness : 0) + this.lightSourceX, this.y + boxOffsetY - ((this.border) ? this.borderThickness : 0) + this.lightSourceY, this.width + (this.borderThickness * 2), this.height + (this.borderThickness * 2));
        }

        // Draw border
        // Does not use stroke because I like this better.
        if (this.border) {
            // Set border color
            if (this.disabled) {
                fill(this.borderUnavailableColor);
            } else {
                fill(this.borderColor);
            }
            // Draw border
            rect(this.x + boxOffsetX - this.borderThickness, this.y + boxOffsetY - this.borderThickness, this.width + (this.borderThickness * 2), this.height + (this.borderThickness * 2));
        }

        // Set button color
        if (this.disabled) {
            fill(this.buttonUnavailableColor);
        } else if (this.click || this.hold) {
            fill(this.buttonDownColor);
        } else if (this.highlight) {
            fill(this.buttonHighlightColor);
        } else {
            fill(this.buttonNormalColor);
        }

        // Draw button (image or rectangle)
        if (this.image != null) {
            image(this.image, this.x + boxOffsetX, this.y + boxOffsetY, this.width, this.height); // assumes this is an image and draws it
        } else {
            rect(this.x + boxOffsetX, this.y + boxOffsetY, this.width, this.height);
        }

        // Set text info
        if (this.font != null) {
            textFont(this.font); // assumes this is a font and uses it
        }
        textSize(this.textSize); // set text size
        textAlign(this.textAlignX, this.textAlignY); // sets text alignment

        // If the text has a shadow, do this first
        if (this.textDropShadow) {
            fill(this.textShadowColor);
            text(this.name, this.x + boxOffsetX + this.textOffsetX + this.lightSourceX, this.y + + boxOffsetY + this.textOffsetY + this.lightSourceY);
        }

        // Set normal text color
        if (this.disabled) {
            fill(this.textUnavailableColor);
        } else {
            fill(this.textColor);
        }
        // Text
        text(this.name, this.x + boxOffsetX + this.textOffsetX, this.y + + boxOffsetY + this.textOffsetY);
        
        //text("highlight: " + this.highlight + "\nclick: " + this.click + "\nhold: " + this.hold + "\nrelease: " + this.release, this.x, this.y + this.height + 60);
    }

}

function newButton(name, x, y, width, height, alignX, alignY) {
    var button = new Button(name, x, y, width, height);
    button.buttonAlignX = alignX;
    button.buttonAlignY = alignY;
    // add more as necessary
    return button;
}