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
            for (
                const p of [{
                    i: 2 * i - pos.i,
                    j: 2 * j - pos.j,
                }, {
                    i: 2 * pos.i - i,
                    j: 2 * pos.j - j,
                }]
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
console.log(map.map((r) => r.join("")).join("\n"));
console.log(`antinodes: ${count}`);
