const input = await Deno.readTextFile("input.txt");
const equations = input.split("\n").map((row) => {
    const goal = Number(row.split(":")[0]);
    const nums = row.split(":")[1].trim().split(" ").map((v) => Number(v));
    return { goal, nums };
});
function valid(goal: number, nums: number[]) {
    if (nums.length === 1) {
        return goal === nums[0];
    }
    const head = nums[0];
    const tail = nums.slice(1);
    const pv = head + tail[0];
    const mv = head * tail[0];
    const cv = Number(`${head}${tail[0]}`);
    for (const v of [pv, mv, cv]) {
        if (v > goal) {
            continue;
        }
        if (valid(goal, tail.with(0, v))) {
            return true;
        }
    }
    return false;
}
const a2 = equations.map(({ goal, nums }) => valid(goal, nums) ? goal : 0)
    .reduce((
        a,
        v,
    ) => a + v);
console.log(
    `a2: ${a2}`,
);
