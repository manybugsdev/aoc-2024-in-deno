type Region = {
    id: number;
    elements: RegionElement[];
};

type RegionElement = {
    i: number;
    j: number;
    plant: string;
    fence: number;
};

function around(i: number, j: number) {
    return [[i - 1, j], [i, j + 1], [i + 1, j], [i, j - 1]];
}

function getFence(map: string[][], i: number, j: number) {
    const plant = map[i][j];
    return around(i, j).reduce(
        (fence, [i, j], k) =>
            fence + (map[i]?.[j] === plant ? 0 : Math.pow(2, k)),
        0,
    );
}

function getPositionsSameRegion(
    map: string[][],
    i: number,
    j: number,
    plant = map[i]?.[j],
    visited = map.map((r) => r.map(() => false)),
): [number, number][] {
    if (map[i]?.[j] !== plant || visited[i]?.[j]) {
        return [];
    }
    visited[i][j] = true;
    return [
        [i, j],
        ...around(i, j).map(([i, j]) =>
            getPositionsSameRegion(map, i, j, plant, visited)
        ).flat(),
    ];
}

function getRegions(map: string[][]): Region[] {
    let regionId = 1;
    const visited = map.map((r) => r.map(() => false));
    return map.map((r, i) =>
        r.flatMap((plant, j) => {
            if (visited[i][j]) {
                return [];
            }
            return [{
                id: regionId++,
                elements: getPositionsSameRegion(map, i, j).map(([i, j]) => {
                    visited[i][j] = true;
                    return ({
                        i,
                        j,
                        plant,
                        fence: getFence(map, i, j),
                    });
                }),
            }];
        })
    ).flat();
}

function getArea(region: Region) {
    return region.elements.length;
}
function getPerimeter(region: Region) {
    return region.elements.reduce((p, { fence }) => p + countBits(fence), 0);
}

function countBits(fence: number) {
    let c = 0;
    while (fence) {
        c += fence & 0b0001;
        fence >>= 1;
    }
    return c;
}

function getTotalPrice(input: string): number {
    const map = input.split("\n").map((r) => r.split(""));
    const regions = getRegions(map);
    return regions.reduce(
        (t, region) => t + getArea(region) * getPerimeter(region),
        0,
    );
}

function getSide(region: Region) {
    const elements = region.elements;
    const checked: RegionElement[] = [];
    for (const el of elements) {
        const ars = checked.filter(({ i, j }) =>
            around(el.i, el.j).find(([ai, aj]) => ai == i && aj == j)
        );
        // solving
    }
    return checked.reduce((s, { fence }) => s + countBits(fence), 0);
}

function getDiscountedTotalPrice(input: string): number {
    const map = input.split("\n").map((r) => r.split(""));
    const regions = getRegions(map);
    return regions.reduce(
        (t, region) => t + getArea(region) * getSide(region),
        0,
    );
}

if (import.meta.main) {
    const input = await Deno.readTextFile("input.txt");
    console.log(
        `TotalPrice: ${
            getTotalPrice(`RRRRIICCFF
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
    /*
    console.log(
        `priceTotalDiscounted: ${
            priceTotalDiscounted(`RRRRIICCFF
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
    */
}
