function getButtonCombinationWithFewestToken(
    fewestTokens: number[][],
    totalButtonCount: number,
) :[number, number] {
    return fewestTokens.reduce(())
}

function getFewestToken(
    ax: number,
    ay: number,
    bx: number,
    by: number,
    px: number,
    py: number,
): number {
    const n = 100;
    // table[acount][bcount] = fewest tokens
    const table = Array.from(
        { length: n },
        () => Array.from({ length: n }, () => 0),
    );
    // push button
    for (let i = 0; i < n; i++) {
    }
    return 1;
}

function getFewestTokens(input: string): number {
    return input.split("\n\n").map((text) => text.split("\n")).map((
        [at, bt, pt],
    ) => ({
        ax: Number(at.split(",")[0].slice(-3)),
        ay: Number(at.split(",")[1].slice(-3)),
        bx: Number(bt.split(",")[0].slice(-3)),
        by: Number(bt.split(",")[1].slice(-3)),
        px: Number(pt.split(",")[0].match(/[0-9]+/)?.[0]),
        py: Number(pt.split(",")[1].match(/[0-9]+/)?.[0]),
    })).reduce(
        (sum, { ax, ay, bx, by, px, py }) =>
            sum + getFewestToken(ax, ay, bx, by, px, py),
        0,
    );
}

if (import.meta.main) {
    const input = await Deno.readTextFile("input.txt");
    console.log(`FewestTokens: ${getFewestTokens(input)}`);
}
