import { loadData } from './loadData.js';

let rawData;
rawData = await loadData('./input.data');
//rawData = await loadData('./test.data');

const signals = rawData.split(/\r?\n/)

const isMarker = (fragment) => [...fragment].map(letter => fragment.split(letter).length - 1).filter(n => n > 1).length == 0;

const extractBlockNonRepeating = (signal, blockSize) => {
    for (let i = blockSize; i < signal.length; i++) {
        if (isMarker(signal.slice(i - blockSize, i))) {
            return i;
        }
    }
}

// round 1 & 2
const START_PACKET_SIZE = 4
const START_MESSAGE_SIZE = 14
let result1;
let result2;
signals.forEach((signal) => {
    result1 = extractBlockNonRepeating(signal, START_PACKET_SIZE);
    result2 = extractBlockNonRepeating(signal, START_MESSAGE_SIZE);
});

// output results
console.log({result1, result2})
