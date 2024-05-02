var me; // Temporary pointer to the HighscoreList. This is UNSAFE if more than one HighscoreList existed.

class Highscore {
    constructor(name, score) {
        this.name = name;
        this.score = score;
    }

    toString() {
        return "" + this.name + "|" + this.score;
    }
}

class HighscoreList {
    constructor(path) {
        this.path = path;
        this.ready = false;
        this.scoreList = new Array();

        this.loadFromFile();
    }

    // Used as a callback function in loadFromFile. Don't call this function yourself.
    stringsToScores(strings) {
        print("MARIO START!!");
        me.scoreList = new Array();

        for (var i = 0; i < strings.length; i++) {
            var stringsList = strings[i].split("|");

            me.scoreList.push(new Highscore(stringsList[0], parseInt(stringsList[1])));
        }

        me.ready = true;
        print("WOW!!");
    }

    // Load from highscore.txt, call function "stringsToScores" when completed.
    loadFromFile() {
        me = this;
        loadStrings(this.path, this.stringsToScores, a => {this.ready = false;});
    }

    toString() {
        var scoresString = "";

        if (this.ready == true) {
            for (var i = 0; i < highscores.scoreList.length; i++) {
                scoresString += highscores.scoreList[i].name + ": " + highscores.scoreList[i].score;
                if (i != (highscores.scoreList.length - 1)) {
                scoresString += "\n";
                }
            }
        }
        
        return scoresString;
    }

}