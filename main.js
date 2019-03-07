const fieldSize = 800;
var rowSize = 50;
var framesPerSecond  = 2;
var isPaused = false;
var currentGrid;
var pausedGrid;
var pausedNextGrid;
var startNewGame = false;
var newGameGrid;
var cellSize = fieldSize / rowSize;
var clickExtra;

const cellStrokeColor = '#AAA';


const getRandomGrid = () => {
    const grid = new Array(rowSize);
    for (let i = 0; i < grid.length; i++) {
        grid[i] = new Array(rowSize);
        for (let j = 0; j < grid.length; j++) {
            grid[i][j] = Math.floor(Math.random() * 2);
        }
    }
    return grid;
}


const drawGrid = (context, grid) => {
    context.strokeStyle = cellStrokeColor;
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid.length; j++) {
            const value = grid[i][j];
            if(value) {
                context.fillRect(i * cellSize, j * cellSize, cellSize, cellSize);
            }
            context.strokeRect(i * cellSize, j * cellSize, cellSize, cellSize);
        }
    }
}

const getNextGeneration = (grid) => {
    const nextGrid = new Array(grid.length);
    for (let i = 0; i < grid.length; i++) {
        nextGrid[i] = new Array(grid.length);
        for (let j = 0; j < nextGrid[i].length; j++) {
            const value = grid[i][j];
            const neighbors = countNeighbors(grid, i, j);
            if(value === 0 && neighbors === 3) {
                nextGrid[i][j] = 1;
            } else if ( (value === 1) && 
                        (neighbors < 2 || neighbors > 3) ) {
                nextGrid[i][j] = 0;
            } else {
                nextGrid[i][j] = value;
            }
        }
    }
    return nextGrid;
}

const countNeighbors = (grid, x, y) => {
    let sum = 0;
    const numberOfRows = grid.length;
    const numberOfCols = grid[0].length;
    for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
            const row = (x + i);
            const col = (y + j);
            if (grid[row] === undefined || grid[row][col] === undefined) {}
            else sum += grid[row][col];
        }
    }
    sum -= grid[x][y];
    // console.log(sum);
    return sum;
}

const generation = (context, grid) => {
    var currentGrid = grid;
    if (startNewGame) {
        currentGrid = newGameGrid;
        startNewGame = false;
    }
    if (clickExtra) {
        console.log(clickExtra);
        
        for (let i = 0; i < clickExtra.length; i++) {
            for (let j = 0; j < clickExtra[i].length; j++) {
                if (clickExtra[i][j] === 1) currentGrid[i][j] = 1;
            }
        }
        clickExtra = undefined;
    }
    
    context.clearRect(0,0,fieldSize,fieldSize);
    drawGrid(context, currentGrid);
    const gridOfNextGen = getNextGeneration(currentGrid);
    pausedGrid = currentGrid;
    pausedNextGrid = gridOfNextGen;
    if (!isPaused) {
        setTimeout(() => {

            requestAnimationFrame(() => generation(context, gridOfNextGen))

        }, 1000 / framesPerSecond);
    }
}

window.onload = () => {
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');
    var form_elements = document.getElementById('menu').elements;

    document.getElementById('speed').value = framesPerSecond;
    document.getElementById('size').value = rowSize;
    document.getElementById('gameType0').checked = true;
    document.getElementById('item1').checked = true;


    const grid = getEmptyGrid();
    generation(context, grid);

    canvas.onclick = (event) => {
        var cellX = Math.floor(event.layerX / cellSize);
        var cellY = Math.floor(event.layerY / cellSize);

        var item = form_elements['items'].value;
        
        if (item === 'item1'){
            clickExtra = singleCell(cellX, cellY);
        } else if (item === 'item2'){
            clickExtra = pentadecathlon(cellX, cellY);
        } else if (item === 'item3'){
            clickExtra = gosperGun(cellX, cellY);
        } else if (item === 'item4'){
            clickExtra = glider(cellX, cellY);
        }
    }
}

const singleCell = (centerX, centerY) => {
    var centerX = centerX;
    var centerY = centerY; 

    const singleGrid = new Array(rowSize);
    for (let i = 0; i < singleGrid.length; i++) {
        singleGrid[i] = new Array(rowSize);
        for (let j = 0; j < singleGrid.length; j++) {
            singleGrid[i][j] = 0;
        }
    }
    singleGrid[centerX][centerY] = 1;
    return singleGrid;
}


const pentadecathlon = (centerX, centerY) => {
    var centerX = centerX || rowSize/2;
    var centerY = centerY || rowSize/2; 

    const pentaGrid = new Array(rowSize);
    for (let i = 0; i < pentaGrid.length; i++) {
        pentaGrid[i] = new Array(rowSize);
        for (let j = 0; j < pentaGrid.length; j++) {
            pentaGrid[i][j] = 0;
        }
    }
    try {
        pentaGrid[centerX - 4][centerY] = 1;
        pentaGrid[centerX - 3][centerY] = 1;
        pentaGrid[centerX - 2][centerY + 1] = 1;
        pentaGrid[centerX - 2][centerY - 1] = 1;
        pentaGrid[centerX - 1][centerY] = 1;
        pentaGrid[centerX][centerY] = 1;
        pentaGrid[centerX + 1][centerY] = 1;
        pentaGrid[centerX + 2][centerY] = 1;
        pentaGrid[centerX + 3][centerY + 1] = 1;
        pentaGrid[centerX + 3][centerY - 1] = 1;
        pentaGrid[centerX + 4][centerY] = 1;
        pentaGrid[centerX + 5][centerY] = 1;
        return pentaGrid;
    } catch (TypeError) {
        console.log("Cant place that there!");
        
    }
    
}

