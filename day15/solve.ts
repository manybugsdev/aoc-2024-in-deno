type Direction = "^" | "v" | "<" | ">";

function parseInput(
    input: string,
): { map: string[][]; directions: Direction[] } {
    const [mapString, movesString] = input.split("\n\n");
    const map = mapString.split("\n").map((line) => line.split(""));
    const directions = movesString.split("").filter(
        (ch) => ch !== "\n",
    ) as Direction[];
    return { map, directions };
}

function nextPosition(
    x: number,
    y: number,
    direction: Direction,
): { x: number; y: number } {
    switch (direction) {
        case "^":
            return { x, y: y - 1 };
        case "v":
            return { x, y: y + 1 };
        case "<":
            return { x: x - 1, y };
        case ">":
            return { x: x + 1, y };
    }
}

function getRobotPosition(map: string[][]): { x: number; y: number } {
    return map.flatMap((row, y) => row.map((mark, x) => ({ x, y, mark }))).find(
        ({ mark }) => mark === "@",
    )!;
}

function runStep(
    map: string[][],
    direction: Direction,
    x: number,
    y: number,
): string[][] {
    const mark = map[y][x];
    if (mark === "#" || mark === ".") {
        return map;
    }
    // O or @
    const np = nextPosition(x, y, direction);
    map = runStep(map, direction, np.x, np.y);
    const nmark = map[np.y][np.x];
    if (nmark !== ".") {
        return map;
    }
    map[y][x] = ".";
    map[np.y][np.x] = mark;
    return map;
}

function run(map: string[][], directions: Direction[]): string[][] {
    for (const direction of directions) {
        const { x, y } = getRobotPosition(map);
        map = runStep(map, direction, x, y);
    }
    return map;
}

function getSumOfGPS(map: string[][]): number {
    return map.reduce(
        (sum, r, y) =>
            r.reduce(
                (sum, mark, x) => sum + (mark === "O" ? 100 * y + x : 0),
                sum,
            ),
        0,
    );
}

function printMap(map: string[][]): void {
    console.log(map.map((row) => row.join("")).join("\n"));
}

if (import.meta.main) {
    let { map, directions } = parseInput(await Deno.readTextFile("input.txt"));
    map = run(map, directions);
    console.log(`SumOfGPS: ${getSumOfGPS(map)}`);
}
