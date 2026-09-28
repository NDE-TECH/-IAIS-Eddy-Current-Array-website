/* =========================================================
   IAIS Eddy Current Array — static interaction layer
   No frameworks, no backend, no build step required.
   ========================================================= */

(() => {
  'use strict';

  const menuButton = document.querySelector('.menu');
  const navigation = document.querySelector('.nav');
  const header = document.querySelector('.header');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Mobile navigation.
  if (menuButton && navigation) {
    menuButton.addEventListener('click', () => {
      const open = navigation.classList.toggle('open');
      menuButton.setAttribute('aria-expanded', String(open));
    });

    navigation.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navigation.classList.remove('open');
        menuButton.setAttribute('aria-expanded', 'false');
      });
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        navigation.classList.remove('open');
        menuButton.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Sticky header depth.
  const updateHeader = () => {
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 18);
  };
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  // Stagger helper classes.
  const staggerTargets = document.querySelectorAll('.card, .map-card, .image-band figure, .hero-highlights > div, .footer-cta');
  staggerTargets.forEach((item, index) => item.classList.add(`delay-${Math.min(index % 4, 3)}`));

  // Progressive reveal.
  if (!reduceMotion && 'IntersectionObserver' in window) {
    const items = document.querySelectorAll('.section h2, .section .lead, .card, .aside, .home-callout, .contact-box, .value-grid > div, form, .hero-media, .map-card, .image-band figure, .visual-panel, .hero-highlights > div, .footer-cta');
    items.forEach((item) => item.classList.add('reveal-ready'));

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });

    items.forEach((item) => observer.observe(item));
  }

  // Light parallax on hero visuals.
  if (!reduceMotion) {
    const parallaxItems = document.querySelectorAll('.hero-media, .application-gallery figure, .image-band figure, .visual-panel');
    const updateParallax = () => {
      parallaxItems.forEach((item) => {
        const rect = item.getBoundingClientRect();
        const offset = Math.max(-18, Math.min(18, (rect.top - window.innerHeight * 0.5) * -0.025));
        item.style.transform = `translate3d(0, ${offset}px, 0)`;
      });
    };

    updateParallax();
    window.addEventListener('scroll', updateParallax, { passive: true });
    window.addEventListener('resize', updateParallax);
  }


  // Subtle pointer tilt for cards on precise-pointer devices.
  if (!reduceMotion && window.matchMedia('(pointer: fine)').matches) {
    document.querySelectorAll('.card').forEach((card) => {
      card.addEventListener('pointermove', (event) => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `translateY(-7px) rotateX(${(-y * 2.2).toFixed(2)}deg) rotateY(${(x * 2.2).toFixed(2)}deg)`;
      });
      card.addEventListener('pointerleave', () => {
        card.style.transform = '';
      });
    });
  }


  // Slight magnetic movement for buttons on precise-pointer devices.
  if (!reduceMotion && window.matchMedia('(pointer: fine)').matches) {
    document.querySelectorAll('.btn, .submit').forEach((button) => {
      button.addEventListener('pointermove', (event) => {
        const rect = button.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        button.style.transform = `translate(${(x * 5).toFixed(2)}px, ${(y * 3).toFixed(2)}px)`;
      });
      button.addEventListener('pointerleave', () => {
        button.style.transform = '';
      });
    });
  }

  // Static enquiry form: prepares an email in the visitor's mail app.
  const enquiryForm = document.querySelector('#enquiry');
  if (enquiryForm) {
    enquiryForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const data = new FormData(enquiryForm);
      const entity = data.get('entity');
      const email = entity === 'UAE' ? 'i@iaisuae.com' : 'i@iaisindia.com';
      const subject = `ECA inspection enquiry — ${data.get('service')}`;
      const body = [
        `Name: ${data.get('name')}`,
        `Company: ${data.get('company')}`,
        `Email: ${data.get('email')}`,
        `Phone: ${data.get('phone')}`,
        `Location: ${data.get('location')}`,
        `Service: ${data.get('service')}`,
        'Project details:',
        data.get('details')
      ].join('\n');

      window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      const note = document.querySelector('#form-note');
      if (note) {
        note.textContent = 'Your email application will open with the enquiry. Please send the email to complete your request.';
      }
    });
  }
})();
