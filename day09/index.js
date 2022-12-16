import { loadData } from './loadData.js';

let rawData;
rawData = await loadData('./input.data');
//rawData = await loadData('./test.data');
//rawData = await loadData('./test2.data');

const moves = rawData.split(/\r?\n/).map(m => m.split(' '));
//console.log(moves)

class Point {
    x; y;
    constructor(x, y) { 
        this.x = x; 
        this.y = y 
    }
}

class Knot extends Point {
    toString = () => 'x:' + this.x + ',y:' + this.y;
    add = (point) => new Knot(this.x + point.x, this.y + point.y);
    
}

const headDeltas = {
    'R': new Point(1, 0),
    'L': new Point(-1, 0),
    'U': new Point(0, 1),
    'D': new Point(0, -1)
}

const areCloseHorizontal = (k1, k2) => Math.abs(k1.y - k2.y) <= 1;
const areCloseVertical = (k1, k2) => Math.abs(k1.x - k2.x) <= 1;
const areKnotsTouching = (k1, k2) => areCloseHorizontal(k1, k2) && areCloseVertical(k1, k2);
const areInSameHorizontal = (k1, k2) => k1.y == k2.y;
const areInSameVertical = (k1, k2) => k1.x == k2.x;

const deltaToMoveCloser = (a, b) => a > b ? 1 : -1;

const calcNewTail = (head, tail) => {
    if (areKnotsTouching(head, tail)) {
        return tail;
    }
    if (areInSameHorizontal(head, tail)) {
        tail.x += deltaToMoveCloser(head.x, tail.x);
    } else if (areInSameVertical(head, tail)) {
        tail.y += deltaToMoveCloser(head.y, tail.y);
    } else if (areCloseHorizontal(head, tail)) {
        tail.x += deltaToMoveCloser(head.x, tail.x);
        tail.y = head.y;
    } else if (areCloseVertical(head, tail)) {
        tail.y += deltaToMoveCloser(head.y, tail.y);
        tail.x = head.x;
    } else {
        tail.x += deltaToMoveCloser(head.x, tail.x);
        tail.y += deltaToMoveCloser(head.y, tail.y);
    }
    return tail;
}

// result1
let head = new Knot(0,0);
let tail = new Knot(0,0);
const tailVisited = new Set();
tailVisited.add(tail.toString());

moves.forEach(([direction, count]) => {
    for (let i = 0; i < count; i++) {
        head = head.add(headDeltas[direction]);
        tail = calcNewTail(head, tail);
        tailVisited.add(tail.toString());
        //console.log({direction, head: head.toString(), tail: tail.toString()})
    }
});
const result1 = tailVisited.size;

// result2
const knots = [];
for (let i = 0; i < 10; i++) knots.push(new Knot(0,0));
const knotVisited = new Set();
knotVisited.add(knots.at(-1).toString());

moves.forEach(([direction, count]) => {
    for (let i = 0; i < count; i++) {
        knots[0] = knots[0].add(headDeltas[direction]);
        for (let k = 1; k < knots.length; k++) {
            knots[k] = calcNewTail(knots[k-1], knots[k]);
        }
        knotVisited.add(knots.at(-1).toString());
    }
});
const result2 = knotVisited.size;

console.log({result1, result2})