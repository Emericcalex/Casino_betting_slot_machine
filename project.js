// 1) Deposit some money
// 2) Determine number of lines to bet on
// 3) Collect the bet amount
// 4) Spin the slot machine
// 5) Check if user won
// 6) Give the user their winnings
// 7) Play again

const prompt = require("prompt-sync")();

// Initialising some global variables so that can be accessed from anywhere
const ROWS = 3;
const COLS = 3;

const SYMBOLS_COUNT = {
    "A": 2,
    "B": 4,
    "C": 6,
    "D": 8
};

const SYMBOL_VALUES = {
    "A": 5,
    "B": 4,
    "C": 3,
    "D": 2
};

// Deposit function
const deposit = () => {
    while (true) {
        const DepositAmount = prompt("Enter a deposit amount: ");
        const NumberDepositAmount = parseFloat(DepositAmount);

        if (isNaN(NumberDepositAmount) || NumberDepositAmount <= 0) {
            console.log("Invalid deposit amount, try again!");
        } else {
            return NumberDepositAmount;
        }
    }
};

// Get number of lines function
const getNumberofLines = () => {
    while (true) {
        const Lines = prompt("Enter the number of lines to bet on (1-3): ");
        const NumberofLines = parseFloat(Lines);

        if (isNaN(NumberofLines) || NumberofLines < 1 || NumberofLines > 3) {
            console.log("Invalid number of lines, try again!");
        } else {
            return NumberofLines;
        }
    }
};

// (3) collect bet amount 
const getBet = (balance, Lines) => {
    while (true) {
        const bet = prompt("Enter the total bet per line: ");
        const NumberofBet = parseFloat(bet);

        if (isNaN(NumberofBet) || NumberofBet < 1 || NumberofBet > (balance / Lines)) {
            console.log("Invalid bet, try again!");
        } else {
            return NumberofBet;
        }
    }
};

// (4) spin the slot machine
const spin = () => {
    const symbols = [];
    for (const [symbol, count] of Object.entries(SYMBOLS_COUNT)) {
        for (let i = 0; i < count; i++) {
            symbols.push(symbol);
        }
    }

    const reels = [];
    for (let i = 0; i < COLS; i++) {
        reels.push([]);
        const reelSymbols = [...symbols];
        for (let j = 0; j < ROWS; j++) {
            const randomIndex = Math.floor(Math.random() * reelSymbols.length);
            const selectedSymbol = reelSymbols[randomIndex];
            reels[i].push(selectedSymbol);
            reelSymbols.splice(randomIndex, 1);
        }
    }
    return reels;
};

// Transpose function: convert column-based reels to row-based view
const transpose = (reels) => {
    const rows = [];

    for (let i = 0; i < ROWS; i++) {
        rows.push([]);
        for (let j = 0; j < COLS; j++) {
            rows[i].push(reels[j][i]);
        }
    }
    return rows;
};

// Call functions
const printRows = (rows) => {
    for (const row of rows) {
        let rowString = "";
        for (const [i, symbol] of row.entries()) {
            rowString += symbol;
            if (i !== row.length - 1) {
                rowString += " | ";
            }
        }
        console.log(rowString);
    }
};

const getWinnings =(rows, bet, lines) => {
    let winnings =0;
    for(let row =0; row < lines; row++){
        const symbols = rows[row];
        let allSame = true;

        for(const symbol of symbols){
            if(symbol != symbols[0]){
                allSame = false;
                break;
            }
        }
        if(allSame){
            winnings += bet * SYMBOL_VALUES[symbols[0]]
        }
    }
    return winnings;

}



const game = () => {

let balance = deposit();

while(true){
    console.log("you have a balance of $" + balance);

console.log("You deposited:", balance);

const NumberofLines = getNumberofLines();
console.log("You are betting on", NumberofLines, "lines");

const bet = getBet(balance, NumberofLines);
balance -= bet * NumberofLines;

const reels = spin();
const rows = transpose(reels);
printRows(rows);
const winnings = getWinnings(rows, bet, NumberofLines);
balance += winnings;
console.log("you won , $" + winnings.toString());

if(balance <= 0){
    console.log("you ran out of money");
    break;
}
const playAgain = prompt("do you want to play again ?(Y/n)");

if(playAgain != "y") break;
}
};
game();