import { World, WorldEvent } from "@remvst/game-model";
import {
    Achievement,
    AchievementUnlocker,
    EventCountRecorder,
    EventCounter,
    SequenceEventCounter,
    WorldAchievementWatcher,
    WorldEventCounter,
    eventOccurs,
    failIf,
    succeedIfAll,
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
    let eventCountRecorder: EventCountRecorder;
    let jumpCounter: EventCounter;
    let killCounter: EventCounter;
    let watcher: WorldAchievementWatcher;

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

        watcher = new WorldAchievementWatcher({
            unlocker,
            eventCountRecorder,
        })
            .addEventCounter(jumpCounter)
            .addEventCounter(killCounter);
    });

    it("can unlock the first jump achievement", () => {
        watcher.addAchievement(
            new Achievement({
                id: "first-jump",
                label: "First Jump",
                condition: eventOccurs(jumpCounter.eventId, 1),
            }),
        );
        watcher.bind(world);
        watcher.postBind();

        expect(
            watcher.achievements[0].condition.progress(eventCountRecorder),
        ).toBe(0);

        world.addEvent(new Jump());
        expect(unlocker.unlock).toHaveBeenCalledWith("first-jump");
        expect(unlocker.fail).not.toHaveBeenCalled();

        expect(
            watcher.achievements[0].condition.progress(eventCountRecorder),
        ).toBe(1);
    });

    it("can unlock the 5 jumps achievement", () => {
        watcher.addAchievement(
            new Achievement({
                id: "jump-5-times",
                label: "First Jump",
                condition: eventOccurs(jumpCounter.eventId, 5),
            }),
        );
        watcher.bind(world);
        watcher.postBind();

        expect(
            watcher.achievements[0].condition.progress(eventCountRecorder),
        ).toBe(0);

        world.addEvent(new Jump());
        expect(
            watcher.achievements[0].condition.progress(eventCountRecorder),
        ).toBe(0.2);

        for (let i = 0; i < 4; i++) {
            world.addEvent(new Jump());
        }

        expect(unlocker.unlock).toHaveBeenCalledWith("jump-5-times");
        expect(unlocker.fail).not.toHaveBeenCalled();

        expect(
            watcher.achievements[0].condition.progress(eventCountRecorder),
        ).toBe(1);
    });

    it("can fail the never jump achievement", () => {
        watcher.addAchievement(
            new Achievement({
                id: "never-jump",
                label: "Never Jump",
                condition: failIf(eventOccurs(jumpCounter.eventId, 1)),
            }),
        );
        watcher.bind(world);
        watcher.postBind();

        expect(
            watcher.achievements[0].condition.progress(eventCountRecorder),
        ).toBe(1);

        world.addEvent(new Jump());

        expect(unlocker.unlock).not.toHaveBeenCalled();
        expect(unlocker.fail).toHaveBeenCalledWith("never-jump");

        expect(
            watcher.achievements[0].condition.progress(eventCountRecorder),
        ).toBe(0);
    });

    it("can unlock the jump and kill achievement", () => {
        watcher.addAchievement(
            new Achievement({
                id: "jump-and-kill",
                label: "Learn to jump and kill",
                condition: succeedIfAll(
                    eventOccurs(jumpCounter.eventId, 1),
                    eventOccurs(killCounter.eventId, 1),
                ),
            }),
        );
        watcher.bind(world);
        watcher.postBind();

        expect(
            watcher.achievements[0].condition.progress(eventCountRecorder),
        ).toBe(0);

        world.addEvent(new Jump());
        expect(unlocker.unlock).not.toHaveBeenCalled();
        expect(
            watcher.achievements[0].condition.progress(eventCountRecorder),
        ).toBe(0.5);

        world.addEvent(new Kill());

        expect(unlocker.unlock).toHaveBeenCalledWith("jump-and-kill");

        expect(unlocker.fail).not.toHaveBeenCalled();
        expect(
            watcher.achievements[0].condition.progress(eventCountRecorder),
        ).toBe(1);
    });

    it("can unlock kill twice without jumping achievement", () => {
        const sequence = new SequenceEventCounter({
            eventId: "kill-twice-without-jumping",
            eventSequence: [killCounter.eventId, killCounter.eventId],
            resetEvent: jumpCounter.eventId,
        });
        watcher.addEventCounter(sequence);

        watcher.addAchievement(
            new Achievement({
                id: "kill-twice-without-jumping",
                label: "Kill twice without jumping",
                condition: eventOccurs(sequence.eventId, 1),
            }),
        );
        watcher.bind(world);
        watcher.postBind();

        expect(
            watcher.achievements[0].condition.progress(eventCountRecorder),
        ).toBe(0);

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
