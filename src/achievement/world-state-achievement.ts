import { World } from "@remvst/game-model";
import { Achievement } from "./achievement";

export interface WorldStateMatcher {
    eventLabel?: string;
    isInState(world: World): boolean;
}

export class WorldStateAchievement extends Achievement {
    readonly id: string;
    readonly label: string;
    readonly eventCount: number;
    readonly matcher: WorldStateMatcher;

    constructor(opts: {
        id: string;
        label: string;
        eventCount?: number; // How many times we should enter that state
        matcher: WorldStateMatcher;
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
