import React from "./core/React";
const Counter = () => {
  return <div>counter</div>;
};

const CounterWarp = () => {
  return <Counter />;
};
export const App = () => (
  <div>
    hello world
    <CounterWarp />
  </div>
);
