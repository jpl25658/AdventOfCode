import { exit } from 'process'
import { loadData } from './loadData.js'

//const rawData = await loadData('./test.data')
const rawData = await loadData('./input.data')
const data = rawData.split(/\r?\n/)

const assignments = 
    data.map(d => d.split(','))
        .map(assignment => 
                assignment.map(range => 
                    range.split('-').map(strValue => +strValue)));

console.log(assignments)

// round1: fully contained range
const fullyContains = ([r1_start, r1_end], [r2_start, r2_end]) => r1_start <= r2_start && r1_end >= r2_end 

// round2: count overlapped ranges
const isInRange = (range_start, range_end, val) => val >= range_start && val <= range_end
const overlapped = ([r1_start, r1_end], [r2_start, r2_end]) => isInRange(r1_start, r1_end, r2_start) || isInRange(r1_start, r1_end, r2_end) 

const oneRangeContainsOther = ([range1, range2]) => fullyContains(range1, range2) || fullyContains(range2, range1)
const oneRangeOverlapsOther = ([range1, range2]) =>  overlapped(range1, range2) || fullyContains(range2, range1)

const result1 = assignments.filter(oneRangeContainsOther).length
const result2 = assignments.filter(oneRangeOverlapsOther).length

console.log({result1, result2})

