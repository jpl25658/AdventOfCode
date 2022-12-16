import { loadData } from './loadData.js';

class Move {
    constructor(qty, from, to) {
        this.qty = qty;
        this.from = from;
        this.to = to;
    }
}

class Stack {
    constructor(name, initial) {
        this.name = name;
        this.crates = initial || [];
    };
    push(crate) { this.crates.push(crate); }
    pop() { return this.crates.pop(); }
    peek() { return this.crates.at(-1) || ''; }
}

class ExtendedStack extends Stack {
    pop(qty) { return this.crates.splice(-qty); }
    push(block) { this.crates.push(...block); }
}

let rawMoves;
let rawStacks

rawMoves = await loadData('./input.data.moves');
rawStacks = await loadData('./input.data.stacks');
//rawMoves = await loadData('./test.data.moves');
//rawStacks = await loadData('./test.data.stacks');

const moves = rawMoves.split(/\r?\n/).map(m => m.split(' ')).map(([_1, qty, _2, from, _3, to]) => new Move(qty, from, to));

// round1
const stacks1 = rawStacks.split(/\r?\n/).map(m => m.split(' ')).map(([name, crates]) => new Stack(name, [...crates]));
stacks1.unshift(new Stack('0')); 

moves.forEach(move => {
    for(let i = 0; i < move.qty; i++) 
        stacks1[move.to].push(stacks1[move.from].pop());
});
const result1 = stacks1.reduce((acc, s) => acc + s.peek(), '');

// round2
const stacks2 = rawStacks.split(/\r?\n/).map(m => m.split(' ')).map(([name, crates]) => new ExtendedStack(name, [...crates]));
stacks2.unshift(new Stack('0')); 
moves.forEach(move => { stacks2[move.to].push(stacks2[move.from].pop(move.qty)); });
const result2 = stacks2.reduce((acc, s) => acc + s.peek(), '');

// output results
console.log({result1, result2})
