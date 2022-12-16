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
const sensorsData = rawData.split(/\r?\n/).map(line =>  new Sensor(...line.match(parseRegex).splice(1).map(Number)));
//console.log(sensorsData);

const isTestData = () => sensorsData.length == 14;

const getSensorsAndBeaconsInRow = row => new Set(
    sensorsData
        .filter(sensor => sensor.s.y == row || sensor.b.y == row)
        .map(sensor => sensor.x)
).size;

const getCoverageForRow = row => {
    const coverage = sensorsData
        .filter(sensor => sensor.distanceToBeacon() >= sensor.distanceToRow(row))
        .reduce((scanned, sensor) => {
            const extraDistance = sensor.distanceToBeacon() - sensor.distanceToRow(row);
            scanned.push([sensor.s.x - extraDistance, sensor.s.x + extraDistance + 1])
            return scanned;
        }, []);
        return coverage
            .sort((a, b) => a[0] - b[0] || a[1] - b[1])
            .reduce((reduced, x) => {
                const actual = reduced.pop();
//                console.log("xxx",actual, x)
                if (actual[1] < x[0]) {
                    if (actual[0] != +Infinity) reduced.push(actual);
                    reduced.push(x);
                } else {
                    reduced.push([Math.min(actual[0], x[0]), Math.max(actual[1], x[1])]);
                }
                return reduced;
            }, [[+Infinity, -Infinity]]);
}

const getCombinedCoverageForRow = (row) => getCoverageForRow(row).map(x => x[1] - x[0]).reduce((sum, x) => sum + x, 0);

const getResult1 = () => {
    console.log('... computing result 1');
    const rowToTest = isTestData() ? 10 : 2_000_000;
    return getCombinedCoverageForRow(rowToTest) - getSensorsAndBeaconsInRow(rowToTest);
};


const getResult2 = () => {
    console.log('... computing result 2')
    const max = isTestData() ? 20 : 4_000_000;;
    for (let y = 0; y <= max; y++) {
        const coverage = getCoverageForRow(y);
        //console.log("testing", y, coverage)
        if (coverage.length > 1) {
            return coverage[0][1] * 4_000_000 + y;
        }
    }
    return undefined;
};

console.log({result1: getResult1(), result2: getResult2()});
