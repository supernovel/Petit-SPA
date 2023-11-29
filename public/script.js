// 유틸리티 정의
const getPathnameFromHref = (href) => new URL(href).pathname;

const createEl = (tag, attrs, ...children) => {
  const el = document.createElement(tag);

  for (const attr of attrs) {
    el.setAttribute(key, attr);
  }

  if (children) {
    for (const child of children) {
      if (el instanceof Node) {
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

const bindCounterState = () => {
  let count = 0;

  const counter = document.querySelector(".counterNumber");
  const increaseButton = document.querySelector("button.increase");
  const decreaseButton = document.querySelector("button.decrease");

  increaseButton.addEventListener("click", () => {
    count++;
    counter.textContent = count;
  });

  decreaseButton.addEventListener("click", () => {
    count--;
    counter.textContent = count;
  });
};

const renderCounterPage = () => {
  const htmlString = `
<div class="counter card">
  <h1 class="counterTitle">Counter <span class="counterNumber">0</span> </h1>
  <div class="counterActions">
    <button class="increase">Increase</button>
    <button class="decrease">Decrease</button>
  </div>
</div>
  `;

  replaceContent(htmlString);
  bindCounterState();
};

const renderAboutPage = () => {
  const htmlString = `
<div class="about card">
  <h1 class="aboutTitle">About</h1>
  <p class="aboutContent">
    This is simple ui library
  </p>
</div>
  `;

  replaceContent(htmlString);
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

const renderByLink = (href) => {
  const path = getPathnameFromHref(href);

  routeMap[path].component();
};

const renderApp = () => {
  const htmlString = `
<nav class="navBar">
  ${Object.entries(routeMap).map(
    ([path, { title }]) => `
    <a href="${path}">${title}</a>`
  )}
</nav>
<main class="content"></main>
`;
  root.innerHTML = htmlString;
  bindLinkAction();

  renderByLink(window.location.href);
  updateActiveStateNav();
};

// 네비게이션 활성 상태 컨트롤
const updateActiveStateNav = () => {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll("nav a");

  navLinks.forEach((link) => {
    if (getPathnameFromHref(link.href) === currentPath) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
};

// 네비게이션 링크 동작 연결
const bindLinkAction = () => {
  const navLinks = document.querySelectorAll("nav a");

  navLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const href = event.target.href;

      window.history.pushState({}, "", new URL(href));

      renderByLink(href);
      updateActiveStateNav();
    });
  });
};

// 초기 화면 렌더링
renderApp();
