type Robot = {
    position: [number, number];
    velocity: [number, number];
};

function parseInput(input: string): Robot[] {
    return input.split("\n").map((line) => {
        const [x, y, vx, vy] = line.match(/-?\d+/g)!.map(Number);
        return { position: [x, y], velocity: [vx, vy] } as Robot;
    });
}

function toString(robots: Robot[], wide: number, tall: number): string {
    return Array.from(
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
    ).join("\n");
}

function runStep(robots: Robot[], wide: number, tall: number): Robot[] {
    return robots.map((robot) => {
        const r: Robot = {
            position: [
                robot.position[0] + robot.velocity[0],
                robot.position[1] + robot.velocity[1],
            ],
            velocity: robot.velocity,
        };
        if (r.position[0] < 0) {
            r.position[0] = wide + r.position[0];
        }
        if (r.position[1] < 0) {
            r.position[1] = tall + r.position[1];
        }
        r.position[0] %= wide;
        r.position[1] %= tall;
        return r;
    });
}

function runSteps(
    robots: Robot[],
    wide: number,
    tall: number,
    times: number,
): Robot[] {
    for (let i = 0; i < times; i++) {
        robots = runStep(robots, wide, tall);
    }
    return robots;
}

function animRobots(robots: Robot[], wide: number, tall: number): void {
    let sec = 1;
    setInterval(() => {
        robots = runStep(robots, wide, tall);
        console.clear();
        console.log(toString(robots, wide, tall));
        console.log(sec++);
    }, 100);
}

function getSaftyFactor(
    robots: Robot[],
    wide: number,
    tall: number,
    seconds: number,
): number {
    robots = runSteps(robots, wide, tall, seconds);
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

function operateRobots(robots: Robot[], wide: number, tall: number): void {
    const robots0 = robots;
    let counter = 0;
    while (true) {
        counter++;
        robots = runStep(robots, wide, tall);
        console.clear();
        console.log(toString(robots, wide, tall));
        console.log(counter);
        const string = prompt("Enter seconds(q: end):");
        if (string === "q") {
            break;
        }
        const num = Number(string);
        if (isNaN(num)) {
            continue;
        }
        if (num < 0) {
            robots = robots0;
            const c = Math.max(0, counter + num - 1);
            robots = runSteps(robots, wide, tall, c);
            counter = c;
            continue;
        }
        const c = num;
        robots = runSteps(robots, wide, tall, c);
        counter += c;
    }
}

if (import.meta.main) {
    const input = await Deno.readTextFile("input.txt");
    const robots = parseInput(input);
    const wide = 101;
    const tall = 103;
    console.log(`SaftyFactor: ${getSaftyFactor(robots, wide, tall, 100)}`);
    const sec = Number(Deno.args[0]);
    if (isNaN(sec)) {
        if (Deno.args[0] === "anim") {
            animRobots(robots, wide, tall);
        }
        if (Deno.args[0] === "op") {
            operateRobots(robots, wide, tall);
        }
    } else {
        console.log(toString(runSteps(robots, wide, tall, sec), wide, tall));
        console.log(sec);
    }
}
