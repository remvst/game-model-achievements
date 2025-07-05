import { World } from "@remvst/game-model";
import {
    Achievement,
    AchievementUnlocker,
    EventCountRecorder,
    EventCounter,
    WorldAchievementWatcher,
} from "../src";

describe("WorldAchievementWatcher", () => {
    let world: World;
    let unlocker: AchievementUnlocker;
    let eventCountRecorder: EventCountRecorder;

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
            reset: jasmine.createSpy("reset"),
        };
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

    it("can unlock a world state achievement", () => {
        // const can
        // const watcher = createWatcher({
        //     counters: [
        //         new WorldStateCounter({
        //             eventId: "test-event",
        //             predicate: (world) => world.entities.size > 0,
        //         }),
        //     ],
        //     achievements: [
        //         new Achievement({
        //             id: "test-achievement",
        //             label: "Test Achievement",
        //             condition: new EventCountAchievementCondition({
        //                 eventId: "test-event",
        //                 count: 1,
        //             }),
        //         }),
        //     ]
        // });
        // watcher.update();
        // expect(unlocker.unlock).not.toHaveBeenCalled();
        // world.entities.add(entity());
        // watcher.update();
        // expect(unlocker.unlock).toHaveBeenCalledWith("test-achievement");
    });
});
