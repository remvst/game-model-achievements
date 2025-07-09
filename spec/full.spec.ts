import { World, WorldEvent } from "@remvst/game-model";
import {
    Achievement,
    AchievementStatus,
    AchievementStatusRecorder,
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
    let achievementStatusRecorder: AchievementStatusRecorder;
    let valueRecorder: ValueRecorder;
    let jumpCounter: ValueCounter;
    let killCounter: ValueCounter;
    let watcher: WorldAchievementWatcher;

    beforeEach(() => {
        world = new World();

        achievementStatusRecorder = {
            setStatus: jasmine.createSpy("setStatus"),
            status: jasmine.createSpy("status"),
        };

        const events = new Map<string, number>();
        valueRecorder = {
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
            achievementStatusRecorder: achievementStatusRecorder,
            recorder: valueRecorder,
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

        expect(watcher.achievements[0].condition.progress()).toEqual({
            current: 0,
            target: 1,
        });

        world.addEvent(new Jump());
        expect(achievementStatusRecorder.setStatus).toHaveBeenCalledWith(
            "first-jump",
            AchievementStatus.UNLOCKED,
        );

        expect(watcher.achievements[0].condition.progress()).toEqual({
            current: 1,
            target: 1,
        });
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

        expect(watcher.achievements[0].condition.progress()).toEqual({
            current: 0,
            target: 5,
        });

        world.addEvent(new Jump());
        expect(watcher.achievements[0].condition.progress()).toEqual({
            current: 1,
            target: 5,
        });

        for (let i = 0; i < 4; i++) {
            world.addEvent(new Jump());
        }

        expect(achievementStatusRecorder.setStatus).toHaveBeenCalledWith(
            "jump-5-times",
            AchievementStatus.UNLOCKED,
        );

        expect(watcher.achievements[0].condition.progress()).toEqual({
            current: 5,
            target: 5,
        });
    });

    it("can fail the never jump achievement", () => {
        watcher.addAchievement(
            new Achievement({
                id: "never-jump",
                label: "Never Jump",
                condition: failIf(
                    valueIsEqualOrGreaterThan(jumpCounter.valueId, 1),
                ),
            }),
        );
        watcher.bind(world);
        watcher.postBind();

        expect(watcher.achievements[0].condition.progress()).toEqual({
            current: 1,
            target: 1,
        });

        world.addEvent(new Jump());

        expect(achievementStatusRecorder.setStatus).toHaveBeenCalledWith(
            "never-jump",
            AchievementStatus.FAILED,
        );

        expect(watcher.achievements[0].condition.progress()).toEqual({
            current: 0,
            target: 1,
        });
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

        expect(watcher.achievements[0].condition.progress()).toEqual({
            current: 0,
            target: 2,
        });

        world.addEvent(new Jump());
        expect(achievementStatusRecorder.setStatus).not.toHaveBeenCalled();
        expect(watcher.achievements[0].condition.progress()).toEqual({
            current: 1,
            target: 2,
        });

        world.addEvent(new Kill());

        expect(achievementStatusRecorder.setStatus).toHaveBeenCalledWith(
            "jump-and-kill",
            AchievementStatus.UNLOCKED,
        );

        expect(watcher.achievements[0].condition.progress()).toEqual({
            current: 2,
            target: 2,
        });
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

        expect(watcher.achievements[0].condition.progress()).toEqual({
            current: 0,
            target: 1,
        });

        for (const event of [new Kill(), new Jump(), new Kill()]) {
            world.addEvent(event);
            watcher.update();
        }

        expect(achievementStatusRecorder.setStatus).not.toHaveBeenCalled();

        world.addEvent(new Kill());
        watcher.update();

        expect(achievementStatusRecorder.setStatus).toHaveBeenCalledWith(
            "kill-twice-without-jumping",
            AchievementStatus.UNLOCKED,
        );
        expect(watcher.achievements[0].condition.progress()).toEqual({
            current: 1,
            target: 1,
        });
    });
});
