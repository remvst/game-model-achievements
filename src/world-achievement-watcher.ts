import { World, WorldEvent } from "@remvst/game-model";
import { AchievementUnlocker } from "./achievement-unlocker";
import { Achievement } from "./achievement/achievement";
import {
    WorldEventAchievement,
    WorldEventMatcher,
} from "./achievement/world-event-achievement";
import { WorldStateAchievement } from "./achievement/world-state-achievement";
import { EventCounter } from "./event-counter";

export class WorldAchievementWatcher {
    private world: World;

    private readonly watchedWorldStateAchievements =
        new Set<WorldStateAchievement>();
    private readonly watchedWorldEventAchievements =
        new Set<WorldEventAchievement>();

    private readonly worldEventMatchers = new Map<string, WorldEventMatcher>();

    constructor(
        private readonly achievements: Achievement[],
        private readonly unlocker: AchievementUnlocker,
        private readonly eventCounter: EventCounter,
    ) {}

    bind(world: World) {
        this.world = world;
    }

    postBind() {
        const remainingAchievements = this.achievements.filter(
            (achievement) => !this.unlocker.isUnlocked(achievement.id),
        );
        console.log(
            "Watching for achievements:",
            remainingAchievements.map((a) => a.id),
        );

        for (const achievement of remainingAchievements) {
            if (achievement instanceof WorldStateAchievement) {
                this.watchedWorldStateAchievements.add(achievement);
            } else if (achievement instanceof WorldEventAchievement) {
                this.worldEventMatchers.set(
                    achievement.matcher.eventLabel,
                    achievement.matcher,
                );
                this.watchedWorldEventAchievements.add(achievement);
            }
        }

        this.world.events.subscribe((event) => this.onWorldEvent(event));
    }

    update() {
        for (const achievement of this.watchedWorldStateAchievements) {
            if (achievement.isAchieved(this.world)) {
                this.watchedWorldStateAchievements.delete(achievement);
                this.unlocker.unlock(achievement.id);
            }
        }
    }

    private onWorldEvent(event: WorldEvent) {
        let didCount = false;

        for (const [eventLabel, matcher] of this.worldEventMatchers.entries()) {
            if (!matcher.filterEvent(event)) continue;
            this.eventCounter.onEvent(eventLabel);
            didCount = true;
        }

        if (didCount) {
            for (const achievement of this.watchedWorldEventAchievements) {
                const eventCount = this.eventCounter.eventCount(
                    achievement.matcher.eventLabel,
                );
                if (eventCount < achievement.eventCount) {
                    continue;
                }

                this.watchedWorldEventAchievements.delete(achievement);
                this.unlocker.unlock(achievement.id);
            }
        }
    }
}
