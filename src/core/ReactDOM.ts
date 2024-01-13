import { ReactElements, render as ReactRender } from "./React";

export default {
  createRoot: function (container: HTMLElement | null) {
    return {
      render: function (element: ReactElements) {
        if (!container) throw new Error("Container is not defined");
        ReactRender(element, container);
      },
    };
  },
};
