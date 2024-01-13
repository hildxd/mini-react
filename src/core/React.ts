type Props = Record<PropertyKey, any> & { children: ReactElements[] };
export type ReactElements = {
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

export function render(element: ReactElements, container: HTMLElement | Text) {
  const dom =
    element.type === "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(element.type);

  const isProperty = (key: string) => key !== "children";
  Object.keys(element.props)
    .filter(isProperty)
    .forEach((name) => {
      // @ts-ignore
      dom[name] = element.props[name];
    });

  element.props.children.forEach((child) => render(child, dom));
  container.appendChild(dom);
}

export default {
  createElement,
  render,
};
