import { loadData } from './loadData.js';

let rawData;
rawData = await loadData('./input.data');
//rawData = await loadData('./test.data');

const cubes = rawData.split(/\r?\n/).map(line => [...line.split(',').map(Number)]);

const key = (cube) => cube.join(',');

const adjacents = (cube) => [
    [cube[0] - 1, cube[1], cube[2]],
    [cube[0] + 1, cube[1], cube[2]],
    [cube[0], cube[1] - 1, cube[2]],
    [cube[0], cube[1] + 1, cube[2]],
    [cube[0], cube[1], cube[2] - 1],
    [cube[0], cube[1], cube[2] + 1],
];

const getResult1 = () => {
    const cubesSet = new Set(cubes.map(c => key(c)));
    return cubes.reduce((sides, cube) => sides + adjacents(cube).filter((c) => ! cubesSet.has(key(c))).length, 0);
};

const getResult2 = () => {
    const cubesSet = new Set(cubes.map(c => key(c)));
    const box = cubes.reduce((a, c) => { return {
        min: a.min.map((a, i) => Math.min(a, c[i] - 1)),
        max: a.max.map((a, i) => Math.max(a, c[i] + 1)),
    }}, {min: [+Infinity, +Infinity, +Infinity], max: [-Infinity, -Infinity, -Infinity]});

    const water = new Set();
    const visited = new Set();
    const stack = [box.min];
    while(stack.length > 0) {
        const actual = stack.pop();
        const actualKey = key(actual)
        if (cubesSet.has(actualKey)) continue;
        if (visited.has(actualKey)) continue;
        if (box.min.some((min, ndx) => min > actual[ndx])) continue;
        if (box.max.some((max, ndx) => max < actual[ndx])) continue;
        water.add(actualKey);
        visited.add(actualKey);
        stack.push(...adjacents(actual));
    }
    
    return cubes.reduce((sides, cube) => sides + adjacents(cube).filter((c) => water.has(key(c))).length, 0)
};


console.log({result1: getResult1(), result2: getResult2()});
