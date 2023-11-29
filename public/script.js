// 유틸리티 정의
const EVENT_NAME_REGEXP = /^on([A-Z][a-zA-Z]*)$/;
const getPathnameFromHref = (href) => new URL(href).pathname;

/**
 * Creates an HTML element with the specified tag, attributes, and children.
 *
 * @param {string} tag - The tag name of the element to create.
 * @param {Array} attrs - An array of attribute values to set on the element.
 * @param {Array?} children - An array of child elements or text nodes to append to the element.
 * @return {HTMLElement} The newly created HTML element.
 */
const createEl = (tag, attrs, children) => {
  const el = document.createElement(tag);

  for (const [key, attr] of Object.entries(attrs)) {
    if (key.match(EVENT_NAME_REGEXP)) {
      el.addEventListener(key.slice(2).toLowerCase(), attr);
    } else {
      el.setAttribute(key, attr);
    }
  }

  if (children) {
    for (const child of children) {
      if (child instanceof Node) {
        el.appendChild(child);
      } else {
        el.appendChild(document.createTextNode(child));
      }
    }
  }

  return el;
};

// 뷰 정의
const root = document.getElementById("app");

const replaceContent = (htmlString) => {
  const contentView = document.querySelector(".content");
  contentView.innerHTML = htmlString;
};

let count = 0;

const renderCounterPage = () => {
  const increaseCount = () => {
    count++;

    // 전체 화면 재랜더링
    render();
  };
  const decreaseCount = () => {
    count--;

    // 전체 화면 재랜더링
    render();
  };

  return createEl("div", { class: "counter card" }, [
    createEl("h1", { class: "counterTitle" }, [
      `Counter `,
      createEl("span", { class: "counterNumber" }, [count]),
    ]),
    createEl("div", { class: "counterActions" }, [
      createEl("button", { class: "increase", onClick: increaseCount }, [
        "Increase",
      ]),
      createEl("button", { class: "decrease", onClick: decreaseCount }, [
        "Decrease",
      ]),
    ]),
  ]);
};

const renderAboutPage = () => {
  return createEl("div", { class: "about card" }, [
    createEl("h1", { class: "aboutTitle" }, "About"),
    createEl("p", { class: "aboutContent" }, "This is simple ui library"),
  ]);
};

const renderApp = () => {
  const currentPath = window.location.pathname;

  return createEl(
    "div",
    { style: "height: 100%; width: 100%; display: flex; flex-flow: column;" },
    [
      createEl("nav", { class: "navBar" }, [
        ...Object.entries(routeMap).map(([path, { title }]) => {
          return createEl(
            "a",
            {
              class: path === currentPath ? "active" : null,
              href: path,
              onClick: (event) => {
                event.preventDefault();
                const href = event.target.href;

                window.history.pushState({}, "", new URL(href));

                // 전체 화면 재랜더링
                render();
              },
            },
            [title]
          );
        }),
      ]),
      createEl("main", { class: "content" }, [
        routeMap[currentPath].component(),
      ]),
    ]
  );
};

const render = () => {
  root.replaceChildren(renderApp());
};

// 라우팅 맵 설정
const routeMap = {
  "/": {
    title: "home",
    component: renderCounterPage,
  },
  "/about": {
    title: "about",
    component: renderAboutPage,
  },
};

// 초기 화면 렌더링
render();
