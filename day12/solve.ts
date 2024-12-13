function around(i: number, j: number) {
    return [[i - 1, j], [i, j + 1], [i + 1, j], [i, j - 1]];
}

function calcAreaByPosition(
    map: string[][],
    region: string,
    i: number,
    j: number,
    visitedMap = new Map<number, Map<number, boolean>>(),
): number {
    if (map[i]?.[j] !== region) {
        return 0;
    }
    if (visitedMap.get(i)?.get(j)) {
        return 0;
    }
    visitedMap.set(
        i,
        (visitedMap.get(i) ?? new Map<number, boolean>()).set(j, true),
    );
    return around(i, j).reduce(
        (area, [i, j]) =>
            area + calcAreaByPosition(map, region, i, j, visitedMap),
        1,
    );
}

function calcPerimeterByPosition(
    map: string[][],
    region: string,
    i: number,
    j: number,
    mask: number = 0b0000,
    visitedMap = new Map<number, Map<number, number>>(),
): number {
    if (map[i]?.[j] !== region) {
        return 0;
    }

    return 1;
}

function calcArea(map: string[][], region: string): number {
    const visitedMap = new Map<number, Map<number, boolean>>();
    let area = 0;
    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[i].length; j++) {
            area += calcAreaByPosition(map, region, i, j, visitedMap);
        }
    }
    return area;
}

function calcPerimeter(map: string[][], region: string): number {
    return 1;
}

function calcTotalPrice(input: string): number {
    const map = input.split("\n").map((line) => line.split(""));
    return new Set(map.flat()).values().reduce(
        (total, region) =>
            total + calcArea(map, region) * calcPerimeter(map, region),
        0,
    );
}

if (import.meta.main) {
    const input = await Deno.readTextFile("input.txt");
    console.log(
        `totalPrice: ${
            calcTotalPrice(`RRRRIICCFF
RRRRIICCCF
VVRRRCCFFF
VVRCCCJFFF
VVVVCJJCFE
VVIVCCJJEE
VVIIICJJEE
MIIIIIJJEE
MIIISIJEEE
MMMISSJEEE`)
        }`,
    );
}
