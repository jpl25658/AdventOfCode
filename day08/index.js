import { loadData } from './loadData.js';

let rawData;
rawData = await loadData('./input.data');
//rawData = await loadData('./test.data');

const trees = rawData.split(/\r?\n/).map(l => l.split('').map(Number));

console.log(trees)

const size = trees.length; // square matrix

// result1
function checkVisible(treeArray, ndx) {
    return (treeArray.slice(0, ndx).findIndex(x => x >= treeArray[ndx]) == -1)
        || (treeArray.slice(ndx + 1).findIndex(x => x >= treeArray[ndx]) == -1)
}

// result1
let result1 = (size - 1) * 4; // edge trees
for(let row = 1; row < size - 1; row++) {
    for(let col = 1; col < size - 1; col++) {
        if (checkVisible(trees[row], col) || checkVisible(trees.map(r => r[col]), row)) {
            result1++;
        }
    }
}

// result2
function findTallerDistance(treeArray, tree, defaultDistance) {
    const tallerDistance = treeArray.findIndex(t => t >= tree) + 1;
    return (tallerDistance > 0 ? tallerDistance : defaultDistance);
}
function getViewingDistance(treeArray, ndx) {
    let eastOrNorth = findTallerDistance(treeArray.slice(0, ndx).reverse(), treeArray[ndx], ndx);
    let westOrSouth = findTallerDistance(treeArray.slice(ndx + 1), treeArray[ndx], size - 1 - ndx);
    return eastOrNorth * westOrSouth;
}

let result2 = 0;
for(let row = 1; row < size - 1; row++) {
    for(let col = 1; col < size - 1; col++) {  
        const scenicScore = getViewingDistance(trees[row], col) * getViewingDistance(trees.map(r => r[col]), row);
        if (scenicScore > result2) {
            result2 = scenicScore;
        }
    }
}

console.log({r1, result1, result2})