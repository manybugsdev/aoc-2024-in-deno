const input = await Deno.readTextFile("input.txt");
const list = /mul\(\d{1,3},\d{1,3}\)/g.exec(input);
console.log(list);
