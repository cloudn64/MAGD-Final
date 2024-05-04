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

function newButton(name, x, y, width, height, textSize, alignX, alignY) {
    var button = new Button(name, x, y, width, height);
    button.textSize = textSize;
    button.buttonAlignX = alignX;
    button.buttonAlignY = alignY;
    // add more as necessary
    return button;
}

class MenuOption {
    constructor(name, cost, available) {
        this.name = name;
        this.cost = cost; // can just be "" if you don't want one to be here, c'mon we're working on a time limit!
        this.available = available;
    }
}

// Menu - The class for having some options in a box.
// It's also overcooked. Well, this is what happens when I have to rush.
class Menu {
    constructor(x, y, width, height, tTextSize, tSubtextSize) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.backgroundColor = '#3333FFCC';
        this.borderColor = '#FFFFFFFF';
        this.buttonColor = '#00000000';
        this.highlightedButtonColor = '#FFFFFF66';
        this.downButtonColor = '#FFFFFF99';
        this.textColor = '#FFFFFFFF';
        this.unavailableTextColor = '#444444FF';
        this.borderDensity = 4;
        this.border = true;
        this.textSize = tTextSize;
        this.mpTextSize = tSubtextSize;

        // p5js is poopy and web browsers are poopy so I have to create this here
        this.menuGraphics = createGraphics(this.width - (this.borderDensity * 2), this.height - (this.borderDensity * 2));

        this.scrollX = 0; // should be unused because a menu doesn't scroll horizontally, but is here because it can be here
        this.scrollY = 0; // min value of 0. Will be subtracted because negative numbers go up.

        this.optionsPerRow = 3;
        this.optionsPerColumn = 5;
        this.options = new Array();

        this.highlightedOption = -1;
        this.prevHighlightedOption = -1;
        this.click = false;
        this.release = false;
        this.hold = false;
        this.draggedOff = false; // flag for misbehaving by dragging the held mouse onto another button

        this.scrollDelta = 0;
        this.scrollSpeed = 0.001;

