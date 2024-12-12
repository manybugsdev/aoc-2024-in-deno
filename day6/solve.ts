const input = await Deno.readTextFile("input.txt");
const map = input.split("\n").map((r) => r.split(""));
const r = map.length;
const c = map[0].length;
const i = map.flat().findIndex((v) => v === "^");
const sj = i % c;
const si = (i - sj) / r;
type Pos = [number, number];
let cur: Pos = [si, sj];
let dir: Pos = [0, -1];
function turn([i, j]: Pos): Pos {
    const m: Record<number, Record<number, Pos>> = {
        [0]: {
            [-1]: [-1, 0],
            [1]: [1, 0],
        },
        [1]: {
            [0]: [0, -1],
        },
        [-1]: {
            [0]: [0, 1],
        },
    };
    return m[i][j];
}
let a1 = 0;
const poslist: Pos[] = [];
while (true) {
    const [i, j] = cur;
    const c = map[i]?.[j];
    if (!c) {
        break;
    }
    if (c !== "X") {
        map[i][j] = "X";
        a1++;
        poslist.push([i, j]);
        continue;
    }
    const [di, dj] = dir;
    const [ni, nj] = [i + di, j + dj];
    const n = map[ni]?.[nj];
    if (n === "#") {
        dir = turn(dir);
        continue;
    }
    cur = [ni, nj];
}
console.log(`a1: ${a1}`);
type Hist = {
    pos: Pos;
    dir: Pos;
};
let a2 = 0;
let kk = 0;
for (const wallPos of poslist.slice(1)) {
    console.log(kk++);
    const map = input.split("\n").map((r) => r.split(""));
    map[wallPos[0]][wallPos[1]] = "#";
    const hists: Hist[] = [];
    let cur: Pos = [si, sj];
    let dir: Pos = [0, -1];
    while (true) {
        const [i, j] = cur;
        const [di, dj] = dir;
        if (
            hists.find((hists) =>
                hists.pos[0] === i && hists.pos[1] === j &&
                hists.dir[0] === di && hists.dir[1] === dj
            )
        ) {
            a2++;
            break;
        }
        hists.push({ pos: [i, j], dir: [di, dj] });
        const c = map[i]?.[j];
        if (!c) {
            break;
        }
        const [ni, nj] = [i + di, j + dj];
        const n = map[ni]?.[nj];
        if (n === "#") {
            dir = turn(dir);
            continue;
        }
        cur = [ni, nj];
    }
}
console.log(`a2: ${a2}`);
