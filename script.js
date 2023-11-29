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

const updateContent = (htmlString) => {
  const content = document.querySelector('.content');
  content.innerHTML = htmlString;
}

const renderCounterPage = () => {
  const content = `
<div class="counter card">
  <h1 class="counterTitle">Counter <span class="counterNumber">0</span> </h1>
  <div class="counterActions">
    <button class="increase">Increase</button>
    <button class="decrease">Decrease</button>
  </div>
</div>
  `;

  updateContent(content);
}

const renderAboutPage = () => {
  const content = `
<div class="about card">
  <h1 class="aboutTitle">Abount</h1>
  <p class="aboutContent">
    This is simple ui library
  </p>
</div>
  `;

  updateContent(content);
}

const handleLink = (href) => {
  const path = removeOriginFromHref(href);

  if (path === '/index.html') {
    renderCounterPage();
  } else if (path === '/about.html') {
    renderAboutPage()
  }
}

const bindLinkAction = () => {
  const navLinks = document.querySelectorAll('nav a');

  navLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const href = event.target.href;

      handleLink(href);
      window.history.pushState({}, "", new URL(href));
      updateActiveStateNav();
    });
  });
}

updateActiveStateNav();
bindCounterState();
bindLinkAction();
