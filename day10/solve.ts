function get(map: number[][], i: number, j: number) {
    return map[i]?.[j] ?? -2;
}
function around(i: number, j: number): [number, number][] {
    return [[i - 1, j], [i + 1, j], [i, j - 1], [i, j + 1]];
}

function existsTrail(
    map: number[][],
    si: number,
    sj: number,
    di: number,
    dj: number,
): boolean {
    if (si === di && sj === dj) {
        return true;
    }
    const sh = get(map, si, sj);
    return around(si, sj).some(([i, j]) =>
        get(map, i, j) === sh + 1 && existsTrail(map, i, j, di, dj)
    );
}

function countTrails(
    map: number[][],
    si: number,
    sj: number,
    di: number,
    dj: number,
): number {
    if (si === di && sj === dj) {
        return 1;
    }
    const sh = get(map, si, sj);
    return around(si, sj).reduce(
        (c, [i, j]) =>
            c +
            (get(map, i, j) === sh + 1 ? countTrails(map, i, j, di, dj) : 0),
        0,
    );
}

function calcScoreSum(input: string) {
    const map = input.split("\n").map((r) => r.split("").map(Number));
    const mapFlatten = map.flatMap((r, i) => r.map((h, j) => ({ h, i, j })));
    const bottoms = mapFlatten.filter(({ h }) => h === 0);
    const tops = mapFlatten.filter(({ h }) => h === 9);
    return bottoms.reduce(
        (sum, bottom) =>
            sum +
            tops.filter((top) =>
                existsTrail(map, bottom.i, bottom.j, top.i, top.j)
            ).length,
        0,
    );
}

function calcRatingSum(input: string) {
    const map = input.split("\n").map((r) => r.split("").map(Number));
    const mapFlatten = map.flatMap((r, i) => r.map((h, j) => ({ h, i, j })));
    const bottoms = mapFlatten.filter(({ h }) => h === 0);
    const tops = mapFlatten.filter(({ h }) => h === 9);
    return bottoms.reduce(
        (sum, bottom) =>
            sum +
            tops.reduce((sum, top) =>
                sum + countTrails(map, bottom.i, bottom.j, top.i, top.j), 0),
        0,
    );
}

if (import.meta.main) {
    const input = await Deno.readTextFile("input.txt");
    console.log(`scoreSum: ${calcScoreSum(input)}`);
    console.log(`ratingSum: ${calcRatingSum(input)}`);
}
