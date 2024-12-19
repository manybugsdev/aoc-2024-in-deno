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

function getPatterns(
    avails: string[],
    desire: string,
    cache: Map<string, number> = new Map(),
): number {
    if (!desire) {
        return 1;
    }
    const cached = cache.get(desire);
    if (cached) {
        return cached;
    }
    const value = avails.filter((avail) => desire.startsWith(avail)).reduce(
        (sum, avail) => sum + getPatterns(avails, desire.slice(avail.length)),
        0,
    );
    cache.set(desire, value);
    return avails.filter((avail) => desire.startsWith(avail)).reduce(
        (sum, avail) =>
            sum + getPatterns(avails, desire.slice(avail.length), cache),
        0,
    );
}

if (import.meta.main) {
    const text = await Deno.readTextFile("input.txt");
    const [avails, desires] = parseInput(text);
    console.log(`Possibles: ${countPossibles(avails, desires)}`);
    console.log(`Patterns: ${getPatterns(avails, desires[0])}`);
}
