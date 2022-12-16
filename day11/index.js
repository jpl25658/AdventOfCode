import { loadData } from './loadData.js';
import { lcm as LCM } from 'mathjs';

let rawData;
rawData = await loadData('./input.data');
//rawData = await loadData('./test.data');

const monkeysData = rawData.split(/\r?\n{2}/);

const getMonkeysInitialState = () => {
    return monkeysData.reduce((monkeys, data) => {
        const [_, items, operation, test, ifTrue, ifFalse] = data.split(/\r?\n/).map(line => line.split(':')[1]);
        monkeys.push({
            items: items.split(',').map(Number),
            operation: operation.split('=').at(-1).trim(),
            test: Number(test.split(' ').at(-1)),
            ifTrue: Number(ifTrue.split(' ').at(-1)),
            ifFalse: Number(ifFalse.split(' ').at(-1)),
            inspections: 0,
        });
        return monkeys;
    }, []);
}
let monkeys;

// result1
monkeys = getMonkeysInitialState();
for (let round = 0; round < 20; round++) {
    monkeys.forEach(monkey => {
        while(monkey.items.length > 0) {
            monkey.inspections++;
            const old = monkey.items.splice(0,1)[0];
            const newVal = Math.floor(eval(monkey.operation) / 3);
            const nextMonkey = (newVal % monkey.test == 0) ? monkey.ifTrue : monkey.ifFalse;
            monkeys[nextMonkey].items.push(newVal);
        }  
    });
}
const result1 = monkeys.map(m => m.inspections).sort((a, b) => b - a).reduce((a, n, ndx) => ndx < 2 ? a * n : a, 1);

/*
    x % d == 0 if and only if x ==
    X -> (a * D) + z   () 
    find n divisible by d:
    n can be written as  (a * d) + z ... if z == 0 then is divisible (n / d = a) and z < d is guaranteed.
    So, we don't need to keep the original (and big) number n, we only need to store z between iterations.
    To be usable for all monkeys calculation, we need to take the least common multiple of all monkeys tests
    as the value for d. This way the discarted portion of the numbe.
 */
// result2
const lcm = LCM(...monkeys.map(m => m.test));
monkeys = getMonkeysInitialState();
for (let round = 0; round < 10000; round++) {
    monkeys.forEach((monkey, ndx) => {
        //if (ndx == 2) console.log({round, ndx, inspections: monkey.inspections, items: monkey.items})
        while(monkey.items.length > 0) {
            monkey.inspections++;
            const old = monkey.items.splice(0,1)[0];
            const newVal = eval(monkey.operation) % lcm;
            const nextMonkey = (newVal % monkey.test == 0) ? monkey.ifTrue : monkey.ifFalse;
            monkeys[nextMonkey].items.push(newVal);
        }  
    });
    //([19, 999, 1999, 2999, 3999, 4999, 5999, 6999, 7999, 8999, 9999].includes(round)) && console.log({round: round + 1, m: monkeys.map(m=> m.inspections)})
}
const result2 = monkeys.map(m => m.inspections).sort((a, b) => b - a).reduce((a, n, ndx) => ndx < 2 ? a * n : a, 1);

console.log({result1, result2})
