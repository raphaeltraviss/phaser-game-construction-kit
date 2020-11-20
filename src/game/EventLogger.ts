import {
  VampireTunnelsEventEmitter,
  VampireTunnelsEvent,
  EventSink
} from "./events";

export default class EventLogger implements EventSink {
  listen(event_bus: VampireTunnelsEventEmitter, target_name: string) {
    // Register for all events for that target name.
    Object.keys(VampireTunnelsEvent).forEach((k) => {
      const event_name = `${target_name}/${VampireTunnelsEvent[k]}`;
      event_bus.on(event_name, this.log_event.bind(this, event_name));
    });
  }

  private log_event(event_name, payload) {
    console.log(event_name, payload);
  }
}
