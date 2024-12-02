const input = await Deno.readTextFile("input.txt");
const lefts = input.trim().split("\n").map((s) => parseInt(s.split(/\s+/)[0]))
    .sort((a, b) => a - b);
const rights = input.trim().split("\n").map((s) => parseInt(s.split(/\s+/)[1]))
    .sort((a, b) => a - b);
const dist = lefts.reduce((a, left, i) => a + Math.abs(left - rights[i]), 0);
console.log(`dist: ${dist}`);
const map: Map<number, number> = rights.reduce(
    (m, v) => m.set(v, (m.get(v) ?? 0) + 1),
    new Map(),
);
const similar = lefts.reduce((a, v) => a + v * (map.get(v) ?? 0), 0);
console.log(`similar: ${similar}`);
