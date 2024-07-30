type EventSequenceConfig = {
  actions: EventAction[];
};

export class BattleEvent {
  queue: EventActionSequence[] = [];
  sequenceIndex = 0;
  isRunning = false;

  constructor() {
    document.addEventListener("addEventAction", (e: Event) => {
      this.queue.push((e as CustomEvent).detail);
    });
  }

  async update() {
    if (!this.isRunning && this.queue.length > 0) {
      this.isRunning = true;
      const nextSequence = this.queue.shift();
      if (nextSequence) {
        for (const action of nextSequence.sequence) {
          await action.init();
        }
      }
    }
    this.isRunning = false;
  }

  appendAction(action: EventAction) {
    this.queue[this.sequenceIndex].sequence.push(action);
  }
}

export class EventActionSequence {
  sequence: EventAction[] = [];
  constructor(seq: EventSequenceConfig) {
    this.sequence = seq.actions;
  }
}

export class EventAction {
  constructor() {}

  init(): Promise<void> {
    return new Promise(resolve => {
      //do eventcode here
      resolve();
    });
  }
}
