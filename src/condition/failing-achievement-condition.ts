import { World } from "@remvst/game-model";
import { AchievementUnlocker } from "../achievement-unlocker";
import { EventCounter } from "../event-counter";
import { AchievementCondition } from "./achievement-condition";

export abstract class FailingAchievementCondition extends AchievementCondition {
    constructor(private readonly original: AchievementCondition) {
        super();
    }

    bind(
        world: World,
        unlocker: AchievementUnlocker,
        eventCounter: EventCounter,
    ) {
        super.bind(world, unlocker, eventCounter);
        this.original.bind(
            world,
            {
                unlock: () => this.unlocker.fail(),
                fail: () => this.unlocker.fail(),
            },
            eventCounter,
        );
    }

    postBind() {
        super.postBind();
        this.original.postBind();
    }

    unbind() {
        super.unbind();
        this.original.unbind();
    }

    update() {
        super.update();
        this.original.update();
    }
}
