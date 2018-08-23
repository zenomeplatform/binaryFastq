import { encode as encode_both,  decode as decode_both  } from './NucleotideQualityEncoding';
import { Transform, Readable } from "stream";

export function parseblock(block) {
  let [ info, sequence, _, quality ] = block;
  if (info[0] !== "@") throw new Error("First line in block should start with @.")
  if (_ !== "+") throw new Error("3rd line in block should be +.")
  const data = encode_both(sequence, quality);

  info = info.slice(1).split(" ").map((item) => item.split(":"));

  /** From string to numbers */
  const instrument    =          info[0][0];
  const run_id        = parseInt(info[0][1], 10);
  const flowcell_id   =          info[0][2];
  const flowcell_lane = parseInt(info[0][3], 10);
  const tile          = parseInt(info[0][4], 10);
  const x             = parseInt(info[0][5], 10);
  const y             = parseInt(info[0][6], 10);
  const pair          =          info[1][0]
  const filtered      =      !!  info[1][1]
  const control       = parseInt(info[1][2], 10)
  const index_seq     =          info[1][3]

  const flowcell = {
    id: flowcell_id,
    lane: flowcell_lane
  }

  const header = { instrument, run_id, flowcell, tile, pair, filtered, control, index_seq }
  const pos = { x, y }
  /** Result */
  return { header, pos, data }
}

export function createParser() {
  const block = [];
  return new Transform ({
    objectMode: true,
    transform(line, encoding, callback) {
      if (block.push(line.toString()) === 4) {
        callback(null, parseblock(block.splice(0, 4)));
      } else callback();
    }
  });
}
