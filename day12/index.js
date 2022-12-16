import { loadData } from './loadData.js';

let rawData;
rawData = await loadData('./input.data');
//rawData = await loadData('./test.data');

const getGridData = () => {
    return rawData.split(/\r?\n/).map((line, row) => [...line].map((code, col) => { 
        return { 
            row, col, 
            code: code,
            height : code === 'S' ? 0 : (code === 'E' ? 25 : code.charCodeAt(0) - 'a'.charCodeAt(0)),
        }}));
}

const findCandidates = (cell, grid, filterCandidates) => {
    const candidates = [];
    if (cell.row > 0) candidates.push(grid[cell.row - 1][cell.col]);
    if (cell.row < grid.length - 1) candidates.push(grid[cell.row + 1][cell.col]);
    if (cell.col > 0) candidates.push(grid[cell.row][cell.col - 1]);
    if (cell.col < grid[cell.row].length - 1) candidates.push(grid[cell.row][cell.col + 1]);
    return candidates.filter(filterCandidates);
}

function dijkstra(initial, grid, goalReached, validCandidate) {
    const Q = [];
    grid.forEach((row, r) => [...row].forEach((cell, c) => { 
        cell.dist = Infinity; 
        Q.push(cell); 
    }));
    initial.dist = 0;
    while(Q.length > 0) {
        Q.sort((a, b) => a.dist - b.dist);
        let u = Q.splice(0, 1)[0];
        if (goalReached(u)) {
            return u.dist;
        }
        const candidates = findCandidates(u, grid, (c) => Q.includes(c) && validCandidate(u, c));
        candidates.forEach(v => v.dist = Math.min(v.dist, u.dist + 1));
    }
    return Infinity;
}

const grid = getGridData();
const start = grid.flatMap(row => [...row]).filter(cell => cell.code == 'S')[0];
const end = grid.flatMap(row => [...row]).filter(cell => cell.code == 'E')[0];

const getResult1 = () => {
    const goalReached = (goal) => goal === end; 
    const validCandidate = (actual, candidate) => (candidate.height - actual.height) <= 1;
    return dijkstra(start, grid, goalReached, validCandidate);
}

const getResult2 = () => {
    const goalReached = (goal) => goal.height === 0;
    const validCandidate = (actual, candidate) => (actual.height - candidate.height) <= 1;
    
    return dijkstra(end, grid, goalReached, validCandidate);
}

console.log({result1: getResult1(), result2: getResult2()});
