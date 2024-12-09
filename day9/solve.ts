const input = await Deno.readTextFile("input.txt");
const raw = input.split("").map((_, i) =>
    Array(Number(i)).fill(i % 2 ? "." : `${i}`)
).flat();
console.log(raw);
