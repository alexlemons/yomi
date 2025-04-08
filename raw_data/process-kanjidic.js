import kanjidic from './dict/kanjidic.json' with { type: "json" };
import fs from 'fs';

const GRADES = [1, 2, 3, 4, 5, 6, 8, 9, 10]
const MEANING_MAX_LENGTH = 22

function formatKanji(kanji) {
    return kanji.map(item => ({
        literal: item.literal,
        misc: item.misc,
        readings: item.readings
            ?.filter(r => ['ja_on', 'ja_kun'].includes(r.type)),
        meanings: item.meanings
            ?.filter(m => m.lang === 'en')
            .filter(m => !m.value.includes('radical'))
            .filter(m => m.value.length <= MEANING_MAX_LENGTH)
    }))
}

const [withGrade, withoutGrade, ghost] = kanjidic
    .reduce((acc, kanji) => {
        if (kanji.misc.grade !== null) {
            acc[0].push(kanji);
        } else {
            if (kanji.meanings?.length) {
                acc[1].push(kanji);
            } else {
                acc[2].push(kanji);
            }
        }
        return acc;
    }, [[], [], []]);

for (let grade of GRADES) {
    const kanji = formatKanji(withGrade.filter(item => item.misc.grade === grade))
    
    fs.writeFile(`./output/kanji-${grade}.json`, JSON.stringify(kanji), 'utf8', () => {});
}

fs.writeFile(`./output/kanji-no-grade.json`, JSON.stringify(formatKanji(withoutGrade)), 'utf8', () => {});
fs.writeFile(`./output/kanji-ghost.json`, JSON.stringify(formatKanji(ghost)), 'utf8', () => {});

console.log('COMPLETE')