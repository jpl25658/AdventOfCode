import { loadData } from './loadData.js';

let rawData;
rawData = await loadData('./input.data');
rawData = await loadData('./test.data');

const ROCK = '#';
const AIR = '.';
const SAND = 'o';
const SOURCE_SAND_X = 500;
const SOURCE_SAND_Y = 0;

const getCaveInfo = () => {
    const cave = [];
    let yMax = -Infinity;
    rawData.split(/\r?\n/).map(line => line.split('->')).forEach(points => {
        while (points.length > 1) {
            const [x0, y0, x1, y1] = points.slice(0,2).flatMap(s => s.split(','));
            points.splice(0, 1);
            const [xStart, xEnd] = [Math.min(x0, x1), Math.max(x0, x1)];
            const [yStart, yEnd] = [Math.min(y0, y1), Math.max(y0, y1)];
            for(let x = xStart; x <= xEnd; x++) {
                for(let y = yStart; y <= yEnd; y++) {
                    if ('undefined' === typeof cave[x]) cave[x] = [];
                    cave[x][y] = ROCK;
                }
            }
            yMax = Math.max(yMax, yEnd);
        }
    });
    cave.yMax = yMax;
    return cave;
}

const draw = (cave, step) => {
    console.log('STEP: ' + step || ' ')
    for(let y = 0; y <= cave.yMax; y++) {
        console.log(cave.map(cx => isAir(cx[y]) ? AIR : cx[y]).join(''))
    }
    console.log('')
}

const isAir = tile => 'undefined' == typeof(tile);

const dropSand = (cave) => {
    let [x, y] = [SOURCE_SAND_X, SOURCE_SAND_Y];
    while(y < cave.yMax) {
        if (isAir(cave[x][y+1])) {
            y++;
        } else {
            if ('undefined' === typeof cave[x-1]) cave[x-1] = []; 
            if ('undefined' === typeof cave[x+1]) cave[x+1] = [];
            if (isAir(cave[x-1][y+1])) {
                x--; y++;
            } else if (isAir(cave[x+1][y+1])) {
                x++; y++;
            } else {
                cave[x][y] = SAND;
                return false;
            }
        }
    }
    cave[x][y] = SAND;
    return true;
}

const fillCaveWithSandUntil = (endCondition, isEndlessDeep) => {
    const cave = getCaveInfo();
    if (! isEndlessDeep) 
        cave.yMax += 1;
    let step = 0;
    do {
        dropSand(cave); 
        step++;
        draw(cave)
     } while(!endCondition(cave)) ;
    draw(cave);
    return step;
}

const sandFallsIntoAbyss = cave => cave.map(cx => cx[cave.yMax]).findIndex(tile => tile === SAND) != -1;

const getResult1 = () => fillCaveWithSandUntil(sandFallsIntoAbyss, true) - 1;

const sourceSandIsBlocked = cave => ! isAir(cave[SOURCE_SAND_X][SOURCE_SAND_Y]);
const getResult2 = () => fillCaveWithSandUntil(sourceSandIsBlocked, false);

console.log({result1: getResult1(), result2: getResult2()});
