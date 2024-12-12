const input = await Deno.readTextFile("input.txt");
type Pos = {
    i: number;
    j: number;
};
const map = input.split("\n").map((r) => r.split(""));
const antis = map.map((r) => r.map(() => "."));
const row = map.length;
const col = map[0].length;
const dict = new Map<string, Pos[]>();
let count = 0;
for (let i = 0; i < row; i++) {
    for (let j = 0; j < col; j++) {
        const mark = map[i][j];
        if (mark === ".") {
            continue;
        }
        const list = dict.get(mark) ?? [];
        for (const pos of list) {
            const di = i - pos.i;
            const dj = j - pos.j;
            const p = { i: pos.i, j: pos.j };
            while (p.i >= 0 && p.j >= 0 && p.i < row && p.j < col) {
                p.i -= di;
                p.j -= dj;
            }
            for (
                p.i += di, p.j += dj;
                p.i < row && p.j < col && p.i >= 0 && p.j >= 0;
                p.i += di, p.j += dj
            ) {
                if (antis[p.i]?.[p.j] === ".") {
                    antis[p.i][p.j] = "#";
                    count++;
                }
            }
        }
        dict.set(mark, [...list, { i, j }]);
    }
}
console.log(`antinodes: ${count}`);
