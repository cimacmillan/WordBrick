import { EnglishWords } from "./Words";

const AllWords = EnglishWords.map(word => word.toUpperCase()).filter(word => word.length >= 3);

// [score, begin index of line that's word, end index of line that's word]
export function getLineScore(line: (string | undefined)[]): [number, number, number, string] {
    // Combination of words from line with begin and end index from line
    let combinations: [string, number, number][] = [];
    const existingCombinations: {[key: string]: boolean} = {};

    for (let start = 0; start < line.length; start++) {
        for (let end = start + 1; end < line.length + 1; end++) {
            let word = "";
            for (let i = start; i < end; i++) {
                if (line[i] === undefined) {
                    break;
                }
                word += line[i]
            }
            if (word && !existingCombinations[word]) {
                combinations.push([word, start, end])
                existingCombinations[word] = true;
            }
        }
    }

    // for (let i = 0; i < combinations.length; i ++) {
    //     console.log(`\"${combinations[i][0]}\"`);
    // }

    let bestScore = 0;
    let bestBegin = 0;
    let bestEnd = 0;
    let bestWord = "";

    for (let combination of combinations) {
        const [word, begin, end] = combination;

        const doesContain = AllWords.find(englishWord => englishWord === word);
        if (doesContain && doesContain.length > bestScore) {
            // console.log(doesContain, begin, end);
            bestScore = doesContain.length;
            bestBegin = begin;
            bestEnd = end;
            bestWord = doesContain;
        }
    }



    return [bestScore, bestBegin, bestEnd, bestWord];
}
