import { ValueId } from "../model";

export interface ValueRecorder {
    getValue(valueId: ValueId): number;
    setValue(valueId: ValueId, count: number): void;
}
