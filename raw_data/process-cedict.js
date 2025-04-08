import cedict from './dict/cedict.json' with { type: "json" };
import fs from 'fs';

function formatCharacters(characters) {
    const BLOCK_LENGTH = 1000;

    return characters
        .filter(character => character.traditional.length === 1)
        .map(character => ({
            literal: character.traditional,
            misc: {
                grade: null,
            },
            readings: character.pinyin
                .split(' ')
                .map(value => ({
                    type: 'pinyin',
                    value,
                })),
            meanings: character.glosses
                .map(value => ({
                    lang: 'en',
                    value,
                }))
        }))
        .reduce((acc, character, idx) => {
            const blockIndex = Math.floor(idx/BLOCK_LENGTH)

            if(!acc[blockIndex]) {
                acc[blockIndex] = [];
            }
            
            acc[blockIndex].push(character);

            return acc;
        }, []);
}

const characterBlocks = formatCharacters(cedict)

for (let idx in characterBlocks) {
    fs.writeFile(`./output/ch-${idx}.json`, JSON.stringify(characterBlocks[idx]), 'utf8', () => {})
}

console.log('COMPLETE')
