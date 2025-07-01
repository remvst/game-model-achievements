import { World } from "@remvst/game-model";
import { AchievementUnlocker } from "../achievement-unlocker";
import { EventCounter } from "../event-counter";

export abstract class AchievementCondition {
    protected world: World;
    protected unlocker: AchievementUnlocker;
    protected eventCounter: EventCounter;

    bind(
        world: World,
        unlocker: AchievementUnlocker,
        eventCounter: EventCounter,
    ) {
        this.world = world;
        this.unlocker = unlocker;
        this.eventCounter = eventCounter;
    }

    postBind() {}

    unbind() {
        this.world = null;
        this.unlocker = null;
        this.eventCounter = null;
    }

    update() {}

    achieve() {
        this.unlocker.unlock();
    }
}