const gosperGun = (centerX, centerY) => {
    var centerX = centerX || rowSize/2;
    var centerY = centerY || rowSize/2; 
    
    
    const gunGrid = new Array(rowSize);
    for (let i = 0; i < gunGrid.length; i++) {
        gunGrid[i] = new Array(rowSize);
        for (let j = 0; j < gunGrid[0].length; j++) {
            gunGrid[i][j] = 0;
        }
    }
    try {
        gunGrid[centerX - 18][centerY] = 1;
        gunGrid[centerX - 18][centerY + 1] = 1;
        gunGrid[centerX - 17][centerY] = 1;
        gunGrid[centerX - 17][centerY + 1] = 1;
        gunGrid[centerX - 8][centerY] = 1;
        gunGrid[centerX - 8][centerY + 1] = 1;
        gunGrid[centerX - 8][centerY - 1] = 1;
        gunGrid[centerX - 7][centerY + 2] = 1;
        gunGrid[centerX - 7][centerY - 2] = 1;
        gunGrid[centerX - 6][centerY + 3] = 1;
        gunGrid[centerX - 6][centerY - 3] = 1;
        gunGrid[centerX - 5][centerY + 3] = 1;
        gunGrid[centerX - 5][centerY - 3] = 1;
        gunGrid[centerX - 4][centerY] = 1;
        gunGrid[centerX - 3][centerY + 2] = 1;
        gunGrid[centerX - 3][centerY - 2] = 1;
        gunGrid[centerX - 2][centerY] = 1;
        gunGrid[centerX - 2][centerY + 1] = 1;
        gunGrid[centerX - 2][centerY - 1] = 1;
        gunGrid[centerX - 1][centerY] = 1;
        gunGrid[centerX + 2][centerY + 1] = 1;
        gunGrid[centerX + 2][centerY + 2] = 1;
        gunGrid[centerX + 2][centerY + 3] = 1;
        gunGrid[centerX + 3][centerY + 1] = 1;
        gunGrid[centerX + 3][centerY + 2] = 1;
        gunGrid[centerX + 3][centerY + 3] = 1;
        gunGrid[centerX + 4][centerY] = 1;
        gunGrid[centerX + 4][centerY + 4] = 1;
        gunGrid[centerX + 6][centerY] = 1;
        gunGrid[centerX + 6][centerY - 1] = 1;
        gunGrid[centerX + 6][centerY + 4] = 1;
        gunGrid[centerX + 6][centerY + 5] = 1;
        gunGrid[centerX + 16][centerY + 2] = 1;
        gunGrid[centerX + 16][centerY + 3] = 1;
        gunGrid[centerX + 17][centerY + 2] = 1;
        gunGrid[centerX + 17][centerY + 3] = 1;
        return gunGrid;
    } catch (TypeError) {
        console.log("Cant place that there!");
    }
    
}

const glider = (centerX, centerY) => {
    var centerX = centerX || 0;
    var centerY = centerY || 0; 

    const gliderGrid = new Array(rowSize);
    for (let i = 0; i < gliderGrid.length; i++) {
        gliderGrid[i] = new Array(rowSize);
        for (let j = 0; j < gliderGrid.length; j++) {
            gliderGrid[i][j] = 0;
        }
    }
    try {
        gliderGrid[centerX][centerY + 1] = 1;
        gliderGrid[centerX + 1][centerY + 2] = 1;
        gliderGrid[centerX + 2][centerY] = 1;
        gliderGrid[centerX + 2][centerY + 1] = 1;
        gliderGrid[centerX + 2][centerY + 2] = 1;
        return gliderGrid;
    } catch (TypeError) {
        console.log("Cant place that there!");
    }
    
}

const getEmptyGrid = () => {

    const emptyGrid = new Array(rowSize);
    for (let i = 0; i < emptyGrid.length; i++) {
        emptyGrid[i] = new Array(rowSize);
        for (let j = 0; j < emptyGrid.length; j++) {
            emptyGrid[i][j] = 0;
        }
    }
    return emptyGrid;
    
}



function newGame() {
    
    startNewGame = true;
    var form_elements = document.getElementById('menu').elements;
    var gameType = form_elements['options'].value;

    var newFPS = document.getElementById('speed').value;
    if (newFPS) framesPerSecond = newFPS * 1;
    if (framesPerSecond < 0.1) framesPerSecond = 0.1;
    if (framesPerSecond > 100) framesPerSecond = 100;

    var newSize = document.getElementById('size').value;
    if (newSize) rowSize = newSize * 1;
    if (rowSize < 38) rowSize = 38;
    if (rowSize > 100) rowSize = 100;

    cellSize = fieldSize / rowSize;

    if (gameType === 'gameType0') {
        newGameGrid = getEmptyGrid();

    } else if (gameType === 'gameType1') {
        newGameGrid = getRandomGrid();

    } else if (gameType === 'gameType2') {
        newGameGrid = pentadecathlon();

    } else if (gameType === 'gameType3') {
        newGameGrid = gosperGun();
        
    } else if (gameType === 'gameType4') {
        newGameGrid = glider();
    }

    document.getElementById('speed').value = framesPerSecond;
    document.getElementById('size').value = rowSize;

}

function pause() {
    isPaused = true;
}


function resume() {
    isPaused = false;
    generation(document.getElementById('canvas').getContext('2d'), pausedGrid);
}

function stepGame() { 
    generation(document.getElementById('canvas').getContext('2d'), pausedNextGrid);
}