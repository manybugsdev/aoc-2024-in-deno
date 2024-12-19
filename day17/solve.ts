const OPCODE_NAMES = [
    "adv",
    "bxl",
    "bst",
    "jnz",
    "bxc",
    "out",
    "bdv",
    "cdv",
] as const;

function parseInput(
    input: string,
): { registers: number[]; instructions: number[] } {
    const [registersString, instructionsString] = input.split("\n\n");
    const [A, B, C] = registersString.match(/(\d+)/g)!.map(Number);
    const instructions = instructionsString.slice(9).split(",").map(Number);
    return {
        registers: [0, 1, 2, 3, A, B, C],
        instructions,
    };
}

function run(instructions: number[], registers: number[]): string {
    instructions = [...instructions];
    registers = [...registers];
    const out: string[] = [];
    let o = "";
    let p = 0;
    for (let pointer = 0; pointer < instructions.length; pointer = p) {
        const opcode = instructions[pointer];
        const operand = instructions[pointer + 1];
        [o, p] = step(opcode, operand, pointer, registers);
        if (o) {
            out.push(o);
        }
    }
    return out.join(",");
}

function step(
    opcode: number,
    operand: number,
    pointer: number,
    registers: number[],
): [string, number] {
    switch (OPCODE_NAMES[opcode]) {
        case "adv":
            registers[4] = Math.trunc(registers[4] / 2 ** registers[operand]);
            return ["", pointer + 2];
        case "bxl":
            registers[5] = (registers[5] ^ operand) & 0b111;
            return ["", pointer + 2];
        case "bst":
            registers[5] = registers[operand] % 8;
            return ["", pointer + 2];
        case "jnz":
            return registers[4] === 0 ? ["", pointer + 2] : ["", operand];
        case "bxc":
            registers[5] = (registers[5] ^ registers[6]) & 0b111;
            return ["", pointer + 2];
        case "out":
            return [String(registers[operand] % 8), pointer + 2];
        case "bdv":
            registers[5] = Math.trunc(registers[4] / 2 ** registers[operand]);
            return ["", pointer + 2];
        case "cdv":
            registers[6] = Math.trunc(registers[4] / 2 ** registers[operand]);
            return ["", pointer + 2];
    }
}

function testProgram(
    instructions: number[],
    registers: number[],
    output: string,
): boolean {
    return run(instructions, registers) === output;
}

function getValidAList(
    instructions: number[],
    output: number[],
): number[] {
    if (output.length === 0) {
        return [0];
    }
    return getValidAList(instructions, output.slice(1))
        .flatMap((
            a,
        ) => Array.from({ length: 8 }, (_, i) => 8 * a + i).filter((a) => {
            return testProgram(
                instructions,
                [0, 1, 2, 3, a, 0, 0, 0],
                output.join(","),
            );
        }));
}

if (import.meta.main) {
    const inputText = await Deno.readTextFile("input.txt");
    const { registers, instructions } = parseInput(inputText);
    const output = run(instructions, registers);
    console.log(`Output: ${output}`);
    console.log(
        `Valid A List: ${getValidAList(instructions, instructions)}`,
    );
}
