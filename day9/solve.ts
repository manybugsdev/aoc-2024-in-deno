const input = await Deno.readTextFile("input.txt");
function calcChecksum(input: string) {
    const digits = input.split("").map(Number);
    const ids = Array(Math.ceil(digits.length / 2)).fill(0).flatMap((
        _,
        id,
    ) => Array(digits[2 * id]).fill(id));
    let position = 0;
    let sum = 0;
    for (const [digit, empty] of digits.map((v, i) => [v, i % 2])) {
        for (const id of ids.splice(empty ? -digit : 0, digit).reverse()) {
            sum += position++ * id;
        }
    }
    return sum;
}
console.log(calcChecksum(input));