        this.highlightSfx = null; // If not null, uses this sound when the button is highlighted
        this.pressSfx = null; // If not null, uses this sound when the button is pressed
        this.releaseSfx = null; // If not null, uses this sound when the button is released
        this.unavailableSfx = null; // If not null, uses this sound when the disabled button is pressed
    }

    // function checks if the mouse is in the area within the menu's local boundaries.
    mouseAtLocal(x, y, w, h) {
        var realX = constrain(x + this.x + this.borderDensity, this.x + this.borderDensity, this.x + this.menuGraphics.width);
        var realY = constrain(y + this.y + this.borderDensity, this.y + this.borderDensity, this.y + this.menuGraphics.height);
        var realW = constrain((x + w + this.borderDensity) + this.x, realX, this.x + this.menuGraphics.width);
        var realH = constrain((y + h + this.borderDensity) + this.y, realY, this.y + this.menuGraphics.height);

        if (mouseX > realX && mouseX < realW && mouseY > realY && mouseY < realH) {
            return true;
        }

        return false;
    }

    getChosen() {
        if ((this.click || this.hold) && !this.draggedOff && this.highlightedOption == this.prevHighlightedOption && (this.options[this.highlightedOption].available == true)) {
            return this.highlightedOption;
        }
        return -1;
    }

    draw() {
        var borderOffset = (this.border) ? this.borderDensity : 0;

        if (this.options == null) {
            print("options array not initialized! I can't do this!!");
            return;
        }

        /*  MENU CONTROL  */
        // 99% of the time controls should go in the update function to maintain consistency, this is the 1% of the time where I'm not going to do that
        this.prevHighlightedOption = this.highlightedOption;
        this.highlightedOption = -1;
        // This event listener was very tricky, I had to do research for this
            window.addEventListener("wheel", event => {
                if (this.mouseAtLocal(0, 0, this.width, this.height)) {
                    this.scrollY += (event.deltaY * this.scrollSpeed);
                }
            });

        var maxScrollY = (ceil(this.options.length / this.optionsPerRow) - this.optionsPerColumn) * (this.menuGraphics.height / this.optionsPerColumn); // it's okay if the max is a negative number because the min is still 0
        this.scrollY = constrain(this.scrollY, 0, maxScrollY);
        
        /*  MENU BORDER  */
        if (this.border) {
            noFill();
            stroke(this.borderColor);
            strokeWeight(this.borderDensity);
            rect(this.x + (this.borderDensity / 2), this.y + (this.borderDensity / 2), this.width - (this.borderDensity), this.height - (this.borderDensity));
        }

        /*  MENU BACKGROUND  */
        this.menuGraphics.background(this.backgroundColor);
        
        /*  MENU CONTENTS  */
        this.menuGraphics.noStroke();
        for (var i = 0; i < this.options.length; i++) {
            var column = (int)(i / this.optionsPerRow);
            var bWidth = this.menuGraphics.width / this.optionsPerRow;
            var bX = (i - (column * this.optionsPerRow)) * bWidth;
            var bHeight = this.menuGraphics.height / this.optionsPerColumn;
            var bY = column * bHeight;
            bY -= this.scrollY;

            if (this.mouseAtLocal(bX, bY, bWidth, bHeight) && this.highlightedOption == -1) {
                this.highlightedOption = i;
                if (this.options[i].available && (this.prevHighlightedOption == this.highlightedOption) && (this.click || this.hold)) {
                    this.menuGraphics.fill(this.downButtonColor);
                } else {
                    this.menuGraphics.fill(this.highlightedButtonColor);
                }
            } else {
                this.menuGraphics.fill(this.buttonColor);
            }
            this.menuGraphics.rect(bX, bY, bWidth, bHeight);

            if (!this.options[i].available) {
                this.menuGraphics.fill(this.unavailableTextColor);
            } else {
                this.menuGraphics.fill(this.textColor);
            }
            this.menuGraphics.textSize(this.textSize);
            this.menuGraphics.textAlign(CENTER, CENTER);
            // name text
            this.menuGraphics.text(this.options[i].name, bX + (bWidth / 2), bY + (bHeight / 2));
            this.menuGraphics.textSize(this.mpTextSize);
            this.menuGraphics.textAlign(RIGHT, BOTTOM);
            this.menuGraphics.text(this.options[i].cost, bX + bWidth, bY + bHeight);
        }

        /*  MENU DRAW  */
        image(this.menuGraphics, this.x + borderOffset, this.y + borderOffset);

        if (this.prevHighlightedOption != this.highlightedOption) {
            print("dragged off! Were you trying to discover a glitch or somethin'?");
            this.draggedOff = true;
        } else if (!mouseIsPressed) {
            this.draggedOff = false;
        }

        if (this.highlightedOption != -1 && !this.draggedOff) {
            if (mouseIsPressed) { // mouse is pressed over button
                this.release = false; // you're pushing the button so you're not releasing it.
                if (!this.click && !this.hold) { // If not click or hold, set click
                    this.click = true;
                    if ((this.options[this.highlightedOption].available) && this.clickSfx != null) {
                        this.clickSfx.play(); // assumes this is a sound and tries to play it
                    } else if ((!this.options[this.highlightedOption].available) && this.unavailableSfx != null) {
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
}

// Helpful lil' guy
class SkillMenu {
    constructor(owner, skills, x, y, w, h, textSize, subtextSize) {
        this.menu = new Menu(x, y, w, h, textSize, subtextSize);
        this.owner = owner;
        this.skills = skills;

        for (var skill = 0; skill < this.skills.length; skill++) {
            var thisSkill = this.skills[skill];
            print(thisSkill.name);
            if (thisSkill != null) {
                this.menu.options.push(new MenuOption(thisSkill.name, thisSkill.mpCost + "MP", thisSkill.mpCost <= this.owner.mp));
            }
        }
    }

    getChosen() {
        return this.menu.getChosen();
    }

    draw() {
        for (var skill = 0; skill < this.skills.length; skill++) {
            var thisSkill = this.skills[skill];
            if (thisSkill.mpCost > this.owner.mp) {
                this.menu.options[skill].available = false;
            } else {
                this.menu.options[skill].available = true;
            }
        }
        this.menu.draw();
    }
}

// the HP and MP of characters in your party. I haven't decided if I want to support there being more than one party member yet.
// This is obviously built off of the menu class, and if I had more foresight, they would probably be the same thing.
// Here we are, though.
// if 'showEnemies' is true, this will instead show the enemy stats.
// if 'targetATB' is true, this will be a target selection interface instead of a status menu
class BattleStatus {
    constructor(x, y, width, height, battle) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.battleState = battle;

        this.backgroundColor = '#3333FFCC';
        this.borderColor = '#FFFFFFFF';
        this.buttonColor = '#00000000';
        this.highlightedButtonColor = '#FFFFFF66';
        this.downButtonColor = '#FFFFFF99';
        this.textColor = '#FFFFFFFF';
        this.unavailableTextColor = '#444444FF';
        this.deadTextColor = '#FF4444FF';
        this.unhealthyTextColor = '#FFFF44FF';
        this.borderDensity = 4;
        this.border = true;

        // p5js is poopy and web browsers are poopy so I have to create this here
        this.menuGraphics = createGraphics(this.width - (this.borderDensity * 2), this.height - (this.borderDensity * 2));

        this.highlightedOption = -1;
        this.prevHighlightedOption = -1;
        this.click = false;
        this.release = false;
        this.hold = false;
        this.draggedOff = false; // flag for misbehaving by dragging the held mouse onto another button

        this.highlightSfx = null; // If not null, uses this sound when the button is highlighted
        this.pressSfx = null; // If not null, uses this sound when the button is pressed
        this.releaseSfx = null; // If not null, uses this sound when the button is released
        this.unavailableSfx = null; // If not null, uses this sound when the disabled button is pressed

        this.nameTextSize = 15;
        this.hpMpTextSize = 9;

        this.maxCharacters = 3;
        this.optCharacterIndex = [this.maxCharacters];

        this.selectedOption = -1; // currently selected

        this.selectAlphaWave = 0; // a sine wave for the alpha of the selected option
        this.selectAlphaAngle = 0; // not actually an angle, but is named "angle" because it's being used in sine

        this.showEnemies = false; // false if this menu shows players, true if it shows enemies.
        this.noSuitableChoice = false; // Disables suitable choice logic with ATB
        this.targetATB = false; // Allows you to target people without their ATB being full
        this.targetDead = false; // Allows you to target dead people
    }

    // function checks if the mouse is in the area within the menu's local boundaries.
    mouseAtLocal(x, y, w, h) {
        var realX = constrain(x + this.x + this.borderDensity, this.x + this.borderDensity, this.x + this.menuGraphics.width);
        var realY = constrain(y + this.y + this.borderDensity, this.y + this.borderDensity, this.y + this.menuGraphics.height);
        var realW = constrain((x + w + this.borderDensity) + this.x, realX, this.x + this.menuGraphics.width);
        var realH = constrain((y + h + this.borderDensity) + this.y, realY, this.y + this.menuGraphics.height);

        if (mouseX > realX && mouseX < realW && mouseY > realY && mouseY < realH) {
            return true;
        }

        return false;
    }

    getChosen() {
        return this.selectedOption;
    }

    setupTargetingMode(enemies, allowDead) {
        this.targetATB = true;
        this.noSuitableChoice = true;
        this.showEnemies = enemies;
        this.targetDead = allowDead;
    }

    draw() {
        var borderOffset = (this.border) ? this.borderDensity : 0;
        
        if (this.battleState == null) {
            print("Battle state is null?!?!");
            return;
        } else if (this.battleState.characters == null) {
            print("Chracters are null?!?!?!");
            return;
        }

        if (this.selectedOption != -1) {
            this.selectAlphaWave = ((sin(this.selectAlphaAngle++ / 20) + 1.5) * 20);
        } else {
            this.selectAlphaWave = 0;
        }

        /*  PRE-EMPTIVE INFORMATION  */
        this.maxCharacters = 0;
        for (var e = 0; e < this.battleState.characters.length; e++) {
            var thisCharacter = this.battleState.characters[e];

            if (thisCharacter != null && thisCharacter.isPlayer != this.showEnemies) {
                this.maxCharacters++;
            }
        }

        if (this.maxCharacters < 4) {
            this.maxCharacters = 4;
        }

        /*  MENU CONTROL  */
        // 99% of the time controls should go in the update function to maintain consistency, this is the 1% of the time where I'm not going to do that
        this.prevHighlightedOption = this.highlightedOption;
        this.highlightedOption = -1;

        /*  MENU BORDER  */
        if (this.border) {
            noFill();
            stroke(this.borderColor);
            strokeWeight(this.borderDensity);
            rect(this.x + (this.borderDensity / 2), this.y + (this.borderDensity / 2), this.width - (this.borderDensity), this.height - (this.borderDensity));
        }

        /*  MENU BACKGROUND  */
        this.menuGraphics.background(this.backgroundColor);
        
        /*  MENU CONTENTS  */
        this.menuGraphics.noStroke();
        var charactersParsed = 0;
        // each index has an ID of 0 until you prove that it shouldn't
        for (var k = 0; k < this.maxCharacters; k++) {
            this.optCharacterIndex[k] = -1;
        }
        // draw each player character's stats (up to this.maxCharacters), also put ID of valid characters found into an array of options
        for (var i = 0; i < this.battleState.characters.length; i++) {
            var thisCharacter = this.battleState.characters[i];
            var bWidth = this.menuGraphics.width;
            var bX = 0;
            var bHeight = this.menuGraphics.height / this.maxCharacters;
            var bY = (charactersParsed * this.menuGraphics.height / this.maxCharacters);

            if (charactersParsed >= this.maxCharacters) {
                break;
            } else if (thisCharacter == null || thisCharacter.isPlayer == this.showEnemies) {
                continue;
            } else {
                this.optCharacterIndex[charactersParsed] = i;
                charactersParsed++;
            }

            // Highlight
            if (this.mouseAtLocal(bX, bY, bWidth, bHeight) && this.highlightedOption == -1) {
                this.highlightedOption = (charactersParsed - 1);
                if (!thisCharacter.dead && (thisCharacter.atbTimer >= (ATB_MAX - thisCharacter.speed)) && (this.prevHighlightedOption == this.highlightedOption) && (this.click || this.hold)) {
                    this.menuGraphics.fill(this.downButtonColor);
                } else {
                    this.menuGraphics.fill(this.highlightedButtonColor);
                }
            } else {
                this.menuGraphics.fill(this.buttonColor);
            }
            this.menuGraphics.rect(bX, bY, bWidth, bHeight);

            // Select
            if ((charactersParsed - 1 == this.selectedOption)) {
                this.menuGraphics.fill(0, this.selectAlphaWave);
                this.menuGraphics.rect(bX, bY, bWidth, bHeight);
            }

            // ATB Bar
            if (thisCharacter.scanned) {
                var atbBarScale = 7;
                var atbBarHeight = (bHeight - (atbBarScale * 2));
                this.menuGraphics.fill('#333333FF');
                this.menuGraphics.rect(bX + 8, bY + atbBarScale, 6, atbBarHeight);
                // ATB Bar Fill
                var atbBarFill = (thisCharacter.atbTimer / (ATB_MAX - thisCharacter.speed));
                this.menuGraphics.fill(255 - (atbBarFill * 255), (atbBarFill * 255), 0, 255);
                this.menuGraphics.rect(bX + 8, atbBarHeight - (atbBarFill * atbBarHeight) + bY + atbBarScale, 6, atbBarFill * atbBarHeight);

                // Name and HP text color
                if (thisCharacter.dead) { // you are dead
                    this.menuGraphics.fill(this.deadTextColor);
                } else if (thisCharacter.hp < (thisCharacter.maxHP / 10)) { // you have less than a tenth of your health
                    this.menuGraphics.fill(this.unhealthyTextColor);
                } else {
                    this.menuGraphics.fill(this.textColor);
                }
            } else {
                this.menuGraphics.fill(this.textColor);
            }

            var textOffset = 30;

            this.menuGraphics.textSize(this.nameTextSize);
            this.menuGraphics.textAlign(LEFT, CENTER);
            // name text
            this.menuGraphics.text(thisCharacter.name, bX + textOffset, bY + (bHeight / 2));

            if (thisCharacter.scanned) {
                var statsOffset = 110;
                var barLength = 300;
                var textSpaceCut = bHeight / (this.hpMpTextSize * 0.5);

                this.menuGraphics.textSize(this.hpMpTextSize);
                // HP Text and Bar
                this.menuGraphics.text(thisCharacter.hp + "/" + thisCharacter.maxHP + "HP", bX + statsOffset, bY + (textSpaceCut));
                this.menuGraphics.fill('#222222CC');
                this.menuGraphics.rect(bX + statsOffset, bY + (textSpaceCut * 2) - (textSpaceCut / 2), barLength, textSpaceCut / 2); // empty bar
                var hpBarFill = (thisCharacter.hp / (thisCharacter.maxHP)) * barLength;
                this.menuGraphics.fill('#00FF00FF');
                this.menuGraphics.rect(bX + statsOffset, bY + (textSpaceCut * 2) - (textSpaceCut / 2), hpBarFill, textSpaceCut / 2); // full bar


                // MP text color
                if (thisCharacter.dead || thisCharacter.mp == 0) { // you are dead or you have 0 MP
                    this.menuGraphics.fill(this.deadTextColor);
                } else if (thisCharacter.mp < (thisCharacter.maxMP / 10)) { // you have less than a tenth of your MP
                    this.menuGraphics.fill(this.unhealthyTextColor);
                } else {
                    this.menuGraphics.fill(this.textColor);
                }

                // MP
                this.menuGraphics.text(thisCharacter.mp + "/" + thisCharacter.maxMP + "MP", bX + statsOffset, bY + (textSpaceCut * 3));
                this.menuGraphics.fill('#222222CC');
                this.menuGraphics.rect(bX + statsOffset, bY + (textSpaceCut * 4) - (textSpaceCut / 2), barLength, textSpaceCut / 2); // empty bar
                var mpBarFill = (thisCharacter.mp / (thisCharacter.maxMP)) * barLength;
                this.menuGraphics.fill('#FF33FFFF');
                this.menuGraphics.rect(bX + statsOffset, bY + (textSpaceCut * 4) - (textSpaceCut / 2), mpBarFill, textSpaceCut / 2); // full bar
            }
        }

        /*  MENU DRAW  */
        image(this.menuGraphics, this.x + borderOffset, this.y + borderOffset);

        if (this.prevHighlightedOption != this.highlightedOption) {
            print("dragged off! Were you trying to discover a glitch or somethin'?");
            this.draggedOff = true;
        } else if (!mouseIsPressed) {
            this.draggedOff = false;
        }

        // cancel choice logic
        if (this.selectedOption != -1) {
            if (this.optCharacterIndex[this.selectedOption] == -1) { // not a real character (anymore?)
                this.selectedOption = -1;
            } else {
                var selectedCharacter = this.battleState.characters[this.optCharacterIndex[this.selectedOption]];
                if ((!this.targetATB && (selectedCharacter.atbTimer < (ATB_MAX - selectedCharacter.speed))) || (!this.targetDead && selectedCharacter.dead)) { // Don't select character with not ready ATB or dead character (ATB is ignored for target mode)
                    this.selectedOption = -1;
                }
            }
        }

        // suitable choice logic (attempt to select a character automatically if a suitable one exists. Does not do this in target mode)
        if (this.selectedOption == -1 && !this.noSuitableChoice) {
            for (var c = 0; c < this.maxCharacters; c++) {
                if (this.optCharacterIndex[c] != -1) {
                    var thisCharacter = this.battleState.characters[this.optCharacterIndex[c]];
                    if (thisCharacter != null && (this.targetDead || !thisCharacter.dead) && (this.targetATB || thisCharacter.atbTimer >= (ATB_MAX - thisCharacter.speed))) { // ATB is ignored in target mode
                        this.selectedOption = c;
                    }
                }
            }
        }

        // higlight logic
        var highlightedCharacter = null;
        var characterIsHighlighted = false;
        var characterAtbReady = false;

        if (this.highlightedOption != -1 && this.optCharacterIndex[this.highlightedOption] != -1) {
            highlightedCharacter = this.battleState.characters[this.optCharacterIndex[this.highlightedOption]]; // should be confirmed not null by the earlier loop
            if (highlightedCharacter == null) {
                print("I'm null, why?");
                this.highlightedOption = this.prevHighlightedOption = -1;
            } else {
                characterIsHighlighted = true;
                if (highlightedCharacter.atbTimer >= (ATB_MAX - highlightedCharacter.speed)) characterAtbReady = true;
            }
        } else {
            if (this.highlightedOption == -1) {
                //print("I'm not real or something, why?");
            } else {
                print("optCharacterIndex isn't even real?? idx " + this.highlightedOption);
            }
            this.highlightedOption = this.prevHighlightedOption = -1;
        }

        if (this.highlightedOption != -1 && !this.draggedOff) {
            if (mouseIsPressed) { // mouse is pressed over button
                this.release = false; // you're pushing the button so you're not releasing it.
                if (!this.click && !this.hold) { // If not click or hold, set click
                    this.click = true;
                    if ((characterIsHighlighted && (this.targetDead || !highlightedCharacter.dead) && (this.targetATB || characterAtbReady))) { // not dead and ATB ready (ATB is ignored in target mode)
                        this.selectedOption = this.highlightedOption;
                        print("I clicked a character");
                        if (this.clickSfx != null) {
                            this.clickSfx.play(); // assumes this is a sound and tries to play it
                        }
                    } else if (characterIsHighlighted) { 
                        print("this one's not ready boss (or they are dead, oh noes)");
                        if (this.unavailableSfx != null) {
                            this.unavailableSfx.play(); // assumes this is a sound and tries to play it
                        }
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
}
