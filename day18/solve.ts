import { BinaryHeap } from "jsr:@std/data-structures";

function parseInput(input: string): [number, number][] {
    return input.split("\n").map((line) =>
        line.split(",").map(Number) as [number, number]
    );
}

function getMap(blocks: [number, number][], size: number): string[][] {
    const map = Array.from({ length: size }, () => Array(size).fill("."));
    for (const [x, y] of blocks) {
        map[y][x] = "#";
    }
    return map;
}

function around(x: number, y: number): [number, number][] {
    return [
        [x, y - 1],
        [x + 1, y],
        [x, y + 1],
        [x - 1, y],
    ];
}

function getShortestPath(
    map: string[][],
): [number, number][] {
    const arrivalMap = map.map((line) => line.map(() => [Infinity, -1, -1]));
    const heap = new BinaryHeap<
        [number, number, number, number, number]
    >(( // dist,x,y,px,py
        [a],
        [b],
    ) => a - b);
    heap.push([0, 0, 0, 0, 0]);
    while (!heap.isEmpty()) {
        const [dist, x, y, px, py] = heap.pop()!;
        if (dist >= arrivalMap[y][x][0]) {
            continue;
        }
        arrivalMap[y][x] = [dist, px, py];
        for (const [ax, ay] of around(x, y)) {
            const ch = map[ay]?.[ax] ?? "#";
            if (ch === "#") {
                continue;
            }
            heap.push([dist + 1, ax, ay, x, y]);
        }
    }
    let [y, x] = [arrivalMap.length - 1, arrivalMap[0].length - 1];
    if (
        arrivalMap[y][x][0] === Infinity
    ) {
        return [];
    }
    const path: [number, number][] = [[x, y]];
    while (!(x === 0 && y === 0)) {
        [x, y] = arrivalMap[y][x].slice(1);
        path.push([x, y]);
    }
    return path.reverse();
}

if (import.meta.main) {
    const text = await Deno.readTextFile("input.txt");
    const blocks = parseInput(text);
    const map = getMap(blocks.slice(0, 1024), 71);
    const path = getShortestPath(map);
    console.log(`Steps: ${path.length - 1}`);
    for (let i = 1025; i < blocks.length; i++) {
        if (getShortestPath(getMap(blocks.slice(0, i), 71)).length === 0) {
            console.log(`Blocks: ${blocks[i - 1]}`);
            break;
        }
    }
}
