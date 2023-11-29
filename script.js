// 네비게이션 활성 상태 컨트롤
const removeOriginFromHref = (href) => href.replace(window.location.origin, "");

const updateActiveStateNav = () => {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('nav a');

  navLinks.forEach((link) => {
    if (removeOriginFromHref(link.href) === currentPath) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

// 네비게이션 링크 동작 연결
const bindLinkAction = () => {
  const navLinks = document.querySelectorAll('nav a');

  navLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const href = event.target.href;

      window.history.pushState({}, "", new URL(href));

      renderByLink(href);
      updateActiveStateNav();
    });
  });
}

// 뷰 정의
const root = document.getElementById('app');

const renderApp = () => {
  const htmlString = `
<nav class="navBar">
  <a href="index.html">home</a>
  <a href="about.html">about</a>
</nav>
<main class="content"></main>
`
  root.innerHTML = htmlString;
  bindLinkAction();
  
  renderByLink(window.location.href);
  updateActiveStateNav();
}

const replaceContent = (htmlString) => {
  const contentView = document.querySelector('.content');
  contentView.innerHTML = htmlString;
}

const bindCounterState = () => {
  let count = 0;

  const counter = document.querySelector('.counterNumber');
  const increaseButton = document.querySelector('button.increase');
  const decreaseButton = document.querySelector('button.decrease');

  increaseButton.addEventListener('click', () => {
    count++;
    counter.textContent = count;
  });

  decreaseButton.addEventListener('click', () => {
    count--;
    counter.textContent = count;
  });
}

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
}

const renderAboutPage = () => {
  const htmlString = `
<div class="about card">
  <h1 class="aboutTitle">Abount</h1>
  <p class="aboutContent">
    This is simple ui library
  </p>
</div>
  `;

  replaceContent(htmlString);
}

const renderByLink = (href) => {
  const path = removeOriginFromHref(href);

  if (path === '/index.html') {
    renderCounterPage();
  } else if (path === '/about.html') {
    renderAboutPage()
  }
}

// 초기 화면 렌더링
renderApp();