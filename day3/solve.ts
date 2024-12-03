const input = await Deno.readTextFile("input.txt");
const reg = /mul\(\d{1,3},\d{1,3}\)|do\(\)|don't\(\)/dg;
let a1 = 0;
let a2 = 0;
let enable = true;
for (let res = reg.exec(input); res; res = reg.exec(input)) {
    const mulstr = res[0];
    if (mulstr === "do()") {
        enable = true;
        continue;
    }
    if (mulstr === "don't()") {
        enable = false;
        continue;
    }
    if (enable) {
        const dreg = /\d{1,3}/g;
        const a = Number(dreg.exec(mulstr)![0]);
        const b = Number(dreg.exec(mulstr)![0]);
        a2 += a * b;
    }
    const dreg = /\d{1,3}/g;
    const a = Number(dreg.exec(mulstr)![0]);
    const b = Number(dreg.exec(mulstr)![0]);
    a1 += a * b;
}
console.log(`answer1: ${a1}`);
console.log(`answer2: ${a2}`);
