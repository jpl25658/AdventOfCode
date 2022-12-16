import { loadData } from './loadData.js';

let rawData;
rawData = await loadData('./input.data');
//rawData = await loadData('./test.data');
const lines = rawData.split(/\r?\n/);

const IS_FILE = 'file';
const IS_DIR = 'dir';
const DIR_ENTER = 'cd';
const DIR_INIT = 'ls';
const DIR_EXIT = 'up';
const END_TREE = 'end';
const tokens = lines.map((line) => {
    const [p0, p1, p2] = line.split(' ');
    if (p0 == '$') {
        if (p1 == 'cd') {
            return { type: p2 == '..' ? DIR_EXIT : DIR_ENTER };
        }
        if (p1 == 'ls') {
            return { type: DIR_INIT };
        } 
    } else {
        const isDir = p0 == 'dir';
        return {  type: isDir ? IS_DIR : IS_FILE,  size: isDir ? 0 : +p0};
    }
    return { type: END_TREE };
});
tokens.push({ type: END_TREE });

const sizes = tokens.reduce((state, token) => {
    if (token.type == DIR_ENTER) {
        state.levels.push(state.actual);
    }
    if (token.type == DIR_INIT) {
        state.actual = 0;   
    }
    if (token.type == DIR_EXIT) {
        state.sizes.push(state.actual);
        state.actual += state.levels.pop();
    }
    if (token.type == IS_FILE || token.type == IS_DIR) {
        state.actual += token.size;
    }
    if (token.type == END_TREE) {
        while(state.levels.length > 0) {
            state.sizes.push(state.actual);
            state.actual += state.levels.pop();
        }
    }
    return state;
}, { sizes: [], levels: [], actual: 0 }).sizes;

// result1 
const result1 = sizes.filter(s => s < 100_000).reduce((acum, s) => acum + s, 0);

// result2
sizes.sort((a, b) => a - b);
const spaceUnused = 70_000_000 - sizes.at(-1);
const result2 = sizes[sizes.findIndex(s => s >= 30_000_000 - spaceUnused)];

console.log({result1, result2})
