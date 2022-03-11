
// https://scrabble.hasbro.com/en-us/faq#:~:text=Scrabble%20tile%20letter%20distribution%20is,of%20all%20the%20Scrabble%20tiles%3F
// A-9, B-2, C-2, D-4, E-12, F-2, G-3, H-2, I-9, J-1, K-1, L-4, M-2, N-6, O-8, P-2, Q-1, R-6, S-4, T-6, U-4, V-2, W-2, X-1, Y-2, Z-1 and Blanks-2.

type LetterConfig = [string, number];

const ScrabbleDistribution: LetterConfig[] = [
    ["A", 9],
    ["B", 2],
    ["C", 2],
    ["D", 4],
    ["E", 12],
    ["F", 2],
    ["G", 3],
    ["H", 2],
    ["I", 9],
    ["J", 1],
    ["K", 1],
    ["L", 4],
    ["M", 2],
    ["N", 6],
    ["O", 8],
    ["P", 2],
    ["Q", 1],
    ["R", 6],
    ["S", 4],
    ["T", 6],
    ["U", 4],
    ["V", 2],
    ["W", 2],
    ["X", 1],
    ["Y", 2],
    ["Z", 1]
];

let ScrabbleSum = 0;
const ScrabbleCumulative: LetterConfig[] = ScrabbleDistribution.map(([letter, value]) => {
    ScrabbleSum += value;
    return [letter, ScrabbleSum]
})

export function sampleLetter(): string {
    const random = Math.floor(Math.random() * ScrabbleSum);
    for (let x = 0; x < ScrabbleCumulative.length; x++) {
        const [letter, value] = ScrabbleCumulative[x];
        if (random < value) {
            return letter;
        }
    }
    return ScrabbleCumulative[ScrabbleCumulative.length - 1][0];
}
