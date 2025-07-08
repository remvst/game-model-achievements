import { World } from "@remvst/game-model";
import {
    AchievementUnlocker,
    ValueAchievementCondition,
    ValueRecorder,
} from "../src";

describe("ValueAchievementCondition", () => {
    let world: World;
    let unlocker: AchievementUnlocker;
    let eventCountRecorder: ValueRecorder;

    beforeEach(() => {
        world = new World();
        unlocker = {
            unlock: jasmine.createSpy("unlock"),
            fail: jasmine.createSpy("fail"),
            status: jasmine.createSpy("status"),
        };
        eventCountRecorder = {
            getValue: jasmine.createSpy("eventCount"),
            setValue: jasmine.createSpy("setEventCount"),
        };
    });

    afterEach(() => {
        expect(eventCountRecorder.setValue).not.toHaveBeenCalled();
    });

    it("will unlock an achievement when the event count reaches the required amount", () => {
        (eventCountRecorder.getValue as jasmine.Spy).and.returnValue(1);

        const condition = new ValueAchievementCondition({
            valueId: "test-event",
            count: 1,
        });
        condition.bind(eventCountRecorder, unlocker, "test-achievement");
        condition.postBind();
        condition.onEventCounted("test-event");

        expect(unlocker.unlock).toHaveBeenCalledWith("test-achievement");
    });

    it("will not unlock an achievement if the count isn't reached", () => {
        (eventCountRecorder.getValue as jasmine.Spy).and.returnValue(1);

        const condition = new ValueAchievementCondition({
            valueId: "test-event",
            count: 2,
        });
        condition.bind(eventCountRecorder, unlocker, "test-achievement");
        condition.postBind();
        condition.onEventCounted("test-event");

        expect(unlocker.unlock).not.toHaveBeenCalled();
    });

    it("will not unlock an achievement when the event is unrelated", () => {
        (eventCountRecorder.getValue as jasmine.Spy).and.returnValue(1);

        const condition = new ValueAchievementCondition({
            valueId: "test-event",
            count: 1,
        });
        condition.bind(eventCountRecorder, unlocker, "test-achievement");
        condition.postBind();
        condition.onEventCounted("unrealted-event");

        expect(unlocker.unlock).not.toHaveBeenCalled();
    });
});
