
export enum Nucleotide {
  A = 0, // 000
  C = 1, // 001
  G = 2, // 010
  T = 3, // 011
  N = 4  // 100
}


export function encodeLetter(letter: string) {
  if (Nucleotide[letter] === undefined) {
    throw new Error("Incorrect symbol:" + letter);
  }
  return Nucleotide[letter];
}


export function encode(sequence, quality) {
  console.log({ sequence, quality }, sequence.length)

  if (sequence.length !== quality.length) {
    throw new Error("Sequence length must be the same as quality length.");
  }

  const buf = Buffer.alloc(sequence.length);

  for (let i = 0; i < sequence.length; i++) {
    const Q = quality.charCodeAt(i) - 33;
    const S = encodeLetter(sequence[i]);

    if (Q > 41 || Q < 0 || S < 0 || S > 4) {
      throw new Error(`Incorrect data: ${Q} (${quality[i]}) ${S} `);
    }

    buf[i] = Q * 5 + S;
  }

  return buf;
}


export function decode(buf: Buffer) {

  let sequence = "";
  let quality = "";


  for (const data of buf) {
    const S = data % 5;
    const Q = (data - S) / 5;

    quality  += String.fromCharCode(Q + 33);
    sequence += Nucleotide[S];
  }

  return { sequence, quality };
}
