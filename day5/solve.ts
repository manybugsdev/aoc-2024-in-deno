const input = await Deno.readTextFile("input.txt");
type Order = {
    value: number;
    smaller: Set<number>;
    bigger: Set<number>;
};
function emptyOrder(value: number): Order {
    return { value, smaller: new Set(), bigger: new Set() };
}
const rules = new Map<number, Order>();
for (const ruleLine of input.split("\n\n")[0].trim().split("\n")) {
    const [s, b] = ruleLine.split("|").map((n) => Number(n));
    const so = rules.get(s) ?? emptyOrder(s);
    const bo = rules.get(b) ?? emptyOrder(b);
    so.bigger.add(b);
    bo.smaller.add(s);
    rules.set(s, so);
    rules.set(b, bo);
}
const updates = input.split("\n\n")[1].trim().split("\n").map((row) =>
    row.split(",").map((v) => Number(v))
);
let a1 = 0;
let a2 = 0;
for (const update of updates) {
    const pairs = update.slice(1).map((v, i) => [update[i], v]);
    if (pairs.some(([s, b]) => !rules.get(s)!.bigger.has(b))) {
        const sorted = update.toSorted((a, b) =>
            rules.get(a)!.bigger.has(b) ? -1 : 1
        );
        a2 += sorted[(sorted.length - 1) / 2];
        continue;
    }
    const v = update[(update.length - 1) / 2];
    a1 += v;
}
console.log(`a1: ${a1}`);
console.log(`a2: ${a2}`);
