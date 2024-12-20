function around(
    [x, y]: [number, number],
    dist: number = 1,
): [number, number][] {
    if (dist === 0) {
        return [[x, y]];
    }
    const a = around([x, y], dist - 1);
    const b: [number, number][] = [[x - dist, y]];
    for (let i = 1; i < dist; i++) {
        b.push([x - dist + i, y - i]);
        b.push([x - dist + i, y + i]);
    }
    b.push([x, y - dist]);
    b.push([x, y + dist]);
    for (let i = 1; i < dist; i++) {
        b.push([x + i, y - dist + i]);
        b.push([x + i, y + dist - i]);
    }
    b.push([x + dist, y]);
    return a.concat(b);
}

function parseInput(input: string): string[][] {
    return input.split("\n").map((line) => line.split(""));
}

function getPosition<T>(
    map: T[][],
    mark: T,
): [number, number] | undefined {
    const t = map.flatMap((row, y) =>
        row.map((mark, x) => [mark, x, y] as [string, number, number])
    ).find((
        [m],
    ) => m === mark);
    return t ? [t[1], t[2]] : t;
}

function getDistMap(map: string[][]): number[][] {
    const dmap = map.map((row) => row.map(() => Infinity));
    const [ex, ey] = getPosition(map, "E")!;
    let [x, y] = getPosition(map, "S")!;
    let d = 0;
    dmap[y][x] = d++;
    while (!(x === ex && y === ey)) {
        for (const [ax, ay] of around([x, y])) {
            if (map[ay][ax] !== "#" && !isFinite(dmap[ay][ax])) {
                dmap[ay][ax] = d++;
                x = ax;
                y = ay;
                break;
            }
        }
    }
    return dmap;
}

function getSaveList(distMap: number[][]) {
    const list: number[] = [];
    const max = Math.max(...distMap.flat().filter(isFinite));
    let [x, y] = getPosition(distMap, 0)!;
    const [ex, ey] = getPosition(distMap, max)!;
    while (!(x === ex && y === ey)) {
        const d = distMap[y][x];
        for (const [ax, ay] of around([x, y], 20)) {
            const ad = distMap[ay]?.[ax];
            if (!isFinite(ad)) {
                continue;
            }
            const save = ad - d - 2;
            if (save <= 0) {
                continue;
            }
            list.push(save);
        }
        [x, y] = around([x, y]).find((
            [nx, ny],
        ) => (distMap[ny]?.[nx] === d + 1))!;
    }
    return list;
}

if (import.meta.main) {
    const text = await Deno.readTextFile("input.txt");
    const map = parseInput(text);
    const distMap = getDistMap(map);
    console.log(
        `Cheats(>=100ps) Count: ${
            getSaveList(distMap).filter((s) => s >= 100).length
        }`,
    );
}
