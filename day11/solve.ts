type TreeNode = {
    value: number;
    isOrigin: boolean;
    children: TreeNode[];
};

function searchOrigin(value: number, root: TreeNode): TreeNode | undefined {
    if (root.value === value && root.isOrigin) {
        return root;
    }
    if (!root.isOrigin) {
        return undefined;
    }
    for (const child of root.children) {
        const result = searchOrigin(value, child);
        if (result) {
            return result;
        }
    }
    return undefined;
}

function countLineNodes(
    root: TreeNode,
    depth: number,
    trueRoot = root,
): number {
    const cache = new Map<number, Map<number, number>>();
    if (!root.isOrigin) {
        return countLineNodes(
            searchOrigin(root.value, trueRoot)!,
            depth,
            trueRoot,
        );
    }
    if (depth < 1) {
        return 1;
    }
    return root.children.reduce(
        (acc, child) => acc + countLineNodes(child, depth - 1, trueRoot),
        0,
    );
}

function getLeafs(
    root: TreeNode,
): TreeNode[] {
    if (!root.isOrigin) {
        return [];
    }
    if (root.children.length === 0) {
        return [root];
    }
    return root.children.flatMap((c) => getLeafs(c));
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
    const root: TreeNode = {
        value: -1,
        isOrigin: true,
        children: [],
    };
    for (const stone of input.split(" ").map(Number)) {
        root.children.push({
            value: stone,
            isOrigin: !searchOrigin(stone, root),
            children: [],
        });
    }
    for (let i = 0; i < blinkCount; i++) {
        const leafs = getLeafs(root);
        for (const leaf of leafs) {
            leaf.children = blink(leaf.value).map((value) => ({
                value,
                isOrigin: !searchOrigin(value, root),
                children: [],
            }));
        }
    }
    return countLineNodes(root, blinkCount + 1);
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
