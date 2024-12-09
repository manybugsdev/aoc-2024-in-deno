function calcChecksum(input: string) {
    const digits = input.split("").map(Number);
    const ids = Array(Math.ceil(digits.length / 2))
        .fill(0)
        .flatMap((_, id) => Array(digits[2 * id]).fill(id));
    let position = 0;
    let sum = 0;
    for (const [digit, empty] of digits.map((v, i) => [v, i % 2])) {
        for (const id of ids.splice(empty ? -digit : 0, digit).reverse()) {
            sum += position++ * id;
        }
    }
    return sum;
}
function calcChecksumNoFragment(input: string) {
    const digits = input.split("").map(Number);
    let addr = 0;
    const stores = Array(digits.length)
        .fill(0)
        .map((_, i) => {
            const s = { id: i % 2 ? -1 : i / 2, stock: digits[i], addr };
            addr += digits[i];
            return s;
        });
    const files = stores.filter((s) => s.id >= 0);
    const frees = stores.filter((s) => s.id < 0);
    for (const file of files.toReversed()) {
        const free = frees.find((free) => free.stock >= file.stock);
        if (!free || free.addr > file.addr) {
            continue;
        }
        file.addr = free.addr;
        free.stock -= file.stock;
        free.addr += file.stock;
    }
    return files.reduce(
        (sum, { id, stock, addr }) =>
            sum + (id * stock * (2 * addr + stock - 1)) / 2,
        0,
    );
}
if (import.meta.main) {
    const input = await Deno.readTextFile("input.txt");
    console.log(`checksum: ${calcChecksum(input)}`);
    console.log(`checksum(no fragment): ${calcChecksumNoFragment(input)}`);
}
