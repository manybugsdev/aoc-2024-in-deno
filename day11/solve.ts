type DeepArray = (number | DeepArray)[];

function size(da: DeepArray): number {
    return da.reduce(
        (acc: number, item) => acc + (Array.isArray(item) ? size(item) : 1),
        0,
    );
}

function blinkDeepArray(da: DeepArray): DeepArray {
    return da.map((item) =>
        Array.isArray(item) ? blinkDeepArray(item) : blink(item)
    );
}

function blink(stone: number): number[] {
    const text = String(stone);
    if (stone === 0) {
        return [1];
    } else if (text.length % 2 === 0) {
        const half = text.length / 2;
        return [Number(text.slice(0, half)), Number(text.slice(half))];
    }
    return [stone * 2024];
}

function calcStoneNum(input: string, blinkCount: number): number {
    let stones: DeepArray = input.split(" ").map(Number);
    for (let i = 0; i < blinkCount; i++) {
        stones = blinkDeepArray(stones);
    }
    return size(stones);
}

if (import.meta.main) {
    const input = await Deno.readTextFile("input.txt");
    console.log(
        `StoneNumAfterBlink25: ${calcStoneNum(input, 25)}`,
    );
    console.log(
        `StoneNumAfterBlink75: ${calcStoneNum(input, 75)}`,
    );
}
