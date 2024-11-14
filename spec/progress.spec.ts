import {
    ActionAchievement,
    EventCounter,
    WorldEventAchievement,
    WorldStateAchievement,
    achievementProgress,
} from "../src";

describe("achievement progress", () => {
    let eventCounter: EventCounter;

    beforeEach(() => {
        eventCounter = {
            eventCount: jasmine.createSpy(),
            onEvent: jasmine.createSpy(),
        };
    });

    it("should return 0 for a world state achievement", () => {
        const achievement = new WorldStateAchievement({
            id: "ach",
            label: "Test",
            matcher: {
                isInState: jasmine.createSpy(),
            },
        });
        const progress = achievementProgress(eventCounter, achievement);
        expect(progress).toBe(0);
    });

    it("should return the progress for a world event achievement", () => {
        const achievement = new WorldEventAchievement({
            id: "ach",
            label: "Test",
            eventCount: 10,
            matcher: {
                eventLabel: "test",
                filterEvent: jasmine.createSpy(),
            },
        });

        eventCounter.eventCount = jasmine.createSpy().and.returnValue(5);

        const progress = achievementProgress(eventCounter, achievement);
        expect(progress).toBe(0.5);
    });

    it("should return the progress for an action achievement", () => {
        const achievement = new ActionAchievement({
            id: "ach",
            label: "Test",
            eventCount: 10,
            eventLabel: "test",
        });

        eventCounter.eventCount = jasmine.createSpy().and.returnValue(5);

        const progress = achievementProgress(eventCounter, achievement);
        expect(progress).toBe(0.5);
    });
});
