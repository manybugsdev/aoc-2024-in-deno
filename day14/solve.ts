type Robot = {
    position: [number, number];
    velocity: [number, number];
};

function animRobots(input: string): void {
    const robots = input.split("\n").map((line) => {
        const [x, y, vx, vy] = line.match(/-?\d+/g)!.map(Number);
        return { position: [x, y], velocity: [vx, vy] } as Robot;
    });
    const wide = 101;
    const tall = 103;
    setInterval(() => {
        for (const robot of robots) {
            robot.position[0] += robot.velocity[0];
            robot.position[1] += robot.velocity[1];
            if (robot.position[0] < 0) {
                robot.position[0] = wide + robot.position[0];
            }
            if (robot.position[1] < 0) {
                robot.position[1] = tall + robot.position[1];
            }
            robot.position[0] %= wide;
            robot.position[1] %= tall;
        }
        console.clear();
        console.log(
            Array.from(
                { length: tall },
                (_, y) =>
                    Array.from(
                        { length: wide },
                        (_, x) =>
                            robots.some(
                                    (robot) =>
                                        robot.position[0] === x &&
                                        robot.position[1] === y,
                                )
                                ? "#"
                                : " ",
                    ).join(""),
            ).join("\n"),
        );
    }, 100);
}

function getSaftyFactor(input: string): number {
    const wide = 101;
    const tall = 103;
    const seconds = 100;
    const robots = input.split("\n").map((line) => {
        const [x, y, vx, vy] = line.match(/-?\d+/g)!.map(Number);
        return { position: [x, y], velocity: [vx, vy] } as Robot;
    });
    for (let i = 0; i < seconds; i++) {
        for (const robot of robots) {
            robot.position[0] += robot.velocity[0];
            robot.position[1] += robot.velocity[1];
            if (robot.position[0] < 0) {
                robot.position[0] = wide + robot.position[0];
            }
            if (robot.position[1] < 0) {
                robot.position[1] = tall + robot.position[1];
            }
            robot.position[0] %= wide;
            robot.position[1] %= tall;
        }
    }
    const a = robots.filter((robot) =>
        robot.position[0] < (wide - 1) / 2 &&
        robot.position[1] < (tall - 1) / 2
    ).length;
    const b = robots.filter((robot) =>
        robot.position[0] > (wide - 1) / 2 &&
        robot.position[1] < (tall - 1) / 2
    ).length;
    const c = robots.filter((robot) =>
        robot.position[0] < (wide - 1) / 2 &&
        robot.position[1] > (tall - 1) / 2
    ).length;
    const d = robots.filter((robot) =>
        robot.position[0] > (wide - 1) / 2 &&
        robot.position[1] > (tall - 1) / 2
    ).length;
    return a * b * c * d;
}

function showRobots(input: string, sec: number): void {
    const wide = 101;
    const tall = 103;
    const seconds = sec;
    const robots = input.split("\n").map((line) => {
        const [x, y, vx, vy] = line.match(/-?\d+/g)!.map(Number);
        return { position: [x, y], velocity: [vx, vy] } as Robot;
    });
    for (let i = 0; i < seconds; i++) {
        for (const robot of robots) {
            robot.position[0] += robot.velocity[0];
            robot.position[1] += robot.velocity[1];
            if (robot.position[0] < 0) {
                robot.position[0] = wide + robot.position[0];
            }
            if (robot.position[1] < 0) {
                robot.position[1] = tall + robot.position[1];
            }
            robot.position[0] %= wide;
            robot.position[1] %= tall;
        }
    }
    console.log(
        Array.from(
            { length: tall },
            (_, y) =>
                Array.from(
                    { length: wide },
                    (_, x) =>
                        robots.some(
                                (robot) =>
                                    robot.position[0] === x &&
                                    robot.position[1] === y,
                            )
                            ? "#"
                            : " ",
                ).join(""),
        ).join("\n"),
    );
}

if (import.meta.main) {
    const input = await Deno.readTextFile("input.txt");
    console.log(`SaftyFactor: ${getSaftyFactor(input)}`);
    const sec = Number(Deno.args[0]);
    if (isNaN(sec)) {
        animRobots(input);
    } else {
        showRobots(input, sec);
    }
}
