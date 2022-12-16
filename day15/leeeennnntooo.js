import { loadData } from './loadData.js';

let rawData;
rawData = await loadData('./input.data');
//rawData = await loadData('./test.data');

class Point {
    constructor(x, y) { this.x = x; this.y = y; }
    manhattan(other) { return Math.abs(this.x - other.x) + Math.abs(this.y - other.y)}
}

class Sensor {
    constructor(sx, sy, bx, by) { 
        this.s = new Point(sx, sy); 
        this.b = new Point(bx, by);
    }
    distanceToBeacon() { return this.s.manhattan(this.b); }
    distanceToRow(row) { return this.s.manhattan(new Point(this.s.x, row)); }
}

const parseRegex = new RegExp(/Sensor at x=(-?\d+), y=(-?\d+): closest beacon is at x=(-?\d+), y=(-?\d+)/);
const data = rawData.split(/\r?\n/).map(line =>  new Sensor(...line.match(parseRegex).splice(1).map(Number)));
//console.log(data);

const isTestData = () => data.length == 14;


const testCoverageForRow = referenceRow => {
    return data
        .filter(sensor => sensor.distanceToBeacon() >= sensor.distanceToRow(referenceRow))
        .reduce((state, sensor) => {
            if (sensor.b.y == referenceRow) {
                state.notPossible.delete(sensor.b.x)
                state.sensorOrBeacon.add(sensor.b.x);
            }
            if (sensor.s.y == referenceRow) {
                state.notPossible.delete(sensor.s.x)
                state.sensorOrBeacon.add(sensor.s.x);
            }
            const extraDistance = sensor.distanceToBeacon() - sensor.distanceToRow(referenceRow);
            for (let x = sensor.s.x - extraDistance; x <= sensor.s.x + extraDistance; x++) {
                if (! state.sensorOrBeacon.has(x)) {
                    state.notPossible.add(x)
                }
            }
            return state;
        }, {sensorOrBeacon: new Set(), notPossible: new Set()});
}

const getResult1 = () => {
    console.log('... computing result 1')
    const rowToTest = isTestData() ? 10 : 2_000_000;
    return testCoverageForRow(rowToTest).notPossible.size;
};


const getResult2 = () => {
    console.log('... computing result 2')
    const max = isTestData() ? 20 : 4_000_000;;
    for (let y = 0; y < max; y++) {
        const coverage = testCoverageForRow(y);
        const allSpots = [...Array.from(coverage.notPossible), ...Array.from(coverage.sensorOrBeacon)]
            .filter(x => x >= 0 && x <= max)
            .sort((a, b) => a - b);
        console.log(y, allSpots.length) //, ...allSpots)
        if (allSpots.length < max + 1) {
            for(let x = 0; x < allSpots.at(-1); x++) {
                if (! allSpots.includes(x)) {
                    return x * 4_000_000 + y;
                }
            }
        }
    }
    return undefined;
};

console.log({result1: getResult1(), result2: getResult2()});
