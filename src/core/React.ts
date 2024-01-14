type Props = Record<PropertyKey, any> & { children: ReactElements[] };
export type ReactElements = {
  type: string;
  props: Props;
};

type Fiber = {
  dom: HTMLElement | Text | null;
  element: ReactElements;
  parent?: Fiber;
  sibling?: Fiber;
  children?: Fiber;
  type: string;
  props: Props;
};

function createTextElement(text: string): ReactElements {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text,
      children: [],
    },
  };
}

export function createElement(
  type: string,
  props: Props,
  ...children: any[]
): ReactElements {
  return {
    type,
    props: {
      ...props,
      children: children.map((child) => {
        if (typeof child === "object") {
          return child;
        }
        return createTextElement(child);
      }),
    },
  };
}

let nextFiber: Fiber | undefined = undefined;
export function render(element: ReactElements, container: HTMLElement | Text) {
  nextFiber = {
    dom: container,
    props: {
      children: [element],
    },
    element: element,
    type: element.type,
  };
}

const wookLoop: IdleRequestCallback = (options) => {
  let deadline = options.timeRemaining();
  let shouldYield = false;
  while (!shouldYield && nextFiber) {
    nextFiber = runUnitOfWork(nextFiber);
    shouldYield = deadline < 1;
  }
  requestIdleCallback(wookLoop);
};

requestIdleCallback(wookLoop);

function runUnitOfWork(fiber?: Fiber) {
  if (!fiber) return;
  if (!fiber.dom) {
    const dom = (fiber.dom =
      fiber.type === "TEXT_ELEMENT"
        ? document.createTextNode("")
        : document.createElement(fiber.type));

    const isProperty = (key: string) => key !== "children";
    Object.keys(fiber.props)
      .filter(isProperty)
      .forEach((name) => {
        // @ts-ignore
        dom[name] = fiber.props[name];
      });
    fiber.parent?.dom?.appendChild(dom);
  }

  let prevChild: Fiber | null = null;
  fiber.props.children.forEach((child, index) => {
    const newFiber: Fiber = {
      dom: null,
      element: child,
      type: child.type,
      props: child.props,
      children: undefined,
      sibling: undefined,
      parent: fiber,
    };
    if (index === 0) {
      fiber.children = newFiber;
    } else {
      prevChild!.children = newFiber;
    }
    prevChild = newFiber;
  });

  if (fiber.children) return fiber.children;
  if (fiber.sibling) return fiber.sibling;
  return fiber!.parent?.sibling;
}

export default {
  createElement,
  render,
};
