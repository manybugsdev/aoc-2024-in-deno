type Memo = Map<number, Map<number, boolean>>;

function memorize(memo: Memo, i: number, j: number) {
    memo.set(i, (memo.get(i) ?? new Map()).set(j, true));
}

function exists(memo: Memo, i: number, j: number) {
    return !!memo.get(i)?.get(j);
}

function around(i: number, j: number) {
    return [[i - 1, j], [i, j + 1], [i + 1, j], [i, j - 1]];
}

function perimeter(map: string[][], i: number, j: number, memo: Memo): number {
    if (exists(memo, i, j)) {
        return 0;
    }
    const ch = map[i]?.[j];
    if (!ch) {
        return 0;
    }
    memorize(memo, i, j);
    const sames = around(i, j).filter(([i, j]) => map[i]?.[j] === ch);
    return sames.reduce(
        (sum, [i, j]) => sum + perimeter(map, i, j, memo),
        4 - sames.length,
    );
}

function area(
    map: string[][],
    i: number,
    j: number,
    memo: Memo,
): number {
    if (exists(memo, i, j)) {
        return 0;
    }
    const ch = map[i]?.[j];
    if (!ch) {
        return 0;
    }
    memorize(memo, i, j);
    return around(i, j).filter(([i, j]) => map[i]?.[j] === ch).reduce(
        (sum, [i, j]) => sum + area(map, i, j, memo),
        1,
    );
}

function priceTotal(input: string): number {
    const map = input.split("\n").map((r) => r.split(""));
    const am: Memo = new Map();
    const pm: Memo = new Map();
    return map.flatMap((line, i) => line.map((_, j) => ({ i, j }))).reduce(
        (sum, { i, j }) => (
            sum + area(map, i, j, am) * perimeter(map, i, j, pm)
        ),
        0,
    );
}

if (import.meta.main) {
    const input = await Deno.readTextFile("input.txt");
    console.log(
        `priceTotal: ${priceTotal(input)}`,
    );
}
