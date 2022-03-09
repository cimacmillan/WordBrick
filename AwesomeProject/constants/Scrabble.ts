
// https://scrabble.hasbro.com/en-us/faq#:~:text=Scrabble%20tile%20letter%20distribution%20is,of%20all%20the%20Scrabble%20tiles%3F
// A-9, B-2, C-2, D-4, E-12, F-2, G-3, H-2, I-9, J-1, K-1, L-4, M-2, N-6, O-8, P-2, Q-1, R-6, S-4, T-6, U-4, V-2, W-2, X-1, Y-2, Z-1 and Blanks-2.

type LetterConfig = [string, number];

const ScrabbleDistribution: LetterConfig[] = [

];


const alpha = Array.from(Array(26)).map((e, i) => i + 65);
const alphabet = alpha.map((x) => String.fromCharCode(x));

export function sampleLetter(): string {
    const random = Math.floor(Math.random() * alphabet.length);
    return alphabet[random];
}
