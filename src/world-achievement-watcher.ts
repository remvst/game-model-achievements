import { World } from "@remvst/game-model";
import { AchievementUnlocker } from "./achievement-unlocker";
import { Achievement } from "./achievement/achievement";
import { EventCounter } from "./event-counter";

export class WorldAchievementWatcher {
    private world: World;

    private readonly achievements: Achievement[];
    private readonly unlocker: AchievementUnlocker;
    private readonly eventCounter: EventCounter;

    private readonly activeAchievements: Achievement[] = [];

    constructor(opts: {
        readonly achievements: Achievement[],
        readonly unlocker: AchievementUnlocker,
        readonly eventCounter: EventCounter,
    }) {
        this.achievements = opts.achievements;
        this.unlocker = opts.unlocker;
        this.eventCounter = opts.eventCounter;
    }

    private removeActiveAchievement(achievement: Achievement) {
        achievement.matcher.unbind();

        const index = this.activeAchievements.indexOf(achievement);
        if (index >= 0) {
            this.activeAchievements.splice(index, 1);
        }
    }

    bind(world: World) {
        this.world = world;

        for (const achievement of this.achievements) {
            this.activeAchievements.push(achievement);

            achievement.matcher.bind(world, {
                unlock: () => {
                    this.unlocker.unlock();
                    this.removeActiveAchievement(achievement);
                },
                fail: () => {
                    this.unlocker.fail();
                    this.removeActiveAchievement(achievement);
                },
            }, this.eventCounter);
        }
    }

    postBind() {
        for (const achievement of this.achievements) {
            achievement.matcher.postBind();
        }
    }

    update() {
        for (const achievement of this.activeAchievements) {
            achievement.matcher.update();
        }
    }
}
