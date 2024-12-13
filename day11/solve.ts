type TreeNode = {
    value: number;
    children: TreeNode[];
};

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

function search(
    value: number,
    node: TreeNode,
    visited: Set<number> = new Set(),
): TreeNode | undefined {
    if (node.value === value) {
        return node;
    }
    if (visited.has(node.value)) {
        return undefined;
    }
    visited.add(node.value);
    for (const child of node.children) {
        const result = search(value, child, visited);
        if (result) {
            return result;
        }
    }
    return undefined;
}

function calcStoneNum(input: string, blinkCount: number): number {
    // initialize root
    const root: TreeNode = {
        value: -1,
        children: [],
    };
    let leafMap = new Map<number, number>();
    for (const stone of input.split(" ").map(Number)) {
        leafMap.set(stone, (leafMap.get(stone) ?? 0) + 1);
        root.children.push(
            search(stone, root) ?? {
                value: stone,
                children: [],
            },
        );
    }
    // blinking
    for (let i = 0; i < blinkCount; i++) {
        leafMap = leafMap.entries().reduce((m, [stone, count]) => {
            const node = search(stone, root);
            if (!node) {
                throw new Error(`Why???: ${stone}`);
            }
            if (node.children.length === 0) {
                node.children = blink(node.value).map((value) =>
                    search(value, root) ?? { value, children: [] }
                );
            }
            for (const child of node.children) {
                m.set(child.value, (m.get(child.value) ?? 0) + count);
            }
            return m;
        }, new Map());
    }
    return leafMap.values().reduce((acc, count) => acc + count, 0);
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
