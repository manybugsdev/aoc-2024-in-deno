import { BinaryHeap } from "jsr:@std/data-structures";

type Direction = "^" | "v" | "<" | ">";

type Position = {
    x: number;
    y: number;
};

type Node = Position & {
    score: number;
    direction: Direction;
};

function parseInput(input: string): string[][] {
    return input.split("\n").map((line) => line.split(""));
}

function getTurnScore(current: Direction, next: Direction): number {
    switch (current) {
        case "^":
            return next === "^" ? 0 : next === "v" ? 2000 : 1000;
        case "v":
            return next === "v" ? 0 : next === "^" ? 2000 : 1000;
        case "<":
            return next === "<" ? 0 : next === ">" ? 2000 : 1000;
        case ">":
            return next === ">" ? 0 : next === "<" ? 2000 : 1000;
    }
    throw new Error("Invalid direction");
}

function around(node: Node): Node[] {
    // trbl
    return [
        {
            x: node.x,
            y: node.y - 1,
            direction: "^",
            score: getTurnScore(node.direction, "^") + 1 + node.score,
        },
        {
            x: node.x + 1,
            y: node.y,
            direction: ">",
            score: getTurnScore(node.direction, ">") + 1 + node.score,
        },
        {
            x: node.x,
            y: node.y + 1,
            direction: "v",
            score: getTurnScore(node.direction, "v") + 1 + node.score,
        },
        {
            x: node.x - 1,
            y: node.y,
            direction: "<",
            score: getTurnScore(node.direction, "<") + 1 + node.score,
        },
    ];
}

function getStartPosition(map: string[][]): Position | undefined {
    return map.flatMap((row, y) => row.map((mark, x) => ({ x, y, mark })))
        .find(({ mark }) => mark === "S");
}

function getEndPosition(map: string[][]): Position | undefined {
    return map.flatMap((row, y) => row.map((mark, x) => ({ x, y, mark })))
        .find(({ mark }) => mark === "E");
}

function getMinScore(map: string[][]): number {
    const scoreMap: Record<Direction, number>[][] = map.map((row) =>
        row.map(() => ({
            "^": Infinity,
            "v": Infinity,
            "<": Infinity,
            ">": Infinity,
        }))
    );
    const sp = getStartPosition(map);
    if (!sp) {
        throw new Error("No start position found");
    }
    const ep = getEndPosition(map);
    if (!ep) {
        throw new Error("No end position found");
    }
    const heap = new BinaryHeap<Node>(
        (a, b) => a.score - b.score,
    );
    heap.push({ ...sp, direction: ">", score: 0 });
    while (!heap.isEmpty()) {
        const n = heap.pop()!;
        if (scoreMap[n.y][n.x][n.direction] <= n.score) {
            continue;
        }
        scoreMap[n.y][n.x][n.direction] = n.score;
        for (const an of around(n)) {
            if (map[an.y]?.[an.x] === "#") {
                continue;
            }
            heap.push(an);
        }
    }
    return Math.min(
        scoreMap[ep.y][ep.x]["^"],
        scoreMap[ep.y][ep.x]["v"],
        scoreMap[ep.y][ep.x]["<"],
        scoreMap[ep.y][ep.x][">"],
    );
}

if (import.meta.main) {
    const inputText = await Deno.readTextFile("input.txt");
    const map = parseInput(inputText);
    console.log(`MinScore: ${getMinScore(map)}`);
}
