
export enum NucleotideReduldant {
  A = 1 << 0,             // 0001
  C = 1 << 1,             // 0010
  G = 1 << 2,             // 0100
  T = 1 << 3,             // 1000
  M = A + C,              // 0011
  R = A     + G,          // 0101
  S =     C + G,          // 0110
  V = A + C + G,          // 0111
  W = A         + T,      // 1001
  Y =     C     + T,      // 1010
  H = A + C     + T,      // 1011
  K =         G + T,      // 1100
  D = A     + G + T,      // 1101
  B =     C + G + T,      // 1110
  N = A + C + G + T       // 1111
}


export function encodeLetter(letter: string) {
  if (letter === "-") return 0;
  if (NucleotideReduldant[letter])
    return NucleotideReduldant[letter];
  throw new Error("Incorrect symbol.");
}


export function encode(str: string) {
  if (str.length % 2 !== 0) {
    throw new Error("Sequence length must be even to use this encoding.");
  }

  const buf = Buffer.alloc(str.length / 2);

  for (let i = 0; i < str.length; i += 2) {
    const Nuc1 = encodeLetter(str[i]);
    const Nuc2 = encodeLetter(str[i + 1]);
    buf[i / 2] = (Nuc1 << 4) | Nuc2;
  }

  return buf;
}


export function decode(buf: Buffer) {
  const result = [];

  for (const Pair of buf) result.push(
    Pair & 0b11110000 >> 4, // xxxx....
    Pair & 0b00001111 >> 0  // ....xxxx
  );

  return result.map(
    (code: number) => NucleotideReduldant[code]
  ).join("");
}
