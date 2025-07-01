import { World } from "@remvst/game-model";
import { AchievementUnlocker } from "./achievement-unlocker";
import { Achievement } from "./achievement/achievement";
import { EventCounter } from "./event-counter";

export class WorldAchievementWatcher {
    private world: World;

    constructor(
        private readonly achievements: Achievement[],
        private readonly unlocker: AchievementUnlocker,
        private readonly eventCounter: EventCounter,
    ) {}

    bind(world: World) {
        this.world = world;

        for (const achievement of this.achievements) {
            achievement.matcher.bind(world, this.unlocker, this.eventCounter);
        }
    }

    postBind() {
        for (const achievement of this.achievements) {
            achievement.matcher.postBind();
        }
    }

    update() {
        for (const achievement of this.achievements) {
            achievement.matcher.update();
        }
    }
}
