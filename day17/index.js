import { loadData } from './loadData.js';

let rawData;
rawData = await loadData('./input.data');
//rawData = await loadData('./test.data');

// jets moves
const LEFT = '<';
const RIGHT = '>';
const movesData = [...rawData];
const resetMoves = () =>  movesData.length - 1;
let movesNdx = resetMoves();
const getNextMove = () => {
    movesNdx = (movesNdx + 1) % movesData.length;
    return movesData[movesNdx];
}

// chamber
class Chamber {
    constructor() { 
        this.heights = [-1, -1, -1, -1, -1, -1, -1];
        this.maxHeight = -1; 
    }
    highest = () => this.maxHeight;
    _updateHeights = newHeights => newHeights.forEach(([height, ndx]) => {
        this.heights[ndx] = height;
        if (height > this.maxHeight) this.maxHeight = height;
    });
    collisions = points => points.filter(([row, col]) => row < 0 || col < 0 || col >= 7 || this.heights[col] >= row).length;
    getHeightAndState = () => [this.maxHeight, [this.heights.map(h => this.maxHeight - h), movesNdx, shapesNdx].join(',')];
}

// rocks
const SHAPES = [
    { id: 0, cl: [-1],          cr:[4],       cb:[1,1,1,1], t: [0,0,0,0], shape: [[0,1,2,3]] },         // 4-horizontal
    { id: 1, cl: [0,-1,0],      cr:[2,3,2],   cb:[2,3,2],   t: [-1,0,-1], shape: [[1], [0,1,2], [1]] }, // + shape
    { id: 2, cl: [1,1,-1],      cr:[3,3,3],   cb:[3,3,3],   t: [-2,-2,0], shape: [[2], [2], [0,1,2]] }, // inverted capital L shape
    { id: 3, cl: [-1,-1,-1,-1], cr:[1,1,1,1], cb:[4],       t: [0],       shape: [[0],[0],[0],[0]] },   // 4-vertical
    { id: 4, cl: [-1,-1],       cr:[2,2],     cb:[2,2],     t: [0,0],     shape: [[0,1],[0,1]] },       // 2x2 square
]
const resetShapes = () => SHAPES.length - 1;
let shapesNdx = resetShapes();
const getNextShape = () => {
    shapesNdx = (shapesNdx + 1) % SHAPES.length;
    return SHAPES[shapesNdx];
}

class Rock {
    constructor(shape, chamber) { 
        this.shape = shape;
        this.chamber = chamber;
        this.row = this.chamber.highest() + 3 + this.shape.cl.length;
        this.col = 2;
        this.resting = false;
    }
    moveLeft() {
        //console.log(`moving LEFT from ${this.row},${this.col}`)
        const possibleCollisions = this.shape.cl.map((ofs, ndx) => [this.row - ndx, this.col + ofs]);
        if (! this.chamber.collisions(possibleCollisions)) {
            this.col = this.col - 1;
        }
        draw()
    }
    moveRight() {
        //console.log(`moving RIGHT from ${this.row},${this.col}`)
        const possibleCollisions = this.shape.cr.map((ofs, ndx) => [this.row - ndx, this.col + ofs]);
        if (! this.chamber.collisions(possibleCollisions)) {
            this.col = this.col + 1;
        }
        draw()
    }
    drop() {
        //console.log(`dropping from ${this.row},${this.col}`)
        const possibleCollisions = this.shape.cb.map((ofs, ndx) => [this.row - ofs, this.col + ndx]);
        if (! this.chamber.collisions(possibleCollisions)) {
            this.row = this.row - 1;
        } else {
            this.rest();
        }
        draw()
    }
    rest() {
        this.resting = true;
        this.chamber._updateHeights(this.shape.t.map((ofs, ndx) => [this.row + ofs, this.col + ndx]))
    }
}

const getNextRock = (chamber) => new Rock(getNextShape(), chamber);

const rocks = [];

function draw() {
    return
    const lines = []
    for (let row = 0; row <= rocks.at(-1).row; row++) lines.push('|.......|');
    rocks.map(r => {
        r.shape.shape.forEach((shapeLine, ndx) => {
            const line = [...lines[r.row - ndx]];
            shapeLine.forEach(col => line[r.col + col + 1] = r.resting ? '#' : '@');
            lines[r.row - ndx] = line.join('');
        })
    });
    lines.unshift('+-------+');
    lines.unshift('');
    lines.reverse().forEach(l => console.log(l));
}

const dropRockInto = (chamber) => {
    const rock = getNextRock(chamber);
    rocks.push(rock);
    draw();
    while(! rock.resting) {
        const jetMove = getNextMove();
        (jetMove == LEFT) && rock.moveLeft();
        (jetMove == RIGHT) && rock.moveRight();
        rock.drop();
    }
}

const getResult1 = () => {
    const chamber = new Chamber();
    movesNdx = resetMoves();
    shapesNdx = resetShapes();
    for (let i = 0; i < 2022; i++) {
        dropRockInto(chamber);
    }
    return chamber.highest() + 1;
};

const getResult2 = () => {
    const chamber = new Chamber();
    movesNdx = resetMoves();
    shapesNdx = resetShapes();
    const previousStates = [];
    const previousHeight = [];
    const targetRocks = 1_000_000_000_000;
    let numRocks = 0;
    let numRocksFromCycles = 0;
    let totalHeightFromCycles = 0;
    let state;
    while ((numRocks + numRocksFromCycles) < targetRocks) {
        numRocks++;
        dropRockInto(chamber);
        let [chamberHeight, state] = chamber.getHeightAndState();
        const ndx = previousStates.findIndex((x) => x === state);
        if (ndx == -1) {
            previousStates.push(state);
            previousHeight.push(chamberHeight);
        } else {

            console.log(`
Found cycle in ndx ${ndx}
From rock ${ndx+1} to rock ${numRocks} -> every ${numRocks - ndx - 1} rocks
From height ${previousHeight[ndx]} to ${chamberHeight} ->  increment ${chamberHeight - previousHeight[ndx]}`);

            const rockIncrement = numRocks - ndx - 1;
            const heightIncrement = chamberHeight - previousHeight[ndx];
            const cycles = Math.floor((targetRocks - numRocks) / rockIncrement);
            numRocksFromCycles += (cycles * rockIncrement);
            totalHeightFromCycles += (cycles * heightIncrement);
            previousStates.splice(ndx);
            previousHeight.splice(ndx);
        } 
    }
    return chamber.highest() + 1 + totalHeightFromCycles;
};

console.log({result1: getResult1(), result2: getResult2()});

