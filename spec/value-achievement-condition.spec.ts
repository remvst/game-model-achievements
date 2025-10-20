import { World } from "@remvst/game-model";
import {
    AchievementStatus,
    AchievementStatusRecorder,
    ValueAchievementCondition,
    ValueRecorder,
} from "../src";

describe("ValueAchievementCondition", () => {
    let world: World;
    let achievementStatusRecorder: AchievementStatusRecorder;
    let eventCountRecorder: ValueRecorder;

    beforeEach(() => {
        world = new World();
        achievementStatusRecorder = {
            setStatus: jasmine.createSpy("setStatus"),
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
        condition.bind(
            eventCountRecorder,
            achievementStatusRecorder,
            "test-achievement",
        );
        condition.postBind();
        condition.onEventCounted("test-event");

        expect(achievementStatusRecorder.setStatus).toHaveBeenCalledWith(
            "test-achievement",
            AchievementStatus.UNLOCKED,
        );
    });

    it("will not unlock an achievement if the count isn't reached", () => {
        (eventCountRecorder.getValue as jasmine.Spy).and.returnValue(1);

        const condition = new ValueAchievementCondition({
            valueId: "test-event",
            count: 2,
        });
        condition.bind(
            eventCountRecorder,
            achievementStatusRecorder,
            "test-achievement",
        );
        condition.postBind();
        condition.onEventCounted("test-event");

        expect(achievementStatusRecorder.setStatus).not.toHaveBeenCalled();
    });

    it("will not unlock an achievement when the event is unrelated", () => {
        (eventCountRecorder.getValue as jasmine.Spy).and.returnValue(0);

        const condition = new ValueAchievementCondition({
            valueId: "test-event",
            count: 1,
        });
        condition.bind(
            eventCountRecorder,
            achievementStatusRecorder,
            "test-achievement",
        );
        condition.postBind();
        condition.onEventCounted("unrelated-event");

        expect(achievementStatusRecorder.setStatus).not.toHaveBeenCalledWith(
            jasmine.any(String),
            AchievementStatus.UNLOCKED,
        );
    });
});
