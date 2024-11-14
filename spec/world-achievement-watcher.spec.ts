import { World, WorldEvent, entity } from "@remvst/game-model";
import {
    Achievement,
    AchievementUnlocker,
    EventCounter,
    WorldAchievementWatcher,
    WorldEventAchievement,
    WorldStateAchievement,
} from "../src";

class TestEvent implements WorldEvent {
    apply(world: World): void {}
}

describe("WorldAchievementWatcher", () => {
    let world: World;
    let unlocker: AchievementUnlocker;
    let eventCounter: EventCounter;

    beforeEach(() => {
        world = new World();
        unlocker = {
            unlock: jasmine.createSpy("unlock"),
        };

        const events = new Map<string, number>();
        eventCounter = {
            eventCount: jasmine
                .createSpy("eventCount")
                .and.callFake((id) => events.get(id) || 0),
            onEvent: jasmine
                .createSpy("onEvent")
                .and.callFake((id) =>
                    events.set(id, (events.get(id) || 0) + 1),
                ),
        };
    });

    function createWatcher(achievements: Achievement[]) {
        const watcher = new WorldAchievementWatcher(
            achievements,
            unlocker,
            eventCounter,
        );
        watcher.bind(world);
        watcher.postBind();
        return watcher;
    }

    it("can unlock a world state achievement", () => {
        const achievement = new WorldStateAchievement({
            id: "ach",
            label: "Test",
            matcher: {
                isInState: (world) => world.entities.size > 0,
            },
        });

        const watcher = createWatcher([achievement]);
        watcher.update();
        expect(unlocker.unlock).not.toHaveBeenCalled();

        world.entities.add(entity());
        watcher.update();
        expect(unlocker.unlock).toHaveBeenCalledWith(achievement.id);
    });

    it("can unlock a world state achievement that requires multiple occurrences", () => {
        const achievement = new WorldStateAchievement({
            id: "ach",
            label: "Test",
            eventCount: 2,
            matcher: {
                eventLabel: "test",
                isInState: (world) => world.entities.size > 0,
            },
        });

        const watcher = createWatcher([achievement]);
        watcher.update();
        expect(eventCounter.onEvent).not.toHaveBeenCalled();
        expect(unlocker.unlock).not.toHaveBeenCalled();

        const testEntity = entity();

        world.entities.add(testEntity);
        watcher.update();
        expect(eventCounter.onEvent).toHaveBeenCalledTimes(1);
        expect(unlocker.unlock).not.toHaveBeenCalled();

        watcher.update();
        expect(eventCounter.onEvent).toHaveBeenCalledTimes(1);
        expect(unlocker.unlock).not.toHaveBeenCalled();

        testEntity.remove();
        watcher.update();
        expect(eventCounter.onEvent).toHaveBeenCalledTimes(1);
        expect(unlocker.unlock).not.toHaveBeenCalled();

        world.entities.add(testEntity);
        watcher.update();
        expect(eventCounter.onEvent).toHaveBeenCalledTimes(2);
        expect(unlocker.unlock).toHaveBeenCalledWith(achievement.id);
    });

    it("can manage multiple world state achievements with the same event label", () => {
        const achievement1 = new WorldStateAchievement({
            id: "ach1",
            label: "Test",
            eventCount: 1,
            matcher: {
                eventLabel: "test",
                isInState: (world) => world.entities.size > 0,
            },
        });
        const achievement2 = new WorldStateAchievement({
            id: "ach2",
            label: "Test",
            eventCount: 2,
            matcher: {
                eventLabel: "test",
                isInState: (world) => world.entities.size > 0,
            },
        });

        const watcher = createWatcher([achievement1, achievement2]);
        watcher.update();
        expect(eventCounter.onEvent).not.toHaveBeenCalled();
        expect(unlocker.unlock).not.toHaveBeenCalled();

        const testEntity = entity();

        world.entities.add(testEntity);
        watcher.update();
        expect(unlocker.unlock).toHaveBeenCalledWith(achievement1.id);
        expect(unlocker.unlock).not.toHaveBeenCalledWith(achievement2.id);

        testEntity.remove();
        watcher.update();
        expect(unlocker.unlock).toHaveBeenCalledWith(achievement1.id);
        expect(unlocker.unlock).not.toHaveBeenCalledWith(achievement2.id);

        world.entities.add(testEntity);
        watcher.update();
        expect(unlocker.unlock).toHaveBeenCalledWith(achievement1.id);
        expect(unlocker.unlock).toHaveBeenCalledWith(achievement2.id);
    });

    it("can ignore a world event achievement", () => {
        const achievement = new WorldEventAchievement({
            id: "ach",
            label: "Test",
            matcher: {
                filterEvent: () => false,
            },
        });

        createWatcher([achievement]);
        world.addEvent(new TestEvent());
        expect(unlocker.unlock).not.toHaveBeenCalled();
    });

    it("can watch a world event achievement", () => {
        const achievement = new WorldEventAchievement({
            id: "ach",
            label: "Test",
            matcher: {
                filterEvent: (event) => event instanceof TestEvent,
            },
        });

        createWatcher([achievement]);
        expect(unlocker.unlock).not.toHaveBeenCalled();
        expect(eventCounter.onEvent).not.toHaveBeenCalled();

        world.addEvent(new TestEvent());
        expect(unlocker.unlock).toHaveBeenCalledWith(achievement.id);
        expect(eventCounter.onEvent).toHaveBeenCalledTimes(1);
    });

    it("will only unlock a world event achievement once", () => {
        const achievement = new WorldEventAchievement({
            id: "ach",
            label: "Test",
            matcher: {
                filterEvent: (event) => event instanceof TestEvent,
            },
        });

        createWatcher([achievement]);

        world.addEvent(new TestEvent());
        world.addEvent(new TestEvent());
        expect(unlocker.unlock).toHaveBeenCalledTimes(1);
    });

    it("can manage multiple achievements with the same event", () => {
        const achievement1 = new WorldEventAchievement({
            id: "ach1",
            label: "Test",
            matcher: {
                eventLabel: "test-evt",
                filterEvent: (event) => event instanceof TestEvent,
            },
        });
        const achievement2 = new WorldEventAchievement({
            id: "ach2",
            label: "Test",
            matcher: {
                eventLabel: "test-evt",
                filterEvent: (event) => event instanceof TestEvent,
            },
            eventCount: 3,
        });

        createWatcher([achievement1, achievement2]);

        world.addEvent(new TestEvent());
        expect(unlocker.unlock).toHaveBeenCalledTimes(1);
        expect(unlocker.unlock).toHaveBeenCalledWith(achievement1.id);
        expect(eventCounter.onEvent).toHaveBeenCalledTimes(1);

        world.addEvent(new TestEvent());
        world.addEvent(new TestEvent());
        expect(eventCounter.onEvent).toHaveBeenCalledTimes(3);
        expect(unlocker.unlock).toHaveBeenCalledTimes(2);
        expect(unlocker.unlock).toHaveBeenCalledWith(achievement2.id);
    });
});
