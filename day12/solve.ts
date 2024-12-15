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
    const elements = region.elements.map((el) => ({ ...el }));
    const checked = [] as RegionElement[];
    let side = 0;
    for (const el of elements) {
        side += countBits(el.fence);
        const cels = checked.filter(({ i, j }) =>
            around(el.i, el.j).find(([ai, aj]) => ai == i && aj == j)
        );
        for (const cel of cels) {
            if (el.i === cel.i) {
                if (el.fence & cel.fence & 0b0001) { // lbrt
                    side--;
                }
                if (el.fence & cel.fence & 0b0100) {
                    side--;
                }
            }
            if (el.j === cel.j) {
                if (el.fence & cel.fence & 0b0010) {
                    side--;
                }
                if (el.fence & cel.fence & 0b1000) {
                    side--;
                }
            }
        }
        checked.push(el);
    }
    return side;
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
        `TotalPrice: ${getTotalPrice(input)}`,
    );

    console.log(
        `DiscountedTotalPrice: ${getDiscountedTotalPrice(input)}`,
    );
}
