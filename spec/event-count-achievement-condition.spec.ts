import { World } from "@remvst/game-model";
import {
    AchievementUnlocker,
    EventCountAchievementCondition,
    EventCountRecorder,
} from "../src";

describe("EventCountAchievementCondition", () => {
    let world: World;
    let unlocker: AchievementUnlocker;
    let eventCountRecorder: EventCountRecorder;

    beforeEach(() => {
        world = new World();
        unlocker = {
            unlock: jasmine.createSpy("unlock"),
            fail: jasmine.createSpy("fail"),
        };
        eventCountRecorder = {
            eventCount: jasmine.createSpy("eventCount"),
            onEvent: jasmine.createSpy("onEvent"),
        };
    });

    afterEach(() => {
        expect(eventCountRecorder.onEvent).not.toHaveBeenCalled();
    });

    it("will unlock an achievement when the event count reaches the required amount", () => {
        (eventCountRecorder.eventCount as jasmine.Spy).and.returnValue(1);

        const condition = new EventCountAchievementCondition({
            eventId: "test-event",
            count: 1,
        });
        condition.bind(eventCountRecorder, unlocker, "test-achievement");
        condition.postBind();
        condition.onEventCounted("test-event");

        expect(unlocker.unlock).toHaveBeenCalledWith("test-achievement");
    });

    it("will not unlock an achievement if the count isn't reached", () => {
        (eventCountRecorder.eventCount as jasmine.Spy).and.returnValue(1);

        const condition = new EventCountAchievementCondition({
            eventId: "test-event",
            count: 2,
        });
        condition.bind(eventCountRecorder, unlocker, "test-achievement");
        condition.postBind();
        condition.onEventCounted("test-event");

        expect(unlocker.unlock).not.toHaveBeenCalled();
    });

    it("will not unlock an achievement when the event is unrelated", () => {
        (eventCountRecorder.eventCount as jasmine.Spy).and.returnValue(1);

        const condition = new EventCountAchievementCondition({
            eventId: "test-event",
            count: 1,
        });
        condition.bind(eventCountRecorder, unlocker, "test-achievement");
        condition.postBind();
        condition.onEventCounted("unrealted-event");

        expect(unlocker.unlock).not.toHaveBeenCalled();
    });
});
