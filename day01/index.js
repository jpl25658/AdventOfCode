import { loadData } from './loadData.js';

let rawData;

rawData = await loadData('./input.data');
//rawData = await loadData('./test.data');

const add = (s, n) => s + n;
const desc = (a, b) => b - a;
const first = (n) => (_, ndx) => ndx < n;

const data = rawData.split(/\r?\n\r?\n/).map(block => block.split(/\r?\n/).map(Number)).map(elf => elf.reduce(add, 0));
const topCalories = n => data.sort(desc).filter(first(n)).reduce(add, 0);

const getResult1 = () => topCalories(1);
const getResult2 = () => topCalories(3);

// output results
console.log({result1: getResult1(), result2: getResult2()})
