import { World, WorldEvent } from "@remvst/game-model";
import {
    Achievement,
    AchievementUnlocker,
    SequenceCounter,
    ValueCounter,
    ValueRecorder,
    WorldAchievementWatcher,
    WorldEventCounter,
    failIf,
    succeedIfAll,
    valueIsEqualOrGreaterThan,
} from "../src";

class Jump implements WorldEvent {
    apply(world: World): void {}
}

class Kill implements WorldEvent {
    apply(world: World): void {}
}

describe("full example", () => {
    let world: World;
    let unlocker: AchievementUnlocker;
    let recorder: ValueRecorder;
    let jumpCounter: ValueCounter;
    let killCounter: ValueCounter;
    let watcher: WorldAchievementWatcher;

    beforeEach(() => {
        world = new World();

        unlocker = {
            unlock: jasmine.createSpy("unlock"),
            fail: jasmine.createSpy("fail"),
            status: jasmine.createSpy("status"),
        };

        const events = new Map<string, number>();
        recorder = {
            getValue: jasmine
                .createSpy("eventCount")
                .and.callFake((id) => events.get(id) || 0),
            setValue: jasmine
                .createSpy("setEventCount")
                .and.callFake((id, count) => events.set(id, count)),
        };

        jumpCounter = new WorldEventCounter({
            valueId: "jump",
            predicate: (event) => event instanceof Jump,
        });

        killCounter = new WorldEventCounter({
            valueId: "kill",
            predicate: (event) => event instanceof Kill,
        });

        watcher = new WorldAchievementWatcher({
            unlocker,
            recorder,
        })
            .addCounter(jumpCounter)
            .addCounter(killCounter);
    });

    it("can unlock the first jump achievement", () => {
        watcher.addAchievement(
            new Achievement({
                id: "first-jump",
                label: "First Jump",
                condition: valueIsEqualOrGreaterThan(jumpCounter.valueId, 1),
            }),
        );
        watcher.bind(world);
        watcher.postBind();

        expect(watcher.achievements[0].condition.progress()).toBe(0);

        world.addEvent(new Jump());
        expect(unlocker.unlock).toHaveBeenCalledWith("first-jump");
        expect(unlocker.fail).not.toHaveBeenCalled();

        expect(watcher.achievements[0].condition.progress()).toBe(1);
    });

    it("can unlock the 5 jumps achievement", () => {
        watcher.addAchievement(
            new Achievement({
                id: "jump-5-times",
                label: "First Jump",
                condition: valueIsEqualOrGreaterThan(jumpCounter.valueId, 5),
            }),
        );
        watcher.bind(world);
        watcher.postBind();

        expect(watcher.achievements[0].condition.progress()).toBe(0);

        world.addEvent(new Jump());
        expect(watcher.achievements[0].condition.progress()).toBe(0.2);

        for (let i = 0; i < 4; i++) {
            world.addEvent(new Jump());
        }

        expect(unlocker.unlock).toHaveBeenCalledWith("jump-5-times");
        expect(unlocker.fail).not.toHaveBeenCalled();

        expect(watcher.achievements[0].condition.progress()).toBe(1);
    });

    it("can fail the never jump achievement", () => {
        watcher.addAchievement(
            new Achievement({
                id: "never-jump",
                label: "Never Jump",
                condition: failIf(valueIsEqualOrGreaterThan(jumpCounter.valueId, 1)),
            }),
        );
        watcher.bind(world);
        watcher.postBind();

        expect(watcher.achievements[0].condition.progress()).toBe(1);

        world.addEvent(new Jump());

        expect(unlocker.unlock).not.toHaveBeenCalled();
        expect(unlocker.fail).toHaveBeenCalledWith("never-jump");

        expect(watcher.achievements[0].condition.progress()).toBe(0);
    });

    it("can unlock the jump and kill achievement", () => {
        watcher.addAchievement(
            new Achievement({
                id: "jump-and-kill",
                label: "Learn to jump and kill",
                condition: succeedIfAll(
                    valueIsEqualOrGreaterThan(jumpCounter.valueId, 1),
                    valueIsEqualOrGreaterThan(killCounter.valueId, 1),
                ),
            }),
        );
        watcher.bind(world);
        watcher.postBind();

        expect(watcher.achievements[0].condition.progress()).toBe(0);

        world.addEvent(new Jump());
        expect(unlocker.unlock).not.toHaveBeenCalled();
        expect(watcher.achievements[0].condition.progress()).toBe(0.5);

        world.addEvent(new Kill());

        expect(unlocker.unlock).toHaveBeenCalledWith("jump-and-kill");

        expect(unlocker.fail).not.toHaveBeenCalled();
        expect(watcher.achievements[0].condition.progress()).toBe(1);
    });

    it("can unlock kill twice without jumping achievement", () => {
        const sequence = new SequenceCounter({
            valueId: "kill-twice-without-jumping",
            eventSequence: [killCounter.valueId, killCounter.valueId],
            resetEvent: jumpCounter.valueId,
        });
        watcher.addCounter(sequence);

        watcher.addAchievement(
            new Achievement({
                id: "kill-twice-without-jumping",
                label: "Kill twice without jumping",
                condition: valueIsEqualOrGreaterThan(sequence.valueId, 1),
            }),
        );
        watcher.bind(world);
        watcher.postBind();

        expect(watcher.achievements[0].condition.progress()).toBe(0);

        for (const event of [new Kill(), new Jump(), new Kill()]) {
            world.addEvent(event);
            watcher.update();
        }

        expect(unlocker.unlock).not.toHaveBeenCalled();

        world.addEvent(new Kill());
        watcher.update();

        expect(unlocker.unlock).toHaveBeenCalledWith(
            "kill-twice-without-jumping",
        );
    });
});
