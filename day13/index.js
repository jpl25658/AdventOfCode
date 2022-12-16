import { loadData } from './loadData.js';

let rawData;
rawData = await loadData('./input.data');
//rawData = await loadData('./test.data');

const pairs = rawData.split(/\r?\n\r?\n/).map(pair =>  pair.split(/\r?\n/)).map(([left, right]) => [eval(left), eval(right)]);

const compareNumbers = (n1, n2) => n1 - n2; // -1, 0, 1

const compareArrays = (a1, a2) => {
    const common = Math.min(a1.length, a2.length);
    for(let i = 0; i < common; i++) {
        const result = compare([a1[i], a2[i]]);
        if (('undefined' !== typeof result) && (result !== 0))
            return result;
    }
    return a1.length - a2.length;
}

const compare = (([left, right]) => {
    const isLeftNumber = ! Array.isArray(left);
    const isRightNumber = ! Array.isArray(right);
    if (isLeftNumber && isRightNumber) {
        return compareNumbers(left, right);
    } else {
        const leftArr = isLeftNumber ? [ left ] : left;
        const rightArr = isRightNumber ? [ right] : right;
        return compareArrays(leftArr, rightArr);
    }
});

const getResult1 = () => {
    return pairs.map(compare).flatMap((result, ndx) => [result < 0 ? ndx+1 : 0]).reduce((s, r) => s + r, 0);
}

const getResult2 = () => {
    const packets = pairs.flatMap(x => x);
    const markers = [ [[2]], [[6]] ];
    markers.map(m => packets.push(m))
    return packets.sort((p1, p2) => compare([p1, p2])).map((p, n) => markers.includes(p) ? n+1 : 1).reduce((r, n) => r*n); 
}

console.log({result1: getResult1(), result2: getResult2()});
