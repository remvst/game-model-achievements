export interface EventCounter {
    eventCount(eventLabel: string): number;
    onEvent(eventLabel: string): void;
}
