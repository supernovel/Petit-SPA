const updateActiveStateNav = () => {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('nav a');

  navLinks.forEach((link) => {
    if (link.href.replace(window.location.origin, "") === currentPath) {
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

updateActiveStateNav();
bindCounterState();