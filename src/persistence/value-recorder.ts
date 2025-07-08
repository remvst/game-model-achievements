export type ValueId = string;

export interface ValueRecorder {
    getValue(valueId: ValueId): number;
    setValue(valueId: ValueId, count: number): void;
}
