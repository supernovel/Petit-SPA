// 유틸리티 정의
const EVENT_NAME_REGEXP = /^on([A-Z][a-zA-Z]*)$/;

/**
 * Creates an HTML element with the specified tag, attributes, and children.
 *
 * @param {string|function} tag - The tag name of the element to create.
 * @param {Array} attrs - An array of attribute values to set on the element.
 * @param {Array?} children - An array of child elements or text nodes to append to the element.
 * @return {CustomNode} The newly created HTML element.
 */
let nodeId = 0;
const createNode = (type, attrs, children) => {
  return {
    key: nodeId++,
    type,
    attrs,
    children,
  };
};

const render = (node, container) => {
  const createHtmlElement = (tag, attrs) => {
    const el = document.createElement(tag);

    for (const [key, attr] of Object.entries(attrs)) {
      if (key.match(EVENT_NAME_REGEXP)) {
        el.addEventListener(key.slice(2).toLowerCase(), attr);
      } else {
        el.setAttribute(key, attr);
      }
    }

    return el;
  };

  if (typeof node.type === "function") {
    currentHookNode = node;
    node.currentHookIndex = 0;

    const child = node.type({ ...node.attrs, children: node.children });

    const element = render(child, container);
    node._element = element;

    node.render = () => {
      currentHookNode = node;
      node.currentHookIndex = 0;

      const child = node.type({ ...node.attrs, children: node.children });
      const element = render(child, container);
      
      node._element.replaceWith(element);
      node._element = element;
    };

    return;
  }

  let element;

  if (typeof node.type === "string") {
    element = createHtmlElement(node.type, node.attrs);

    for (const childNode of node.children) {
      render(childNode, element);
    }
  } else {
    element = document.createTextNode(node);
  }

  container.appendChild(element);

  return element;
};

// 훅 정의
const hookMap = {};
let currentHookNode = null;

const useState = (initialValue) => {
  const node = currentHookNode;
  const hooks = hookMap[node.key] || (hookMap[node.key] = []);
  const hookIndex = node.currentHookIndex;
  const value = hooks[hookIndex] || initialValue;

  hooks[hookIndex] = value;

  node.currentHookIndex++;

  return [
    value,
    (newValue) => {
      hooks[hookIndex] = newValue;
      node.render();
    },
  ];
};

const useEffect = (callback, dependencies) => {
  const node = currentHookNode;
  const hooks = hookMap[node.key] || (hookMap[node.key] = []);
  const hookIndex = node.currentHookIndex;
  const prevDependencies = hooks[hookIndex] ?? [];
  let hasChanged = false;

  if (dependencies) {
    hasChanged = dependencies.some(
      (value, index) => value !== prevDependencies[index]
    );
  } else {
    hasChanged = true;
  }

  if (hasChanged) {
    callback();
  }

  hooks[hookIndex] = dependencies;

  node.currentHookIndex++;
};

// 컴포넌트 정의
const Link = ({ href, children, ...attrs }) => {
  const currentPath = window.location.pathname;

  return createNode(
    "a",
    {
      class: href === currentPath ? "active" : null,
      onClick: (event) => {
        event.preventDefault();
        const href = event.target.href;

        window.history.pushState({}, "", new URL(href));

        attrs.onClick && attrs.onClick(event);
      },
      href,
      ...attrs,
    },
    children
  );
};

const CounterPage = ({ children }) => {
  const [count1, setCount1] = useState(0);
  const [count2, setCount2] = useState(0);
  const increaseCount = () => {
    setCount1(count1 + 1);
    setCount2(count2 - 1);
  };
  const decreaseCount = () => {
    setCount1(count1 - 1);
    setCount2(count2 + 1);
  };

  return createNode("div", { class: "counter card" }, [
    createNode("h1", { class: "counterTitle" }, [
      `Counter `,
      createNode("span", { class: "counterNumber" }, [count1, ":", count2]),
    ]),
    createNode("div", { class: "counterActions" }, [
      createNode("button", { class: "increase", onClick: increaseCount }, [
        "Increase",
      ]),
      createNode("button", { class: "decrease", onClick: decreaseCount }, [
        "Decrease",
      ]),
    ]),
    ...(children || []),
  ]);
};

const AboutPage = () => {
  return createNode("div", { class: "about card" }, [
    createNode("h1", { class: "aboutTitle" }, "About"),
    createNode("p", { class: "aboutContent" }, "This is simple ui library"),
    createNode(CounterPage, {}, [
      createNode(CounterPage, {}, [createNode(CounterPage, {}, [])]),
    ]),
  ]);
};

const App = () => {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    console.log(currentPath);
  }, [currentPath]);

  return createNode(
    "div",
    { style: "height: 100%; width: 100%; display: flex; flex-flow: column;" },
    [
      createNode("nav", { class: "navBar" }, [
        ...Object.entries(routeMap).map(([path, { title }]) => {
          return createNode(
            Link,
            {
              href: path,
              onClick: () => {
                setCurrentPath(window.location.pathname);
              },
            },
            [title]
          );
        }),
      ]),
      createNode("main", { class: "content" }, [
        createNode(routeMap[currentPath].component, {}, []),
      ]),
    ]
  );
};

// 라우팅 맵 설정
const routeMap = {
  "/": {
    title: "home",
    component: CounterPage,
  },
  "/about": {
    title: "about",
    component: AboutPage,
  },
};

const root = document.getElementById("app");

// 초기 화면 렌더링
const renderApp = () => {
  root.innerHTML = "";
  render(createNode(App, {}, []), root);
};

renderApp();
