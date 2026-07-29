const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');

menuButton?.addEventListener('click', () => {
  const open = nav.classList.toggle('is-open');
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  menuButton.classList.toggle('is-open', open);
  document.body.classList.toggle('is-menu-open', open);
});

document.querySelectorAll('.main-nav a').forEach((link) => {
  link.addEventListener('click', () => {
    nav.classList.remove('is-open');
    menuButton?.classList.remove('is-open');
    menuButton?.setAttribute('aria-expanded', 'false');
    menuButton?.setAttribute('aria-label', 'Open menu');
    document.body.classList.remove('is-menu-open');
  });
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const delay = Number(entry.target.dataset.revealDelay ?? 0);
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (typeof entry.target.animate === 'function') {
        const keyframes = reduceMotion
          ? [{ opacity: 0 }, { opacity: 1 }]
          : [
              { opacity: 0, transform: 'translate3d(0, 32px, 0) scale(.985)', filter: 'blur(6px)' },
              { opacity: 1, transform: 'translate3d(0, 0, 0) scale(1)', filter: 'blur(0)' },
            ];

        entry.target.animate(keyframes, {
          duration: reduceMotion ? 900 : 1250,
          delay,
          easing: 'cubic-bezier(.22, 1, .36, 1)',
          fill: 'both',
        });
      }

      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

const revealElements = document.querySelectorAll('.reveal');

revealElements.forEach((element) => {
  const revealSiblings = Array.from(element.parentElement?.children ?? [])
    .filter((sibling) => sibling.classList.contains('reveal'));
  const siblingIndex = revealSiblings.indexOf(element);
  const delay = Math.min(Math.max(siblingIndex, 0), 5) * 90;

  element.style.setProperty('--reveal-delay', `${delay}ms`);
  element.dataset.revealDelay = String(delay);
});

// Paint the hidden state first so elements already in the viewport also animate.
window.requestAnimationFrame(() => {
  window.requestAnimationFrame(() => {
    revealElements.forEach((element) => observer.observe(element));
  });
});

const scrollProgress = document.querySelector('.scroll-progress span');
let isScrollTicking = false;

const updateScrollProgress = () => {
  const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0;
  scrollProgress?.style.setProperty('transform', `scaleX(${Math.min(1, Math.max(0, progress))})`);
  isScrollTicking = false;
};

window.addEventListener('scroll', () => {
  if (!isScrollTicking) {
    window.requestAnimationFrame(updateScrollProgress);
    isScrollTicking = true;
  }
}, { passive: true });

updateScrollProgress();

const worksMoreButton = document.querySelector('.works-more-button');
const hiddenWorks = document.querySelectorAll('.works-card.is-more');

worksMoreButton?.addEventListener('click', () => {
  const expanded = worksMoreButton.getAttribute('aria-expanded') === 'true';
  hiddenWorks.forEach((card) => card.classList.toggle('is-visible', !expanded));
  worksMoreButton.setAttribute('aria-expanded', String(!expanded));
  worksMoreButton.childNodes[0].textContent = expanded ? 'VIEW MORE' : 'CLOSE';
  if (expanded) {
    document.querySelector('#works-list')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
});
