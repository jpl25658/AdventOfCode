import { loadData } from './loadData.js';

let rawData;
rawData = await loadData('./input.data');
//rawData = await loadData('./test.data');

const instructions = rawData.split(/\r?\n/).map(m => m.split(' '));
//console.log(intructions)

class Cpu{
    clock; rX; signalStrength;
    constructor() {
        this.clock = 0;
        this.rX = 1;
        this.signalStrength = 0;
    }

    process(cod, arg) {
        cod == 'noop' && this.noop();
        cod == 'addx' && this.addx(+arg);
    }

    clockTick() {
        this.clock++;
        if ((this.clock - 20) % 40 == 0) {
            this.signalStrength += (this.clock * this.rX);
        }
    }

    noop() {
        this.clockTick();
    }

    addx(delta) {
        this.clockTick();
        this.clockTick();
        this.rX += delta;
    } 
}

const cpu = new Cpu();
instructions.forEach(([cod, arg]) => cpu.process(cod, arg))
console.log({result1: cpu.signalStrength})


// result2
class CpuWithDisplay extends Cpu {
    constructor() {
        super();
        this.display = Array.from(Array(6), () => { return Array(40).fill('.')});
    }

    render() {
        return this.display.reduce((output, line) => output + line.join('') + '\n', '\n')
    }

    clockTick = () => {
        super.clockTick();
        const [pY, pX] = [ Math.floor((this.clock - 1) / 40), (this.clock - 1) % 40 ];
        if (Math.abs(pX - this.rX) <= 1) {
            this.display[pY][pX] = '#';
        }
    }
}

const cpu2 = new CpuWithDisplay();
instructions.forEach(([cod, arg]) => cpu2.process(cod, arg))
console.log('result2:' + cpu2.render())