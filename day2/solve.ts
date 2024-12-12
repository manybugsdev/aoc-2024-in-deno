const input = await Deno.readTextFile("input.txt");
const reports = input.trim().split("\n").map((line) =>
    line.trim().split(/\s+/).map((n) => parseInt(n))
);
function valid(levels: number[]) {
    const ps = levels.slice(0, -1);
    const ns = levels.slice(1);
    let diffs = ns.map((n, i) => n - ps[i]);
    if (diffs[0] < 0) {
        diffs = diffs.map((n) => -n);
    }
    return diffs.every((n) => 1 <= n && n <= 3);
}
function countSafe(reports: number[][]) {
    return reports.map(valid).filter((b) => b).length;
}
console.log(`safes: ${countSafe(reports)}`);

function countWeekSafe(reports: number[][]) {
    return reports.map((levels) =>
        levels.map((_, i) =>
            valid(levels.slice(0, i).concat(levels.slice(i + 1)))
        ).some((b) => b)
    ).filter((b) => b).length;
}
console.log(
    `weekSafes: ${countWeekSafe(reports)}`,
);
