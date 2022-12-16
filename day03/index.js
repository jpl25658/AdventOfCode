import { resourceLimits } from 'worker_threads';
import { loadData } from './loadData.js'

//const rawData = await loadData('./test.data')
const rawData = await loadData('./input.data')
const data = rawData.split(/\r?\n/)

const ITEMS_PRIORITY = " abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
const priority = item => ITEMS_PRIORITY.indexOf(item);

const result1 = data.reduce((acum, rucksack) => {
    const separator = rucksack.length / 2
    const itemsPart1 = rucksack.slice(0, separator).split("")
    const part2 = rucksack.slice(separator)
    const itemDuplicated = itemsPart1.find(item => part2.includes(item))
    return acum + priority(itemDuplicated)
}, 0)
console.log({result1})

const GROUP_SIZE = 3
let result2 = 0
for(let i = 0; i < data.length; i += GROUP_SIZE) {
    const items1 = data[i].split("")
    const sack2 = data[i + 1]
    const sack3 = data[i + 2]
    const itemShared = items1.find(item => sack2.includes(item) && sack3.includes(item))
    result2 += priority(itemShared)
}

console.log({result2})