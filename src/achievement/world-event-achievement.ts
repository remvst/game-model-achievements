import { WorldEvent } from "@remvst/game-model";
import { Achievement } from "./achievement";

export interface WorldEventMatcher {
    eventLabel?: string;
    filterEvent(event: WorldEvent): boolean;
}

export class WorldEventAchievement extends Achievement {
    readonly id: string;
    readonly label: string;
    readonly matcher: WorldEventMatcher;
    readonly eventCount: number;

    constructor(opts: {
        id: string;
        label: string;
        matcher: WorldEventMatcher;
        eventCount?: number;
    }) {
        super();
        this.id = opts.id;
        this.label = opts.label;
        this.matcher = opts.matcher;
        this.eventCount = opts.eventCount === undefined ? 1 : opts.eventCount;

        if (!this.matcher.eventLabel) {
            this.matcher.eventLabel = this.id;
        }
    }
}
