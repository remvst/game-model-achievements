import { World, WorldEvent } from "@remvst/game-model";
import {
    Achievement,
    AchievementUnlocker,
    EventCountAchievementCondition,
    EventCountRecorder,
    EventCounter,
    MultiAchievementCondition,
    WorldAchievementWatcher,
    WorldEventCounter,
} from "../src";
import { FailingAchievementCondition } from "./../src/condition/failing-achievement-condition";

class Jump implements WorldEvent {
    apply(world: World): void {}
}

class Kill implements WorldEvent {
    apply(world: World): void {}
}

describe("full example", () => {
    let world: World;
    let unlocker: AchievementUnlocker;
    let eventCountRecorder: EventCountRecorder;
    let jumpCounter: EventCounter;
    let killCounter: EventCounter;

    beforeEach(() => {
        world = new World();

        unlocker = {
            unlock: jasmine.createSpy("unlock"),
            fail: jasmine.createSpy("fail"),
        };

        const events = new Map<string, number>();
        eventCountRecorder = {
            eventCount: jasmine
                .createSpy("eventCount")
                .and.callFake((id) => events.get(id) || 0),
            onEvent: jasmine
                .createSpy("onEvent")
                .and.callFake((id) =>
                    events.set(id, (events.get(id) || 0) + 1),
                ),
        };

        jumpCounter = new WorldEventCounter({
            eventId: "jump",
            predicate: (event) => event instanceof Jump,
        });

        killCounter = new WorldEventCounter({
            eventId: "kill",
            predicate: (event) => event instanceof Kill,
        });
    });

    function createWatcher(opts: {
        counters: EventCounter[];
        achievements: Achievement[];
    }) {
        const watcher = new WorldAchievementWatcher({
            ...opts,
            unlocker,
            eventCountRecorder,
        });
        watcher.bind(world);
        watcher.postBind();
        return watcher;
    }

    it("can unlock the first jump achievement", () => {
        const watcher = createWatcher({
            counters: [killCounter, jumpCounter],
            achievements: [
                new Achievement({
                    id: "first-jump",
                    label: "First Jump",
                    condition: new EventCountAchievementCondition({
                        eventId: jumpCounter.eventId,
                        count: 1,
                    }),
                }),
            ],
        });

        expect(watcher.achievements[0].condition.progress(eventCountRecorder)).toBe(0);

        world.addEvent(new Jump());
        expect(unlocker.unlock).toHaveBeenCalledWith("first-jump");
        expect(unlocker.fail).not.toHaveBeenCalled();

        expect(watcher.achievements[0].condition.progress(eventCountRecorder)).toBe(1);
    });

    it("can unlock the 5 jumps achievement", () => {
        const watcher = createWatcher({
            counters: [killCounter, jumpCounter],
            achievements: [
                new Achievement({
                    id: "jump-5-times",
                    label: "First Jump",
                    condition: new EventCountAchievementCondition({
                        eventId: jumpCounter.eventId,
                        count: 5,
                    }),
                }),
            ],
        });

        expect(watcher.achievements[0].condition.progress(eventCountRecorder)).toBe(0);

        world.addEvent(new Jump());
        expect(watcher.achievements[0].condition.progress(eventCountRecorder)).toBe(0.2);

        for (let i = 0; i < 4; i++) {
            world.addEvent(new Jump());
        }

        expect(unlocker.unlock).toHaveBeenCalledWith("jump-5-times");
        expect(unlocker.fail).not.toHaveBeenCalled();

        expect(watcher.achievements[0].condition.progress(eventCountRecorder)).toBe(1);
    });

    it("can fail the never jump achievement", () => {
        const watcher = createWatcher({
            counters: [killCounter, jumpCounter],
            achievements: [
                new Achievement({
                    id: "never-jump",
                    label: "Never Jump",
                    condition: new FailingAchievementCondition(
                        new EventCountAchievementCondition({
                            eventId: jumpCounter.eventId,
                            count: 1,
                        }),
                    ),
                }),
            ],
        });

        expect(watcher.achievements[0].condition.progress(eventCountRecorder)).toBe(1);

        world.addEvent(new Jump());

        expect(unlocker.unlock).not.toHaveBeenCalled();
        expect(unlocker.fail).toHaveBeenCalledWith("never-jump");

        expect(watcher.achievements[0].condition.progress(eventCountRecorder)).toBe(0);
    });

    it("can unlock the jump and kill achievement", () => {
        const watcher = createWatcher({
            counters: [killCounter, jumpCounter],
            achievements: [
                new Achievement({
                    id: "jump-and-kill",
                    label: "Learn to jump and kill",
                    condition: new MultiAchievementCondition([
                        new EventCountAchievementCondition({
                            eventId: jumpCounter.eventId,
                            count: 1,
                        }),
                        new EventCountAchievementCondition({
                            eventId: killCounter.eventId,
                            count: 1,
                        }),
                    ]),
                }),
            ],
        });

        expect(watcher.achievements[0].condition.progress(eventCountRecorder)).toBe(0);

        world.addEvent(new Jump());
        expect(unlocker.unlock).not.toHaveBeenCalled();
        expect(watcher.achievements[0].condition.progress(eventCountRecorder)).toBe(0.5);

        world.addEvent(new Kill());

        expect(unlocker.unlock).toHaveBeenCalledWith("jump-and-kill");

        expect(unlocker.fail).not.toHaveBeenCalled();expect(watcher.achievements[0].condition.progress(eventCountRecorder)).toBe(1);
    });
});
