type Direction = "^" | "v" | "<" | ">";

type Cell = {
    x: number;
    y: number;
    mark: string;
    moved: boolean;
};

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

function step(cell: Cell, direction: Direction, cells: Cell[]): Cell {
    const { mark, x, y } = cell;
    const d = direction;
    if (mark === "#") {
        return cell;
    }
    if (mark === ".") {
        return {
            mark,
            moved: true,
            x: x + (d === "<" ? 1 : d === ">" ? -1 : 0),
            y: y + (d === "^" ? 1 : d === "v" ? -1 : 0),
        };
    }
    if (mark === "O" || mark === "@") {
        const np = nextPosition(x, y, direction);
        const nextCell = cells.find((c) => c.x === np.x && cell.y === np.y);
        if (!nextCell || nextCell.moved) {
            return {
                mark,
                moved: true,
                x: np.x,
                y: np.y,
            };
        }
        return {
            mark,
            moved: false,
            x,
            y,
        };
    }
    return cell;
}

function run(map: string[][], directions: Direction[]): string[][] {
    const cells = map.flatMap((row, y) =>
        row.map((mark, x) => ({ x, y, mark, moved: false }))
    );
    let robot: Cell = cells.find((cell) => cell.mark === "@")!;
    for (const d of directions) {
        robot = step(robot, d, cells);
    }
    return cells.reduce((map, cell) => {
        map[cell.y][cell.x] = cell.mark;
        return map;
    }, map.map((row) => [...row]));
}

function getSumOfGPS(map: string[][]): number {
    return map.reduce(
        (sum, r, y) =>
            r.reduce(
                (sum, mark, x) => sum + mark === "O" ? 100 * y + x : 0,
                sum,
            ),
        0,
    );
}

if (import.meta.main) {
    let { map, directions } = parseInput(await Deno.readTextFile("input.txt"));
    map = run(map, directions);
    console.log(map.map((row) => row.join("")).join("\n"));
    console.log(`SumOfGPS: ${getSumOfGPS(map)}`);
}
