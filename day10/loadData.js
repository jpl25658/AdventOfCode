import fs from 'fs/promises';

export const loadData = async file => fs.readFile(file, { encoding: 'utf-8' });
