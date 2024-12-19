function parseInput(input: string): [string[], string[]] {
    const [as, ds] = input.split("\n\n");
    return [as.split(", "), ds.split("\n")];
}

function possible(avails: string[], desire: string): boolean {
    if (!desire) {
        return true;
    }
    return avails.some((avail) =>
        desire.startsWith(avail) && possible(avails, desire.slice(avail.length))
    );
}

function countPossibles(avails: string[], desires: string[]): number {
    return desires.reduce(
        (count, desire) => count + Number(possible(avails, desire)),
        0,
    );
}

if (import.meta.main) {
    const text = await Deno.readTextFile("input.txt");
    const [avails, desires] = parseInput(text);
    console.log(`Possibles: ${countPossibles(avails, desires)}`);
}
