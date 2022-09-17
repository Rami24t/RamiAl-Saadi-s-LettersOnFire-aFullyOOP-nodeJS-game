// Sep 2022 - Rami Al-Saadi - Letters on Fire - a fully OOP JS game
"use strict";
class UI {
    static readline = require("readline-sync");
    static style = require('chalk');
    static read = UI.readline.question;
    static write = console.log;
    static cl = console.clear();
}
class File {
    static FS = require("fs");
    static SaveFile = "./saveFile";
    static GetFileContent(saveFile = File.SaveFile) {
        File.FS.openSync(saveFile, "a");
        const x = File.FS.readFileSync(saveFile);
        return x;
    }
    static FileContent = File.GetFileContent();
    // allFileContents.split(/\r?\n/).forEach(line =>{
    //   console.log(`Line from file: ${line}`);
    // });
    // const used = process.memoryUsage().heapUsed / 1024 / 1024;
    // console.log(`The script uses approximately ${Math.round(used * 100) / 100} MB`);
}
class App {
    ui = UI;
    constructor() {
        let newGame = '1';
        do {
            this.ui.write(
                "\n                  Rami Al-Saadi's " + UI.style.bold('Letters on Fire\n') + "\n Welcome to our book titles guessing game, where we have a collection of more than \n 11'000 good book titles for you and your friends to guess and learn!\nAre you ready to EXPLODE with knowledge...\n"
            );
            let level = this.ui.read(
                "Please Enter a number from \"1\" to \"4\" to choose a level: (Default is 1) \n                                    OR \nEnter a number from \"5\" to \"16\" to choose a specific number of title words. \n'1' - level 1: (1 to 4 words)\n'2' - level 2: (5 to 9 words)\n'3' - level 3: (10 to 14 words)\n'4' - level 4: (15+ words)\n "
            );
            if (!level || +level !== +level) level = 1;
            Book.setTitleLevel(+level);
            let playersLength = this.ui.read(
                "\nPlease enter the number of players: (Default is 1)\n"
            );
            if (
                !playersLength ||
                +playersLength !== +playersLength ||
                playersLength > 15 ||
                playersLength == 0
            )
                playersLength = 1;
            playersLength = parseInt(+playersLength);
            const players = [];
            for (let i = 0; i < playersLength; i++) {
                let input = UI.read("\nPlease enter the name of player " + (i + 1) + " ('Player " + (i + 1) + "'):\n");
                if (!input)
                    input = 'Player ' + (i + 1);
                players.push(new Player(input));
            }
            let rounds = this.ui.read(
                "\nPlease enter the number of rounds: (Default is 3)\n"
            );
            if (!rounds || +rounds !== +rounds) rounds = 3;
            do {
                for (let i = 0; i < rounds; i++) {
                    this.game = new Game(Book.CreateBook(), players);
                    this.game.startGame(i + 1);
                }
                for (let player of players) {
                    UI.write('\n' + player.showStatus() + '\n')
                }
                do {
                    newGame = UI.read('Wow! That was a good one!\nWould you like to: \n  1 - do a rematch(Default: \'1\') \n 2 - start a new Game?(\'2\')\n or \n 3 - Enter \'3\' to exit the app.');
                } while (!newGame.includes('1') && !newGame.startsWith('Re') && !newGame == '' && !newGame.startsWith('n') && !newGame.includes('2') && !newGame.includes('3'))
            } while (newGame.includes('1') || newGame.startsWith('Re') || newGame == '')
        } while (newGame.startsWith('n') || newGame.includes('2'))
        console.log('Thanks for playing, \n Bye Bye xoxo !!!');
    }
}
class Game {
    static Hangman = [`           \,--'#\`--.
           |#######|
        _.-'#######\`-._
     \,-'###############\`-.
   \,'#####################\`\,
  /#########################\\
 |###########################|
|#############################|
|#############################|
|#############################|
|#############################|
 |###########################|
  \\#########################/
   \`.#####################\\,'
     \`._###############_\\,'
        \`--..#####..--'
    `,
        `             . . .
              \\|/
            \`--+--'
              /|\\
             ' | '
               |
               |`
        ,
        `\n             . . .
              \\|/
            \`--+--'
              /|\\
             ' | '
               |`
        ,
        `\n\n             . . .
              \\|/
            \`--+--'
              /|\\
             ' | '`
        ,
        `\n\n\n             . . .
              \\|/
            \`--+--'
              /|\\`
        ,
        `\n\n\n\n             . . .
              \\|/
             \`-+-'
              /|\\`
        ,
        `\n\n\n\n\n             . . .
              \\|/
            \`--+--'`
        ,
        `\n\n\n\n\n\n             . . .
              \\|/`
        ,
        `\n\n\n\n\n\n\n               . `
        , '\n\n\n\n\n\n\n\n', `\n\n\n
        ⠀⢠⣤⣤⡀⠀⠀⠀⠀⠀⠀⠠⣤⡄⠀⠀⠀⠀⠀⠀⢀⣤⠀⠀⠀⠀⢀⣤⣤⠀
        ⠀⠘⠻⣿⣷⣄⠀⠀⠀⠀⠀⠀⢻⣇⠀⠀⠀⠀⠀⠀⡼⠁⠀⠀⠀⢀⣾⣿⣿⠀
        ⠀⠀⠀⠀⠉⠻⣦⡀⠀⠀⠀⠀⠀⢻⠀⠀⠀⠀⡆⠀⠀⠀⠀⠀⣠⣿⠿⠋⠁⠀
        ⠀⠀⠀⠀⠀⠀⠀⠑⢄⠀⠀⠀⠀⠈⠀⠀⠀⣼⡇⢀⡎⠀⢀⡼⠋⠁⠀⠀⠀⠀
        ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⣦⡀⠀⠀⢀⣴⣿⣧⡟⠀⠀⠉⠀⠀⠀⠀⠀⠀⠀
        ⠀⠀⠀⠀⠀⠀⠑⠲⢤⣤⣴⣿⣿⣷⣶⣿⣿⣿⣿⡇⠀⢀⡀⠀⠀⠀⣀⣠⣤⠀
        ⠀⠀⠀⠈⠑⠲⢶⣶⣶⣿⣿⣿⡿⠛⠻⢿⠟⠻⣿⣿⣿⠏⠀⠐⠒⠋⠉⠉⠉⠀
        ⠀⢸⣷⣦⣤⣀⡀⠈⠻⣿⣿⣿⡀⠀⠀⢸⠦⢴⣿⣿⣿⡀⠀⠀⠀⠀⠀⠀⠀⠀
        ⠀⠀⠀⠀⠀⠀⢀⠀⠀⣸⣿⣿⣏⠀⠀⣿⣀⣴⣿⣿⣿⣷⣦⣀⠀⠀⠀⠀⠀⠀
        ⠀⢠⣶⡶⠞⠋⠀⣠⣾⣿⣿⣿⣿⣷⣾⣿⣿⣿⣿⣿⣿⣿⣿⠛⠛⠓⠒⠀⠠⠀
        ⠀⠘⠋⠀⠀⠀⠚⠉⠉⠻⣿⣿⣿⣿⣿⡿⠛⠉⠙⠻⢯⡉⠙⠛⠦⢀⠀⠀⠀⠀
        ⠀⠀⠀⠀⠀⠀⢀⠀⠀⠀⣿⡿⠛⢹⡟⠀⠀⠀⠀⠀⠀⠙⠀⠀⠀⠀⠀⠀⠀⠀
        ⠀⠀⠀⢀⣠⠞⠁⠀⠀⣸⠟⠀⠀⡜⠀⠀⢸⠀⠀⠀⠀⢢⡀⠀⠀⠀⠀⠀⠀⠀
        ⠀⢠⣴⣿⠋⠀⠀⠀⠰⠋⠀⠀⠀⠀⠀⠀⣸⠀⠀⢳⡀⠀⠘⢷⣤⡀⠀⠀⠀⠀
        ⠀⠘⠛⠁⠀⠀⠀⠀⠁⠀⠀⠀⠀⠀⠀⠀⠛⠂⠀⠈⠛⠂⠀⠀⠛⠛⠓⠂⠀⠀`,
        `             
              
               |
               |
               |  
               |
               |`
    ];
    static HiddenC = "-";
    static SpaceC = "_";
    ui = UI;
    constructor(secret = Book.CreateBook(), players) {
        this.guessed = false;
        this.secret = secret;
        if (secret instanceof Book) this.secretWord = secret.miniTitle;
        else {
            if (!secret) this.ui.write("Invalid Secret!");
            if (typeof secret === typeof "123") this.secretWord = secret;
        }
        this.players = [];
        if (
            players &&
            typeof players === typeof [{}] &&
            players[0] &&
            players[0] instanceof Player
        ) {
            this.players = players;
        } else this.players.push(new Player("Player1", {}));
        this.ended = false;
        this.guessedLetters = [];
        this.wrongGuesses = [];
        this.wrongs = 0;
        this.hangman = "";
        this.updateHangman();
        this.updateHiddenWord();
    }
    updateHiddenWord() {
        const lowerSecret = this.secretWord.toLowerCase();
        let hiddenWord = "";
        for (let i = 0; i < this.secretWord.length; i++) {
            if (this.secretWord[i] === " ") hiddenWord += Game.SpaceC;
            else if (
                this.guessedLetters.join("").toLowerCase().includes(lowerSecret[i])
            )
                hiddenWord += this.secretWord[i];
            else hiddenWord += Game.HiddenC;
        }
        this.hiddenWord = hiddenWord;
    }
    checkIfCompleted() {
        const lowerSecret = this.secretWord.toLowerCase();
        let hiddenWord = this.hiddenWord.toLowerCase();
        for (let i = 0; i < this.secretWord.length; i++)
            if (this.secretWord[i] !== " " && this.secretWord[i] !== this.hiddenWord[i])
                return false
        return true
    }
    updateHangman() {
        if (this.wrongs <= 0) {
            this.hangman = Game.Hangman[11] + '\n' + Game.Hangman[0];
            return " ";
        }
        let hangman = "";
        if (this.wrongs < 9) {
            hangman = Game.Hangman[this.wrongs + 1] + '\n' + Game.Hangman[0];
        } else {
            hangman = Game.Hangman[10]; this.ended = true;
        }
        this.hangman = hangman;
    }
    startGame(roundNum) {
        UI.cl;
        UI.write("\nRound " + roundNum + "\n"); // underline
        let j = 0;
        let turn = {};
        while (!this.ended) {
            UI.write(`${this.hiddenWord} \n${this.hangman}\n`);
            turn = this.players[j];
            let guess = UI.read('\n' + turn.showStatus() + "\nPlease enter a letter: ");
            UI.write([].concat(this.guessedLetters, this.wrongGuesses).sort().join(' '));
            UI.cl;
            let check = this.checkGuess(guess);
            if (check === 'win') {
                turn.stats.tries++; // 
                turn.stats.guesses++;
                j = (j + 1) % this.players.length;
                this.updateHiddenWord();
                this.guessed = this.checkIfCompleted();
                if (this.guessed)
                    break;
            }
            else if (check === 'loss') {
                turn.stats.tries++;
                this.updateHangman();
            }
        }
        UI.cl;
        UI.write(`${this.secretWord} \n${this.hangman}\n`);
        if (!this.guessed) {
            turn.stats.losses++; //
            UI.read('Sorry ' + turn.name + ', You lost this round! Better luck next time! ;(' + '\n');
            UI.write('\nRESULT:\n');
            this.players.forEach(player => {
                if (player.name != turn.name) player.stats.wins++;
                UI.write(player.showStatus() + '\n');
                player.stats.tries = 0;
                player.stats.guesses = 0;
            });
        }
        else {
            turn.stats.wins++; //
            UI.read('Congrats ' + turn.name + '!!! You have won this battle!' + '\n');
            UI.write('\nRESULT:\n');
            this.players.forEach(player => {
                if (player.name != turn.name) player.stats.losses++;
                UI.write(player.showStatus() + '\n');
                player.stats.tries = 0;
                player.stats.guesses = 0;
            });
        }
        UI.read('\nThe Secret Book: \n\n' + this.secret.print());

    }
    checkGuess(guess) {
        if (!guess)
            return false;
        guess = guess.toString().trim()[0].toLowerCase();
        console.log(guess);
        if (!guess)
            return false;
        if (this.guessedLetters.join('').includes(guess) || this.wrongGuesses.join('').includes(guess))
            return false;
        else if (this.secretWord.toLowerCase().includes(guess)) {
            this.guessedLetters.push(guess);
            return 'win';
        }
        else {
            this.wrongGuesses.push(guess);
            this.wrongs++;
            return 'loss';
        }
        UI.cl;
    }
}
class Player {
    /**
     *
     * @param {string} name
     * @param {object} stats {tries= 0, wins= 0, losses=0, guesses=0}
     */
    constructor(name = "player1", stats) {
        this.name = name;
        this.stats = { tries: 0, wins: 0, losses: 0, guesses: 0 };
    }
    showStatus() {
        return `Player: ${this.name}  -  ${this.stats.tries} Tries   ${this.stats.guesses} Guesses   ${this.stats.tries - this.stats.guesses} Misses     ${this.stats.wins} Wins   ${this.stats.losses} Losses`;
    }
}
class Book {
    static BOOKS = require("./BOOKS");
    static Books = [];
    static BOOKSLength = 11127;
    static _MinWordsInTitle = 5;
    static _MaxWordsInTitle = 9;
    static get MinWordsInTitle() {
        return Book._MinWordsInTitle;
    }
    static set MinWordsInTitle(value) {
        if (value <= 0) return false;
        Book._MinWordsInTitle = value;
        if (Book._MaxWordsInTitle < Book._MinWordsInTitle)
            Book._MaxWordsInTitle = Book._MinWordsInTitle;
    }
    static get MaxWordsInTitle() {
        return Book._MaxWordsInTitle;
    }
    static set MaxWordsInTitle(value) {
        if (value <= 0) return false;
        Book._MaxWordsInTitle = value;
        if (Book._MaxWordsInTitle < Book._MinWordsInTitle)
            Book._MinWordsInTitle = Book._MaxWordsInTitle;
    }
    static CreateBook = function () {
        let addedBook = {};
        do {
            addedBook = new Book(Book.FetchRandomBookData());
        } while (!addedBook.title);
        return Book.Books[Book.Books.length - 1];
    };
    static FetchRandomBookData() {
        const bookID = Math.floor(Math.random() * Book.BOOKSLength);
        return Book.BOOKS[bookID];
    }
    static ProcessBookTitle(title) {
        title = title.trim();
        title = title.replaceAll("  ", " ");
        title = title.replaceAll(" - ", " ");
        title = title.replaceAll(" : ", " ");
        title = title.replaceAll('’', ' ');
        title = title.replaceAll(":", " ");
        title = title.replaceAll(" (or Hate) ", " or Hate ");
        if (title.includes(" 1/2 ")) title = title.replace("1/2", "half");
        if (title.startsWith("Novels 1")) title = title.slice(18);
        let idx1 = title.indexOf("(");
        if (idx1 <= -1) idx1 = Infinity;
        let idx2 = title.indexOf("...");
        if (idx2 <= -1) idx2 = Infinity;
        let idx = idx1 < idx2 ? idx1 : idx2;
        let idx3 = title.lastIndexOf(":");
        if (idx3 !== title.indexOf(":") && idx3 < idx) {
            idx = idx3;
        }
        idx3 = title.indexOf("/");
        if (idx3 > -1 && idx3 < idx) idx = idx3;
        idx3 = title.indexOf("Vol.");
        if (idx3 > -1 && idx3 < idx) idx = idx3;
        idx3 = title.indexOf("Volume");
        if (idx3 > -1 && idx3 < idx) idx = idx3;
        let miniTitle = title.slice(0, idx).trim();
        if (
            !miniTitle ||
            miniTitle.length < 2 ||
            miniTitle.split(" ").length > Book.MaxWordsInTitle ||
            miniTitle.split(" ").length < Book.MinWordsInTitle
        )
            return false;
        return miniTitle;
    }
    // bookData {bookID, title, authors, average_rating, isbn, isbn13, language_code, num_pages, ratings_count, text_reviews_count, publication_date, publisher}
    constructor(bookData) {
        if (!bookData.title || !bookData.authors) return false;
        this.miniTitle = Book.ProcessBookTitle(bookData.title);
        if (!this.miniTitle || !bookData.language_code.includes("en")) return false;
        else {
            for (let key in bookData) {
                this[key] = bookData[key];
            }
            if (!Book.Books.some((book) => book.isbn == this.isbn)) {
                Book.Books.push(this);
                return this;
            } else return false;
        }
    }
    print() {
        let output = '';
        let max = 0;
        for (let value of Object.values(this))
            if (value.toString().length > max)
                max = value.toString().length;
        for (let key in this)
            if (this[key] && this[key].toString().length > 2 && key !== "bookID" && key != "average_rating" && key != "isbn" && key != "language_code" && key != "ratings_count" && key != "text_reviews_count" && key != "FIELD13")
                output += key[0].toUpperCase() + key.slice(1) + ':\n   ' + ' '.repeat(max - this[key].toString().length) + this[key].toString().trim()[0].toUpperCase() + this[key].toString().trim().slice(1) + '\n\n';
        return output
    }
    static setTitleLevel(level) {
        switch (level) {
            case 1:
                Book.MinWordsInTitle = 1;
                Book.MaxWordsInTitle = 4;
                break;
            case 2:
                Book.MinWordsInTitle = 5;
                Book.MaxWordsInTitle = 9;
                break;
            case 3:
                Book.MinWordsInTitle = 10;
                Book.MaxWordsInTitle = 14;
                break;
            case 4:
                Book.MinWordsInTitle = 14;
                Book.MaxWordsInTitle = 24;
                break;
            default:
                if (level > 4 && level < 17) {
                    Book.MinWordsInTitle = level;
                    Book.MaxWordsInTitle = level;
                } else return false;
                break;
        }
    }
}
new App();