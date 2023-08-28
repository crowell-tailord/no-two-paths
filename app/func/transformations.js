/*
....2x23■■
.....crøwexx
⌙ transform specific texts to different capitalization such as the word 'Rebel'
⌙ accepts the entire generated text and searches for the word(s)
*/

export default async function translate(text, punc) {
    const TXT = text.replace('rebel', 'Rebel');
    if (punc) {
        TXT.slice(0, -1);
    }
    return TXT;
}