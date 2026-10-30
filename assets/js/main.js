/**
 * APERAT - Script Principal (JavaScript Vanilla Moderno)
 * Funcionalidades: Barra de progreso de lectura, Scroll Reveal animado,
 * contador numérico interactivo, Header sticky dinámico, Modal de donación con pestañas,
 * carrusel de artículos, scroll suave y botón volver arriba.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Barra de progreso de lectura y Header con sombra/glassmorphism al hacer scroll
  const siteHeader = document.querySelector('.site-header');
  const scrollTopBtn = document.querySelector('.scroll-top-btn');
  const progressBar = document.getElementById('scroll-progress');

  const handleScroll = () => {
    const scrollY = window.scrollY || window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;

    // Actualizar barra de progreso de lectura
    if (progressBar && docHeight > 0) {
      const scrollPercent = Math.min(100, Math.max(0, (scrollY / docHeight) * 100));
      progressBar.style.width = `${scrollPercent}%`;
    }

    // Header scrolled state
    if (siteHeader) {
      if (scrollY > 20) {
        siteHeader.classList.add('scrolled');
      } else {
        siteHeader.classList.remove('scrolled');
      }
    }

    // Botón volver arriba
    if (scrollTopBtn) {
      if (scrollY > 350) {
        scrollTopBtn.classList.add('is-visible');
      } else {
        scrollTopBtn.classList.remove('is-visible');
      }
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // 2. Botón volver arriba (Scroll to top)
  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // 3. Animaciones Scroll Reveal con IntersectionObserver
  const revealElements = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px 0px -60px 0px',
      threshold: 0.1
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback directo si no hay IntersectionObserver
    revealElements.forEach(el => el.classList.add('is-revealed'));
  }

  // 4. Contador Numérico Interactivo para Métricas
  const counterElements = document.querySelectorAll('[data-counter]');
  if (counterElements.length > 0) {
    const animateCounter = (el) => {
      const target = parseInt(el.getAttribute('data-counter'), 10);
      if (isNaN(target)) return;

      const duration = 1600; // ms
      const startTime = performance.now();

      const updateCounter = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Easing out cubic
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentVal = Math.round(easeOut * target);

        el.textContent = currentVal;

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          el.textContent = target;
        }
      };

      requestAnimationFrame(updateCounter);
    };

    if ('IntersectionObserver' in window) {
      const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.3
      });

      counterElements.forEach(el => counterObserver.observe(el));
    } else {
      counterElements.forEach(el => animateCounter(el));
    }
  }

  // 5. Menú móvil (Toggle Hamburger)
  const navToggle = document.querySelector('.navbar__toggle');
  const navMenu = document.querySelector('.navbar__menu');

  if (navToggle && navMenu) {
    const toggleMenu = () => {
      const isActive = navToggle.classList.toggle('is-active');
      navMenu.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', isActive ? 'true' : 'false');
      document.body.style.overflow = isActive ? 'hidden' : '';
    };

    navToggle.addEventListener('click', toggleMenu);

    // Cerrar al hacer clic en cualquier enlace del menú móvil
    const navLinks = navMenu.querySelectorAll('.navbar__link, .btn');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (navMenu.classList.contains('is-open')) {
          toggleMenu();
        }
      });
    });

    // Cerrar con la tecla Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('is-open')) {
        toggleMenu();
      }
    });
  }

  // 6. Modal de Donación
  const modalDonar = document.getElementById('modal-donar');
  const openModalBtns = document.querySelectorAll('[data-open-modal="donar"], a[href="#donar"]');
  const closeModalBtns = document.querySelectorAll('[data-close-modal]');

  const openModal = () => {
    if (modalDonar) {
      modalDonar.classList.add('is-open');
      modalDonar.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
  };

  const closeModal = () => {
    if (modalDonar) {
      modalDonar.classList.remove('is-open');
      modalDonar.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  };

  openModalBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal();
    });
  });

  closeModalBtns.forEach(btn => {
    btn.addEventListener('click', closeModal);
  });

  if (modalDonar) {
    modalDonar.addEventListener('click', (e) => {
      if (e.target === modalDonar) {
        closeModal();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalDonar && modalDonar.classList.contains('is-open')) {
      closeModal();
    }
  });

  // Pestañas (Tabs) dentro del Modal
  const tabBtns = document.querySelectorAll('.modal__tab-btn');
  const tabContents = document.querySelectorAll('.modal__tab-content');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');

      tabBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      const content = document.getElementById(`tab-${targetTab}`);
      if (content) {
        content.classList.add('active');
      }
    });
  });

  // Copiar al portapapeles en modal (números de cuenta / celular)
  const copyBtns = document.querySelectorAll('.btn-copy');
  copyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const textToCopy = btn.getAttribute('data-copy');
      if (textToCopy) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          const originalText = btn.innerHTML;
          btn.innerHTML = '✓ ¡Copiado!';
          btn.style.backgroundColor = '#07a5d6';
          btn.style.color = '#ffffff';
          setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.backgroundColor = '';
            btn.style.color = '';
          }, 2000);
        });
      }
    });
  });

  // 7. Carrusel / Slider de Artículos
  const sliderDots = document.querySelectorAll('.slider-dot');
  const sliderPrevBtn = document.querySelector('.slider-btn--prev');
  const sliderNextBtn = document.querySelector('.slider-btn--next');
  let currentSlide = 0;
  const totalSlides = sliderDots.length || 3;

  const updateSlide = (index) => {
    currentSlide = (index + totalSlides) % totalSlides;
    sliderDots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === currentSlide);
    });
  };

  if (sliderPrevBtn) {
    sliderPrevBtn.addEventListener('click', () => {
      updateSlide(currentSlide - 1);
    });
  }

  if (sliderNextBtn) {
    sliderNextBtn.addEventListener('click', () => {
      updateSlide(currentSlide + 1);
    });
  }

  sliderDots.forEach((dot, idx) => {
    dot.addEventListener('click', () => {
      updateSlide(idx);
    });
  });

  // 8. Formulario de Boletín Mensual
  const newsletterForm = document.querySelector('.newsletter__form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = newsletterForm.querySelector('.newsletter__input');
      if (input && input.value.trim() !== '') {
        const btn = newsletterForm.querySelector('.newsletter__btn');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<span>✓ ¡Suscrito!</span>';
        btn.style.backgroundColor = '#0584ab';
        input.value = '';
        setTimeout(() => {
          btn.innerHTML = originalText;
          btn.style.backgroundColor = '';
        }, 3000);
      }
    });
  }

  // 9. Búsqueda Rápida en Footer
  const footerSearchForm = document.querySelector('.footer-search');
  if (footerSearchForm) {
    footerSearchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const searchInput = footerSearchForm.querySelector('.footer-search__input');
      const term = searchInput ? searchInput.value.trim().toLowerCase() : '';
      if (!term) return;

      if (term.includes('don') || term.includes('apoy')) {
        openModal();
      } else if (term.includes('congres') || term.includes('whc') || term.includes('humanis')) {
        const el = document.getElementById('congreso');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      } else if (term.includes('principi') || term.includes('laic') || term.includes('cienc')) {
        const el = document.getElementById('principios');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      } else if (term.includes('comun') || term.includes('nosotr') || term.includes('socied')) {
        const el = document.getElementById('sobre-nosotros');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      } else {
        const el = document.getElementById('noticias');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // 10. Enlace de Navegación Activo según Scroll (IntersectionObserver)
  const sections = document.querySelectorAll('section[id], header[id]');
  const navAnchorLinks = document.querySelectorAll('.navbar__link');

  if ('IntersectionObserver' in window && sections.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navAnchorLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === `#${id}` || (id === 'inicio' && href === 'index.html')) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    }, {
      rootMargin: '-20% 0px -70% 0px'
    });

    sections.forEach(sec => observer.observe(sec));
  }
});
