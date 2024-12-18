import { BinaryHeap } from "jsr:@std/data-structures";

const DIRECTION = ["^", "v", "<", ">"] as const;

type Direction = typeof DIRECTION[number];

type Position = {
    x: number;
    y: number;
};

type Node = Position & {
    score: number;
    direction: Direction;
};

type ScoreMap = Record<Direction, number>[][];

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

function getPosition(map: string[][], mark: string): Position {
    return map.flatMap((row, y) => row.map((mark, x) => ({ x, y, mark })))
        .find((n) => n.mark === mark)!;
}

function from(node: Node, scoreMap: ScoreMap): Node[] {
    return around(node).flatMap((an) =>
        DIRECTION.map((direction) => ({
            ...an,
            direction,
            score: scoreMap[an.y][an.x][direction],
        })).filter((n) => isFinite(n.score)).filter((n) =>
            n.score + getTurnScore(n.direction, node.direction) + 1 ===
                node.score
        )
    );
}

function getScoreMap(map: string[][]): ScoreMap {
    const scoreMap: ScoreMap = map.map((row) =>
        row.map(() => ({
            "^": Infinity,
            "v": Infinity,
            "<": Infinity,
            ">": Infinity,
        }))
    );
    const sp = getPosition(map, "S");
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
    return scoreMap;
}

function getMinScore(map: string[][]): number {
    const scoreMap = getScoreMap(map);
    const ep = getPosition(map, "E");
    return Math.min(
        scoreMap[ep.y][ep.x]["^"],
        scoreMap[ep.y][ep.x]["v"],
        scoreMap[ep.y][ep.x]["<"],
        scoreMap[ep.y][ep.x][">"],
    );
}

function printMap(map: string[][]): void {
    console.log(map.map((row) => row.join("")).join("\n"));
}

function getPathMap(map: string[][], scoreMap: ScoreMap): string[][] {
    const pathMap = scoreMap.map((row) => row.map(() => "."));
    const ep = getPosition(map, "E");
    const en: Node = DIRECTION.map((direction) => ({
        ...ep,
        direction,
        score: scoreMap[ep.y][ep.x][direction],
    })).reduce((a, v) => a.score < v.score ? a : v);
    const nodes = [en];
    while (nodes.length) {
        const node = nodes.pop()!;
        pathMap[node.y][node.x] = "O";
        nodes.push(...from(node, scoreMap));
    }
    return pathMap;
}

function getTiles(map: string[][]): number {
    const scoreMap = getScoreMap(map);
    const pathMap = getPathMap(map, scoreMap);
    return pathMap.flat().filter((s) => s === "O").length;
}

if (import.meta.main) {
    const inputText = await Deno.readTextFile("input.txt");
    const map = parseInput(inputText);
    console.log(`MinScore: ${getMinScore(map)}`);
    console.log(`Tiles: ${getTiles(map)}`);
}
