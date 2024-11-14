import { World } from "@remvst/game-model";
import { Achievement } from "./achievement";

export class WorldStateAchievement extends Achievement {
    readonly id: string;
    readonly label: string;
    readonly isAchieved: (world: World) => boolean;

    constructor(opts: {
        id: string;
        label: string;
        isAchieved: (world: World) => boolean;
    }) {
        super();
        this.id = opts.id;
        this.label = opts.label;
        this.isAchieved = opts.isAchieved;
    }
}
