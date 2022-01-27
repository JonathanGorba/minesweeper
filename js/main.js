'use strict';
const MINE = '<img src="image/mine.png" width="30px" height="30px">';
const HAPPY = '<img src="image/happy.png" width="40px" height="40px" onclick="setLevel(gLevel.difficulty)">';
const SAD = '<img src="image/sad.png" width="40px" height="40px" onclick="setLevel(gLevel.difficulty)">';
const WIN = '<img src="image/gg.png" width="40px" height="40px" onclick="setLevel(gLevel.difficulty)">';
var gLevel = {
    difficulty: 1,
    size: 4,
    mines: 2,
    hiddenCells: 14
};
var gTimer = {
    status: false,
    counter: 0,
    interval: ''
}
var gBoard;
var gMinesCount;
var gLivesCounter;
var gFirstClick = true;



document.oncontextmenu = function (e) {
    stopEvent(e);
}

function stopEvent(event) {
    if (event.preventDefault != undefined)
        event.preventDefault();
    if (event.stopPropagation != undefined)
        event.stopPropagation();
}

function init() {
    gFirstClick = true;
    document.querySelector('.smiley').innerHTML = HAPPY
    gTimer.status = false;
    gTimer.counter = 0;
    document.querySelector('.timer').innerText = 0;
    gLivesCounter = 3;
    document.querySelector('h2').innerText = '';
    document.querySelector('.lives').innerHTML = gLivesCounter;
    gBoard = buildBoard(gLevel.size);
    printMat(gBoard, '.board-container');

}

function buildBoard(size) {
    var board = [];
    for (var i = 0; i < size; i++) {
        board.push([]);
        for (var j = 0; j < size; j++) {
            board[i][j] = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false
            }
        }
    }
    return board;
}

function printMat(mat, selector) {
    var strHTML = '<table border="1"><tbody>';
    for (var i = 0; i < mat.length; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < mat[0].length; j++) {
            var className = `cell hidden cell${i}-${j}`;
            strHTML += `<td class="${className}" oncontextmenu="cellRightClicked(this, ${i}, ${j})" onclick="cellClicked(this, ${i}, ${j})"></td>`;
        }
        strHTML += '</tr>';
    }
    strHTML += '</tbody></table>';
    var elContainer = document.querySelector(selector);
    elContainer.innerHTML = strHTML;
}

function setMinesNegsCount(board) {
    var cells = getBoardCellCoordinatesArray(board);
    for (var k = 0; k < cells.length; k++) {
        for (var i = cells[k].i - 1; i <= cells[k].i + 1; i++) {
            if (i < 0 || i > board.length - 1) continue;
            for (var j = cells[k].j - 1; j <= cells[k].j + 1; j++) {
                if (j < 0 || j > board[0].length - 1) continue;
                if (i === cells[k].i && j === cells[k].j) continue;
                if (board[i][j].isMine) board[cells[k].i][cells[k].j].minesAroundCount++;
            }
        }
    }
}

function plantMines(board, minesCount, cellI, cellJ) {
    var cells = getBoardCellCoordinatesArray(board);
    for (var i = 0; i < minesCount; i++) {
        var randomNum = getRandomIntInclusive(0, (cells.length - 1));
        var cell = cells[randomNum];
        if ((cell.i === cellI) && (cell.j) === cellJ) {
            i--;
            cells.splice(randomNum, 1);
            continue
        }
        board[cell.i][cell.j].isMine = true;
        cells.splice(randomNum, 1);
    }
}

function getBoardCellCoordinatesArray(board) {
    var coordinates = [];
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            coordinates.push({ 'i': i, 'j': j });
        }
    }
    return coordinates;
}

function cellClicked(elCell, i, j) {
    if (gFirstClick) firstClick(i, j);
    if ((gLivesCounter === 0) || gBoard[i][j].isShown || gBoard[i][j].isMarked) return;
    if (!gTimer.status) startTimer();
    if (!gBoard[i][j].isMine) {
        elCell.classList.add(`shown${gBoard[i][j].minesAroundCount}`);
        renderCell(elCell, gBoard[i][j].minesAroundCount);
        gBoard[i][j].isShown = true;
        expandShown(i, j);
        gLevel.hiddenCells--;
        gameWonCheker();
    } else {
        elCell.classList.add(`exploaded`);
        renderCell(elCell, MINE);
        gLivesCounter--;
        document.querySelector('.lives').innerHTML = gLivesCounter;
        gBoard[i][j].isShown = true;
        gameOverCheker();
    }
    elCell.classList.remove('hidden');
}

function cellRightClicked(elCell, i, j) {
    if ((gLivesCounter === 0) || gBoard[i][j].isShown) return;
    if (!gTimer.status) startTimer();
    if (gBoard[i][j].isMarked) {
        elCell.classList.remove('marked');
        elCell.classList.add('hidden');
        gBoard[i][j].isMarked = false;
    } else {
        elCell.classList.remove('hidden');
        elCell.classList.add('marked');
        gBoard[i][j].isMarked = true;
    }
}

function renderCell(elCell, value) {
    elCell.innerHTML = value;
}

function gameWonCheker() {
    if (gLevel.hiddenCells === 0) gameEnd(true);
}

function gameOverCheker() {
    if (gLivesCounter === 0) gameEnd(false);
}

function gameEnd(status) {
    if (status) {
        document.querySelector('h2').innerText = 'GAME WON';
        document.querySelector('.smiley').innerHTML = WIN;
    } else {
        document.querySelector('h2').innerText = 'GAME OVER';
        document.querySelector('.smiley').innerHTML = SAD;
    }
    clearInterval(gTimer.interval);
}

function setLevel(level) {
    if (level === 1) {
        gLevel = {
            difficulty: 1,
            size: 4,
            mines: 2,
            hiddenCells: 14
        };
    } else if (level === 2) {
        gLevel = {
            difficulty: 2,
            size: 8,
            mines: 12,
            hiddenCells: 52
        };
    } else if (level === 3) {
        gLevel = {
            difficulty: 3,
            size: 12,
            mines: 30,
            hiddenCells: 114
        };
    }
    clearInterval(gTimer.interval);
    init();
}

function expandShown(cellI, cellJ) {
    if (gBoard[cellI][cellJ].minesAroundCount === 0) {
        for (var i = cellI - 1; i <= cellI + 1; i++) {
            if (i < 0 || i > gBoard.length - 1) continue;
            for (var j = cellJ - 1; j <= cellJ + 1; j++) {
                if (j < 0 || j > gBoard[0].length - 1) continue;
                if (i === cellI && j === cellJ) continue;
                if (gBoard[i][j].isShown) continue;
                if (gBoard[i][j].isMarked) continue;
                var elCell = document.querySelector(`.cell${i}-${j}`);
                elCell.classList.add(`shown${gBoard[i][j].minesAroundCount}`);
                renderCell(elCell, gBoard[i][j].minesAroundCount);
                gLevel.hiddenCells--;
                elCell.classList.remove('hidden');
                gBoard[i][j].isShown = true;
                expandShown(i, j);
            }
        }
    }
}

function startTimer() {
    gTimer.status = true;
    gTimer.interval = setInterval(timercounter, 1000);
}

function timercounter() {
    gTimer.counter++;
    document.querySelector('.timer').innerText = gTimer.counter
}

function firstClick(cellI, cellJ) {
    gFirstClick = false;
    plantMines(gBoard, gLevel.mines, cellI, cellJ);
    setMinesNegsCount(gBoard);
}