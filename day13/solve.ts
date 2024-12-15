function getFewestToken(
    ax: number,
    ay: number,
    bx: number,
    by: number,
    px: number,
    py: number,
): number {
    // inverse matrix solution
    //
    // |ax bx||a| = |px|
    // |ay by||b|   |py|
    //
    // |a| = 1/(axby - aybx) |by -bx||px|
    // |b|                   |-ay ax||py|
    const det = ax * by - ay * bx;
    if (det === 0) {
        return 0;
    }
    let a = by * px - bx * py;
    let b = -ay * px + ax * py;
    if (a % det !== 0 || b % det !== 0) {
        return 0;
    }
    a /= det;
    b /= det;
    if (a < 0 || b < 0) {
        return 0;
    }
    return 3 * a + b;
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
