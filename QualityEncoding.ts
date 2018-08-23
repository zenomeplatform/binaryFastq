export function encode(str: string) {
  const result = Buffer.alloc(str.length);
  for (let i = 0; i < str.length; i++) {
    result [i] = str.charCodeAt(i) - 33;
  }
  return result;
}


export function decode(buf: Buffer) {
  let result = ""
  for (let i = 0; i < buf.length; i++) {
    result += String.fromCharCode(buf[i] + 33)
  }
  return result;
}
