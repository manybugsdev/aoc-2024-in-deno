const input = await Deno.readTextFile("input.txt");
const darray = input.trim().split("\n").map((row) => row.split(""));
const row = darray.length;
const col = darray[0].length;
let dirs: [number, number][][] = [
    [[0, 0], [-1, -1], [-2, -2], [-3, -3]],
    [[0, 0], [1, 1], [2, 2], [3, 3]],
    [[0, 0], [1, -1], [2, -2], [3, -3]],
    [[0, 0], [-1, 1], [-2, 2], [-3, 3]],
    [[0, 0], [0, -1], [0, -2], [0, -3]],
    [[0, 0], [0, 1], [0, 2], [0, 3]],
    [[0, 0], [-1, 0], [-2, 0], [-3, 0]],
    [[0, 0], [1, 0], [2, 0], [3, 0]],
];
let count = 0;
for (let i = 0; i < row; i++) {
    for (let j = 0; j < col; j++) {
        for (const dir of dirs) {
            if (
                dir.map(([x, y]) => darray[i + x]?.[j + y] ?? "").join("") ===
                    "XMAS"
            ) {
                count++;
            }
        }
    }
}
console.log(`XMAS: ${count}`);
dirs = [
    [[-1, -1], [0, 0], [1, 1], [-1, 1], [0, 0], [1, -1]],
    [[-1, -1], [0, 0], [1, 1], [1, -1], [0, 0], [-1, 1]],
    [[1, 1], [0, 0], [-1, -1], [1, -1], [0, 0], [-1, 1]],
    [[1, 1], [0, 0], [-1, -1], [-1, 1], [0, 0], [1, -1]],
];
count = 0;
for (let i = 0; i < row; i++) {
    for (let j = 0; j < col; j++) {
        for (const dir of dirs) {
            if (
                dir.map(([x, y]) => darray[i + x]?.[j + y] ?? "").join("") ===
                    "MASMAS"
            ) {
                count++;
            }
        }
    }
}
console.log(`X-MAS: ${count}`);
