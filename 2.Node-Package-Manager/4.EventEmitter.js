// https://nodejs.org/api/events.html#class-eventemitter
// https://dev.to/angdecoder/mastering-event-emitters-in-nodejs-4ijc
// two important methods .on() and .emit()

const EventEmitter = require("events");
const myFirstEmitter = new EventEmitter();

// register an event
myFirstEmitter.on("event", () => {
  console.log("an event occured!");
});

// emitting an event
myFirstEmitter.emit("event");

// ---------- passing multiple functions to the same event -----------//

const myEmitter = new EventEmitter();

// First listener
myEmitter.on("event", function firstListener() {
  console.log("Helloooo! first listener");
});
// Second listener
myEmitter.on("event", function secondListener(arg1, arg2) {
  console.log(`event with parameters ${arg1}, ${arg2} in second listener`);
});
// Third listener
myEmitter.on("event", function thirdListener(...args) {
  const parameters = args.join(", ");
  console.log(`event with parameters ${parameters} in third listener`);
});

console.log(myEmitter.listeners("event"));

myEmitter.emit("event", 1, 2, 3, 4, 5);

// ---------- Creating custom event Listeners -----------//

class myCustomEmitter extends EventEmitter {
  constructor() {
    super();
    this.greeting = "Hello";
  }

  greet(name) {
    this.emit("greeting", `${this.greeting} ${name}`);
  }
}

const customEmitter = new myCustomEmitter();

customEmitter.on("greeting", (input) => {
  console.log("greeting event", input);
});

customEmitter.greet("Dennis");
