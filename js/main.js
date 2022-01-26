'use strict'
const MINE = '<img src="image/mine.png" width="30px" height="30px">';
var gLevel = {
    size: 4,
    mines: 2,
    hiddenCells: 14
};
var gBoard;
var gMinesCount;
var gLivesCounter;


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
    gLivesCounter = 3;
    document.querySelector('.lives').innerHTML = gLivesCounter
    gBoard = buildBoard(gLevel.size);
    printMat(gBoard, '.board-container');
    plantMines(gBoard, gLevel.mines);
    setMinesNegsCount(gBoard);
    console.table(gBoard);
}


function buildBoard(size = 4) {
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
            var className = `cell hidden`;
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

function plantMines(board, minesCount = 2) {
    var cells = getBoardCellCoordinatesArray(board);
    for (var i = 0; i < minesCount; i++) {
        var randomNum = getRandomIntInclusive(0, (cells.length - 1));
        var cell = cells[randomNum];
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
    if ((gLivesCounter === 0) || gBoard[i][j].isShown) return;
    if (!gBoard[i][j].isMine) {
        elCell.classList.add(`shown${gBoard[i][j].minesAroundCount}`);
        renderCell(elCell, gBoard[i][j].minesAroundCount);
        gLevel.hiddenCells--;
        expandShown();
        gameWonCheker();
    } else {
        elCell.classList.add(`exploaded`);
        renderCell(elCell, MINE);
        gLivesCounter--;
        document.querySelector('.lives').innerHTML = gLivesCounter;
        gameOverCheker();
    }
    elCell.classList.remove('hidden');
    gBoard[i][j].isShown = true;
    elCell.classList.remove('marked');
}

function cellRightClicked(elCell, i, j) {
    if ((gLivesCounter === 0) || gBoard[i][j].isShown) return;
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
    if (gLevel.hiddenCells === 0) gameWon();
}

function gameWon() {
    document.querySelector('h2').innerText = 'game won'
}

function gameOverCheker() {
    if (gLivesCounter === 0) gameOver();
}

function gameOver() {
    document.querySelector('h2').innerText = 'game over'
}

function setLevel(level) {
    if (level === 1) {
        gLevel = {
            size: 4,
            mines: 2,
            hiddenCells: 14
        };
    } else if (level === 2) {
        gLevel = {
            size: 8,
            mines: 12,
            hiddenCells: 52
        };
    } else if (level === 3) {
        gLevel = {
            size: 12,
            mines: 30,
            hiddenCells: 114
        };
    }
    init();
}

function expandShown() {

}