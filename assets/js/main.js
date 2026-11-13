/**
 * APERAT - Script Principal (JavaScript Vanilla Moderno)
 * Funcionalidades: Barra de progreso de lectura, Scroll Reveal animado,
 * contador numérico interactivo, Header sticky dinámico, Modal de donación con pestañas,
 * carrusel de artículos, scroll suave y botón volver arriba.
 */

// Intervalo entre fotografías del hero, en milisegundos (8000 = 8 segundos).
const HERO_SLIDE_INTERVAL_MS = 8000;

document.addEventListener('DOMContentLoaded', () => {
  const isEn = document.documentElement.lang === 'en';
  const mainScript = document.querySelector('script[src*="assets/js/main.js"]');
  const siteRoot = mainScript ? new URL('../../', mainScript.src).pathname.replace(/\/?$/, '/') : '/';
  const assetPrefix = siteRoot;
  const englishRoot = `${siteRoot}en/`;
  const englishArticleUrl = slug => `${englishRoot}articles/${slug}/`;
  const spanishArticleUrl = slug => `${siteRoot}articulos/${slug}/`;
  const isHomePage = Boolean(document.querySelector('.hero#inicio'));
  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const scrollLocks = new Set();
  const focusableSelector = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])'
  ].join(',');

  const setScrollLock = (key, shouldLock) => {
    if (shouldLock) {
      scrollLocks.add(key);
    } else {
      scrollLocks.delete(key);
    }
    const isLocked = scrollLocks.size > 0;
    document.documentElement.classList.toggle('scroll-locked', isLocked);
    document.body.classList.toggle('scroll-locked', isLocked);
  };

  const getFocusableElements = (container) => Array.from(
    container.querySelectorAll(focusableSelector)
  ).filter(element => element.tabIndex >= 0 && element.getClientRects().length > 0 && getComputedStyle(element).visibility !== 'hidden');

  const addMediaQueryListener = (query, listener) => {
    if (typeof query.addEventListener === 'function') {
      query.addEventListener('change', listener);
    } else {
      query.addListener(listener);
    }
  };

  const trapFocus = (event, container) => {
    if (event.key !== 'Tab') return;
    const focusableElements = getFocusableElements(container);
    if (focusableElements.length === 0) {
      event.preventDefault();
      return;
    }

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    } else if (!container.contains(document.activeElement)) {
      event.preventDefault();
      firstElement.focus();
    }
  };

  const scrollToElement = (element) => {
    if (!element) return;
    element.scrollIntoView({ behavior: motionPreference.matches ? 'auto' : 'smooth', block: 'start' });
    if (!element.hasAttribute('tabindex')) element.setAttribute('tabindex', '-1');
    element.focus({ preventScroll: true });
  };

  const focusWhenVisible = (element, remainingAttempts = 20) => {
    if (!element || !element.isConnected) return;
    if (element.getClientRects().length > 0 && getComputedStyle(element).visibility === 'visible') {
      const focusScope = element.closest('[role="dialog"], .navbar__menu');
      if (focusScope && focusScope.contains(document.activeElement)) return;
      element.focus({ preventScroll: true });
    } else if (remainingAttempts > 0) {
      setTimeout(() => focusWhenVisible(element, remainingAttempts - 1), 25);
    }
  };

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

  let scrollFrame = null;
  const requestScrollUpdate = () => {
    if (scrollFrame !== null) return;
    scrollFrame = requestAnimationFrame(() => {
      scrollFrame = null;
      handleScroll();
    });
  };

  window.addEventListener('scroll', requestScrollUpdate, { passive: true });
  requestScrollUpdate();

  // 1b. Carrusel automático de fondos del hero, sin controles
  document.querySelectorAll('[data-hero-slideshow]').forEach(slideshow => {
    const slides = Array.from(slideshow.querySelectorAll('.hero-slideshow__slide'));
    const imageBases = (slideshow.dataset.heroImages || '').split(',').filter(Boolean);
    if (slides.length < 2) return;

    let currentSlide = Math.max(0, slides.findIndex(slide => slide.classList.contains('is-active')));
    let autoplayTimer = null;
    let isInView = !('IntersectionObserver' in window);

    const stopAutoplay = () => {
      clearInterval(autoplayTimer);
      autoplayTimer = null;
    };

    const getSlideImageUrl = index => {
      const base = imageBases[index];
      if (!base) return '';
      if (window.innerWidth <= 960) return `${base}-960.webp`;
      if (window.innerWidth >= 1600) return `${base}.webp`;
      return `${base}-1440.webp`;
    };

    const showSlide = index => {
      const nextSlide = (index + slides.length) % slides.length;
      const imageUrl = getSlideImageUrl(nextSlide);
      const applySlide = () => {
        if (imageUrl) slides[nextSlide].style.backgroundImage = `url("${imageUrl}")`;
        slides[currentSlide].classList.remove('is-active');
        currentSlide = nextSlide;
        slides[currentSlide].classList.add('is-active');
      };

      if (!imageUrl || slides[nextSlide].style.backgroundImage) {
        applySlide();
        return;
      }

      const image = new Image();
      image.decoding = 'async';
      image.onload = applySlide;
      image.onerror = applySlide;
      image.src = imageUrl;
    };

    const restartAutoplay = () => {
      stopAutoplay();
      if (motionPreference.matches || document.hidden || !isInView) return;

      autoplayTimer = setInterval(() => {
        showSlide(currentSlide + 1);
      }, HERO_SLIDE_INTERVAL_MS);
    };

    if ('IntersectionObserver' in window) {
      const slideshowObserver = new IntersectionObserver(entries => {
        isInView = entries[0].isIntersecting;
        restartAutoplay();
      });
      slideshowObserver.observe(slideshow);
    }

    document.addEventListener('visibilitychange', restartAutoplay);
    addMediaQueryListener(motionPreference, restartAutoplay);
    restartAutoplay();
  });

  // 2. Botón volver arriba (Scroll to top)
  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: motionPreference.matches ? 'auto' : 'smooth'
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
      if (motionPreference.matches) {
        el.textContent = target;
        return;
      }

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

  // 5. Menú móvil accesible
  const navToggle = document.querySelector('.navbar__toggle');
  const navMenu = document.querySelector('.navbar__menu');

  if (navToggle && navMenu) {
    const mobileNavigation = window.matchMedia('(max-width: 1200px)');
    const menuLabels = {
      open: isEn ? 'Open navigation menu' : 'Abrir menú de navegación',
      close: isEn ? 'Close navigation menu' : 'Cerrar menú de navegación'
    };

    const closeMenu = (restoreFocus = false) => {
      const wasOpen = navMenu.classList.contains('is-open');
      navToggle.classList.remove('is-active');
      navMenu.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.setAttribute('aria-label', menuLabels.open);
      setScrollLock('navigation', false);
      navMenu.inert = mobileNavigation.matches;
      if (restoreFocus && wasOpen) navToggle.focus();
    };

    const openMenu = () => {
      navMenu.inert = false;
      navToggle.classList.add('is-active');
      navMenu.classList.add('is-open');
      navToggle.setAttribute('aria-expanded', 'true');
      navToggle.setAttribute('aria-label', menuLabels.close);
      setScrollLock('navigation', true);
      const firstLink = navMenu.querySelector('.navbar__link');
      focusWhenVisible(firstLink);
    };

    const syncMenuToViewport = () => {
      closeMenu();
      navMenu.inert = mobileNavigation.matches;
    };

    navToggle.addEventListener('click', () => {
      if (navMenu.classList.contains('is-open')) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        if (mobileNavigation.matches) closeMenu();
      });
    });

    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && navMenu.classList.contains('is-open')) {
        event.preventDefault();
        closeMenu(true);
      }
    });

    document.addEventListener('click', event => {
      if (navMenu.classList.contains('is-open') && !event.target.closest('.site-header')) {
        closeMenu();
      }
    });

    addMediaQueryListener(mobileNavigation, syncMenuToViewport);
    syncMenuToViewport();
  }

  // 6. Modal de Donación
  const modalDonar = document.getElementById('modal-donar');
  const openModalBtns = document.querySelectorAll('[data-open-modal="donar"], a[href="#donar"]');
  const closeModalBtns = document.querySelectorAll('[data-close-modal]');
  let donationTrigger = null;

  const openModal = (trigger = document.activeElement) => {
    if (!modalDonar) return;
    donationTrigger = trigger instanceof HTMLElement ? trigger : null;
    modalDonar.inert = false;
    modalDonar.classList.add('is-open');
    modalDonar.setAttribute('aria-hidden', 'false');
    setScrollLock('donation', true);
    const closeButton = modalDonar.querySelector('.modal__close');
    focusWhenVisible(closeButton);
  };

  const closeModal = () => {
    if (!modalDonar || !modalDonar.classList.contains('is-open')) return;
    modalDonar.classList.remove('is-open');
    modalDonar.setAttribute('aria-hidden', 'true');
    modalDonar.inert = true;
    setScrollLock('donation', false);
    const triggerIsAvailable = donationTrigger && donationTrigger.isConnected
      && donationTrigger.getClientRects().length > 0 && !donationTrigger.closest('[inert]');
    const focusTarget = triggerIsAvailable ? donationTrigger : navToggle;
    if (focusTarget && focusTarget.isConnected) focusTarget.focus();
    donationTrigger = null;
  };

  openModalBtns.forEach(btn => {
    btn.addEventListener('click', event => {
      event.preventDefault();
      openModal(btn);
    });
    if (btn.getAttribute('role') === 'button') {
      btn.addEventListener('keydown', event => {
        if (event.key === ' ') {
          event.preventDefault();
          openModal(btn);
        }
      });
    }
  });

  closeModalBtns.forEach(btn => btn.addEventListener('click', closeModal));

  if (modalDonar) {
    modalDonar.addEventListener('click', event => {
      if (event.target === modalDonar) closeModal();
    });

    document.addEventListener('keydown', event => {
      if (!modalDonar.classList.contains('is-open')) return;
      if (event.key === 'Escape') {
        event.preventDefault();
        closeModal();
      } else {
        trapFocus(event, modalDonar);
      }
    });
  }

  // Pestañas con semántica y navegación por teclado
  const tabBtns = Array.from(document.querySelectorAll('.modal__tab-btn'));
  const activateTab = (selectedTab, moveFocus = false) => {
    tabBtns.forEach(tab => {
      const isSelected = tab === selectedTab;
      const panel = document.getElementById(`tab-${tab.dataset.tab}`);
      tab.classList.toggle('active', isSelected);
      tab.setAttribute('aria-selected', String(isSelected));
      tab.tabIndex = isSelected ? 0 : -1;
      if (panel) {
        panel.classList.toggle('active', isSelected);
        panel.hidden = !isSelected;
      }
    });
    if (moveFocus) selectedTab.focus();
  };

  tabBtns.forEach((tab, index) => {
    const targetTab = tab.dataset.tab;
    const panel = document.getElementById(`tab-${targetTab}`);
    tab.id = `tab-btn-${targetTab}`;
    tab.setAttribute('aria-controls', `tab-${targetTab}`);
    if (panel) {
      panel.setAttribute('aria-labelledby', tab.id);
      panel.tabIndex = 0;
    }
    tab.addEventListener('click', () => activateTab(tab));
    tab.addEventListener('keydown', event => {
      let nextIndex = null;
      if (event.key === 'ArrowRight') nextIndex = (index + 1) % tabBtns.length;
      if (event.key === 'ArrowLeft') nextIndex = (index - 1 + tabBtns.length) % tabBtns.length;
      if (event.key === 'Home') nextIndex = 0;
      if (event.key === 'End') nextIndex = tabBtns.length - 1;
      if (nextIndex !== null) {
        event.preventDefault();
        activateTab(tabBtns[nextIndex], true);
      }
    });
    if (tab.classList.contains('active')) activateTab(tab);
  });

  // Copiar datos de donación con alternativa y estado accesible
  const copyWithFallback = (text) => {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.className = 'sr-only';
    document.body.appendChild(textarea);
    textarea.select();
    const copied = document.execCommand('copy');
    textarea.remove();
    if (!copied) throw new Error('Clipboard unavailable');
  };

  document.querySelectorAll('.btn-copy').forEach(btn => {
    const originalText = btn.textContent;
    btn.addEventListener('click', async () => {
      const textToCopy = btn.getAttribute('data-copy');
      if (!textToCopy) return;
      const status = modalDonar ? modalDonar.querySelector('.modal__copy-status') : null;
      clearTimeout(btn.copyResetTimer);
      btn.classList.remove('is-error');

      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(textToCopy);
        } else {
          copyWithFallback(textToCopy);
        }
        btn.textContent = isEn ? 'Copied!' : '¡Copiado!';
        if (status) status.textContent = isEn ? 'Number copied to clipboard.' : 'Número copiado al portapapeles.';
      } catch (error) {
        try {
          copyWithFallback(textToCopy);
          btn.textContent = isEn ? 'Copied!' : '¡Copiado!';
          if (status) status.textContent = isEn ? 'Number copied to clipboard.' : 'Número copiado al portapapeles.';
        } catch (fallbackError) {
          btn.textContent = isEn ? 'Copy failed' : 'No se pudo copiar';
          btn.classList.add('is-error');
          if (status) status.textContent = isEn ? `Copy failed. Select the number manually: ${textToCopy}` : `No se pudo copiar. Selecciona el número manualmente: ${textToCopy}`;
        }
      }

      btn.copyResetTimer = setTimeout(() => {
        btn.textContent = originalText;
        btn.classList.remove('is-error');
        if (status) status.textContent = '';
      }, 2500);
    });
  });

  if (modalDonar) {
    const copyStatus = document.createElement('p');
    copyStatus.className = 'modal__copy-status sr-only';
    copyStatus.setAttribute('role', 'status');
    copyStatus.setAttribute('aria-live', 'polite');
    modalDonar.querySelector('.modal__body').appendChild(copyStatus);
  }

  // 7. Carrusel / Paginación de Artículos
  const articlesData = [
    {
      id: 'exoneracion-curso-religion-peru',
      title: '¿Se puede exonerar a un estudiante del curso de religión en el Perú?',
      excerpt: 'En el Perú, los estudiantes y sus familias tienen derecho legal a exonerarse del curso de Educación Religiosa por motivos de conciencia. Conoce la normativa y los pasos para el trámite.',
      category: 'Educación y libertad de conciencia',
      badge: 'Educación',
      image: assetPrefix + 'assets/img/articles/exoneracion-curso-religion-peru.webp',
      imageAlt: 'Estudiantes en el aula escolar peruana',
      url: spanishArticleUrl('exoneracion-curso-religion-peru'),
      date: '2026-11-07',
      dateLabel: '7 nov. 2026'
    },
    {
      id: 'ceremonias-humanistas',
      title: 'Ceremonias humanistas: cómo celebrar los momentos importantes de la vida sin una ceremonia religiosa',
      excerpt: 'Una alternativa laica y personalizada para bodas, funerales y momentos trascendentales, centrada en las personas, sus historias y los vínculos que las unen.',
      category: 'Sociedad y humanismo',
      badge: 'Ceremonias',
      image: assetPrefix + 'assets/img/articles/ceremonia-1600x1000.webp',
      imageAlt: 'Ceremonia humanista en el Perú',
      url: spanishArticleUrl('ceremonias-humanistas'),
      date: '2026-11-06',
      dateLabel: '6 nov. 2026'
    },
    {
      id: 'estado-laico-peru',
      title: 'El Estado laico: una condición para la libertad y la democracia en el Perú',
      excerpt: 'Por qué la separación entre el poder político y las instituciones religiosas sigue siendo una tarea pendiente de nuestra República para garantizar la igualdad y los derechos de todos.',
      category: 'Democracia y laicidad',
      badge: 'Estado Laico',
      image: assetPrefix + 'assets/img/articles/articulo_marcha_laica.webp',
      imageAlt: 'Marcha en Lima por la defensa del Estado Laico',
      url: spanishArticleUrl('estado-laico-peru'),
      date: '2026-11-05',
      dateLabel: '5 nov. 2026'
    },
    {
      id: 'humanismo-laico',
      title: 'Humanismo laico: una forma de vivir con razón, libertad y humanidad',
      excerpt: 'Una visión del mundo que encuentra en la capacidad humana de pensar, cuidar y construir un futuro compartido las bases de una vida con sentido y ética.',
      category: 'Sociedad y humanismo',
      badge: 'Humanismo',
      image: assetPrefix + 'assets/img/articles/articulo_humanismo_asamblea.webp',
      imageAlt: 'Asamblea de la comunidad de APERAT y Humanists International en Lima',
      url: spanishArticleUrl('humanismo-laico'),
      date: '2026-11-04',
      dateLabel: '4 nov. 2026'
    },
    {
      id: 'por-que-no-creo-en-dios',
      title: '¿Por qué no creo en Dios? Una mirada racional al ateísmo y la ausencia de evidencia',
      excerpt: 'No creer en Dios no exige tener una explicación para cada misterio del universo: exige no aceptar como verdadero aquello para lo que no encontramos razones suficientes.',
      category: 'Razón y filosofía',
      badge: 'Ateísmo',
      image: assetPrefix + 'assets/img/articles/russell.webp',
      imageAlt: 'Bertrand Russell, filósofo y matemático humanista',
      url: spanishArticleUrl('por-que-no-creo-en-dios'),
      date: '2026-11-03',
      dateLabel: '3 nov. 2026'
    }
  ];

  const articlesDataEn = [
    {
      id: 'exoneracion-curso-religion-peru',
      title: 'Can a Student Be Exempted from Religious Education in Peru?',
      excerpt: 'In Peru, students and their families have the legal right to be exempted from religious education courses on grounds of conscience. Learn about the legislation and how to apply.',
      category: 'Education & Freedom of Conscience',
      badge: 'Education',
      image: assetPrefix + 'assets/img/articles/exoneracion-curso-religion-peru.webp',
      imageAlt: 'Students in a Peruvian classroom',
      url: englishArticleUrl('exemption-religious-education-peru'),
      date: '2026-11-07',
      dateLabel: 'Nov 7, 2026'
    },
    {
      id: 'ceremonias-humanistas',
      title: 'Humanist Ceremonies: Celebrating Meaningful Life Milestones Without Religion',
      excerpt: 'A secular, personalized alternative for weddings, memorials, and significant milestones, centered on people, their stories, and their shared bonds.',
      category: 'Society & Humanism',
      badge: 'Ceremonies',
      image: assetPrefix + 'assets/img/articles/ceremonia-1600x1000.webp',
      imageAlt: 'Humanist ceremony in Peru',
      url: englishArticleUrl('humanist-ceremonies'),
      date: '2026-11-06',
      dateLabel: 'Nov 6, 2026'
    },
    {
      id: 'estado-laico-peru',
      title: 'The Secular State: A Requirement for Freedom and Democracy in Peru',
      excerpt: 'Why the separation between political power and religious institutions remains an essential, unfinished task in Peru to guarantee equality and rights for all.',
      category: 'Democracy & Secularism',
      badge: 'Secular State',
      image: assetPrefix + 'assets/img/articles/articulo_marcha_laica.webp',
      imageAlt: 'March in Lima defending state secularism',
      url: englishArticleUrl('secular-state-peru'),
      date: '2026-11-05',
      dateLabel: 'Nov 5, 2026'
    },
    {
      id: 'humanismo-laico',
      title: 'Secular Humanism: A Way of Living with Reason, Freedom, and Compassion',
      excerpt: 'A worldview rooted in the human capacity to think, care, and build a shared future as the foundation of an ethical and meaningful life.',
      category: 'Society & Humanism',
      badge: 'Humanism',
      image: assetPrefix + 'assets/img/articles/articulo_humanismo_asamblea.webp',
      imageAlt: 'Assembly of the APERAT community and Humanists International in Lima',
      url: englishArticleUrl('secular-humanism'),
      date: '2026-11-04',
      dateLabel: 'Nov 4, 2026'
    },
    {
      id: 'por-que-no-creo-en-dios',
      title: 'Why I Do Not Believe in God: A Rational Perspective on Atheism and Evidence',
      excerpt: 'Not believing in God does not require having an answer for every mystery in the cosmos: it simply requires not accepting as true that which lacks sufficient evidence.',
      category: 'Reason & Philosophy',
      badge: 'Atheism',
      image: assetPrefix + 'assets/img/articles/russell.webp',
      imageAlt: 'Bertrand Russell, humanist philosopher and mathematician',
      url: englishArticleUrl('why-i-do-not-believe-in-god'),
      date: '2026-11-03',
      dateLabel: 'Nov 3, 2026'
    }
  ];

  const currentArticles = isEn ? articlesDataEn : articlesData;
  currentArticles.sort((a, b) => new Date(b.date) - new Date(a.date));

  const articlesGrid = document.getElementById('articles-grid');
  const sliderDotsContainer = document.getElementById('articles-slider-dots');
  const sliderPrevBtn = document.querySelector('.slider-btn--prev');
  const sliderNextBtn = document.querySelector('.slider-btn--next');
  const articlesSliderTrack = document.getElementById('articles-slider-track');

  if (articlesGrid && sliderDotsContainer) {
    const ITEMS_PER_PAGE = 3;
    const totalPages = Math.ceil(currentArticles.length / ITEMS_PER_PAGE);
    let currentPage = 0;
    let renderTimer = null;
    const pageStatus = document.createElement('p');
    pageStatus.className = 'sr-only';
    pageStatus.setAttribute('role', 'status');
    pageStatus.setAttribute('aria-live', 'polite');
    const sliderControls = document.querySelector('.slider-controls');
    if (sliderControls) sliderControls.appendChild(pageStatus);
    if (articlesSliderTrack) {
      articlesSliderTrack.setAttribute('role', 'region');
      articlesSliderTrack.setAttribute('aria-roledescription', 'carousel');
      articlesSliderTrack.setAttribute('aria-label', isEn ? 'APERAT articles' : 'Artículos de APERAT');
    }

    // Generar los dots de paginación dinámicamente
    sliderDotsContainer.innerHTML = '';
    for (let i = 0; i < totalPages; i++) {
      const dot = document.createElement('button');
      dot.className = `slider-dot${i === 0 ? ' active' : ''}`;
      dot.setAttribute('aria-label', isEn ? `News page ${i + 1} of ${totalPages}` : `Página ${i + 1} de ${totalPages} de noticias`);
      dot.setAttribute('aria-controls', 'articles-grid');
      dot.tabIndex = i === 0 ? 0 : -1;
      if (i === 0) dot.setAttribute('aria-current', 'true');
      dot.addEventListener('click', () => renderArticlesPage(i, true));
      dot.addEventListener('keydown', event => {
        let targetPage = null;
        if (event.key === 'ArrowRight') targetPage = (i + 1) % totalPages;
        if (event.key === 'ArrowLeft') targetPage = (i - 1 + totalPages) % totalPages;
        if (event.key === 'Home') targetPage = 0;
        if (event.key === 'End') targetPage = totalPages - 1;
        if (targetPage !== null) {
          event.preventDefault();
          renderArticlesPage(targetPage, true);
          sliderDotsContainer.children[targetPage].focus();
        }
      });
      sliderDotsContainer.appendChild(dot);
    }

    const renderArticlesPage = (pageIndex, announce = false) => {
      currentPage = (pageIndex + totalPages) % totalPages;
      clearTimeout(renderTimer);


      // Actualizar dots
      const dots = sliderDotsContainer.querySelectorAll('.slider-dot');
      dots.forEach((dot, idx) => {
        const isActive = idx === currentPage;
        dot.classList.toggle('active', isActive);
        dot.tabIndex = isActive ? 0 : -1;
        if (isActive) {
          dot.setAttribute('aria-current', 'true');
        } else {
          dot.removeAttribute('aria-current');
        }
      });

      if (!motionPreference.matches) articlesGrid.classList.add('is-fading');

      renderTimer = setTimeout(() => {
        const start = currentPage * ITEMS_PER_PAGE;
        const pageArticles = currentArticles.slice(start, start + ITEMS_PER_PAGE);

        articlesGrid.innerHTML = pageArticles.map((art, idx) => `
          <article class="article-card is-revealed" data-reveal data-reveal-delay="${(idx + 1) * 100}">
            <div class="article-card__media">
              <a href="${art.url}" tabindex="-1" aria-hidden="true">
                <img src="${art.image}" alt="${art.imageAlt}" class="article-card__image" loading="lazy" width="1200" height="675">
              </a>
              <span class="article-card__badge-tag">${art.badge}</span>
            </div>
            <div class="article-card__body">
              <div class="article-card__meta">
                <span class="article-card__meta-tag">${art.category}</span>
                <time class="article-card__meta-date" datetime="${art.date}">${art.dateLabel}</time>
              </div>
              <h3 class="article-card__title">
                <a href="${art.url}">${art.title}</a>
              </h3>
              <p class="article-card__excerpt">${art.excerpt}</p>
              <div class="article-card__footer">
                <a href="${art.url}" class="article-card__action">
                  <span>${isEn ? 'Read article' : 'Leer artículo'}</span>
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M5 13h11.86l-5.43 5.43 1.42 1.42L21.14 12l-8.29-8.29-1.42 1.42L16.86 11H5v2z" />
                  </svg>
                </a>
              </div>
            </div>
          </article>
        `).join('');

        articlesGrid.classList.remove('is-fading');
        if (announce) {
          pageStatus.textContent = isEn
            ? `Showing articles page ${currentPage + 1} of ${totalPages}.`
            : `Mostrando la página ${currentPage + 1} de ${totalPages} de artículos.`;
        }
      }, motionPreference.matches ? 0 : 140);
    };

    if (sliderPrevBtn) {
      sliderPrevBtn.addEventListener('click', () => {
        renderArticlesPage(currentPage - 1, true);
      });
    }

    if (sliderNextBtn) {
      sliderNextBtn.addEventListener('click', () => {
        renderArticlesPage(currentPage + 1, true);
      });
    }

    // Render inicial
    renderArticlesPage(0);
  }

  // 8. Formulario de Registro de Simpatizantes
  const newsletterForm = document.querySelector('.newsletter__form');
  if (newsletterForm) {
    const input = newsletterForm.querySelector('.newsletter__input');
    const btn = newsletterForm.querySelector('.newsletter__btn');
    const progressContainer = document.getElementById('newsletter-progress');
    const progressBar = document.getElementById('newsletter-progress-bar');
    const progressStatus = document.getElementById('newsletter-progress-status');
    const progressVal = document.getElementById('newsletter-progress-val');
    const feedbackEl = document.getElementById('newsletter-feedback');
    const progressTrack = newsletterForm.querySelector('.newsletter__progress-track');
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    const messages = {
      sending: isEn ? 'Sending…' : 'Enviando…',
      connecting: isEn ? 'Connecting to the server…' : 'Conectando con el servidor…',
      registering: isEn ? 'Registering your support…' : 'Enviando registro de simpatizante…',
      confirming: isEn ? 'Confirming your registration…' : 'Confirmando en el sistema…',
      complete: isEn ? 'Registration complete!' : '¡Registro completado!',
      joined: isEn ? 'Joined!' : '¡Registrado!',
      retry: isEn ? 'Try again' : 'Reintentar',
      error: isEn ? 'Could not send' : 'Error al enviar',
      successTitle: isEn ? 'Registration completed successfully!' : '¡Registro completado con éxito!',
      successText: isEn ? 'You have joined as an APERAT supporter. You will receive invitations to our public events, talks, and community activities.' : 'Te has sumado como simpatizante de APERAT. Recibirás en tu correo las invitaciones a nuestros eventos y actividades gratuitas.',
      errorTitle: isEn ? 'We could not complete your registration' : 'No se pudo completar el registro',
      errorText: isEn ? 'The server could not be reached. Check your connection and try again, or email contacto@aperat.org.pe.' : 'No pudimos conectar con el servidor. Verifica tu conexión e inténtalo nuevamente, o escribe a contacto@aperat.org.pe.'
    };
    let buttonResetTimer = null;
    let feedbackHideTimer = null;
    const originalButtonHTML = btn ? btn.innerHTML : '';

    if (progressTrack) {
      progressTrack.setAttribute('role', 'progressbar');
      progressTrack.setAttribute('aria-valuemin', '0');
      progressTrack.setAttribute('aria-valuemax', '100');
      progressTrack.setAttribute('aria-valuenow', '0');
      progressTrack.setAttribute('aria-label', isEn ? 'Registration progress' : 'Progreso del registro');
    }

    const setProgress = (value, message) => {
      if (progressBar) progressBar.style.width = `${value}%`;
      if (progressStatus) progressStatus.textContent = message;
      if (progressVal) progressVal.textContent = `${value}%`;
      if (progressTrack) progressTrack.setAttribute('aria-valuenow', String(value));
      if (progressContainer) {
        progressContainer.classList.add('is-active');
        progressContainer.setAttribute('aria-hidden', 'false');
      }
    };

    const showFeedback = (type) => {
      if (!feedbackEl) return;
      const success = type === 'success';
      feedbackEl.setAttribute('role', success ? 'status' : 'alert');
      feedbackEl.innerHTML = `
        <div class="newsletter__card-feedback newsletter__card-feedback--${type}">
          <div class="newsletter__feedback-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24"><path d="${success ? 'M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z' : 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z'}"/></svg>
          </div>
          <div class="newsletter__feedback-body">
            <div class="newsletter__feedback-title">${success ? messages.successTitle : messages.errorTitle}</div>
            <p class="newsletter__feedback-text">${success ? messages.successText : messages.errorText}</p>
          </div>
        </div>`;
      feedbackEl.classList.add('is-visible');
      clearTimeout(feedbackHideTimer);
      feedbackHideTimer = setTimeout(() => feedbackEl.classList.remove('is-visible'), 12000);
    };

    newsletterForm.addEventListener('submit', async event => {
      event.preventDefault();
      if (!input || !btn || !input.checkValidity()) {
        if (input) input.reportValidity();
        return;
      }

      const email = input.value.trim();
      clearTimeout(buttonResetTimer);
      clearTimeout(feedbackHideTimer);
      if (feedbackEl) {
        feedbackEl.classList.remove('is-visible');
        feedbackEl.innerHTML = '';
      }

      newsletterForm.setAttribute('aria-busy', 'true');
      btn.disabled = true;
      input.readOnly = true;
      btn.innerHTML = `<span class="newsletter__spinner" aria-hidden="true"></span><span>${messages.sending}</span>`;
      setProgress(15, messages.connecting);

      const controller = new AbortController();
      const requestTimeout = setTimeout(() => controller.abort(), 15000);

      try {
        const request = fetch(newsletterForm.action || 'https://smartica.ing/aperat/api/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({ email }),
          signal: controller.signal
        });

        await sleep(motionPreference.matches ? 0 : 180);
        setProgress(45, messages.registering);
        await sleep(motionPreference.matches ? 0 : 220);
        setProgress(75, messages.confirming);

        const response = await request;
        if (!response.ok) throw new Error(`Server responded with ${response.status}`);

        setProgress(100, messages.complete);
        input.value = '';
        btn.innerHTML = `<span>${messages.joined}</span>`;
        showFeedback('success');
        await sleep(motionPreference.matches ? 0 : 300);
      } catch (error) {
        console.error('Supporter registration failed:', error);
        setProgress(100, messages.error);
        btn.innerHTML = `<span>${messages.retry}</span>`;
        showFeedback('error');
      } finally {
        clearTimeout(requestTimeout);
        if (progressContainer) {
          progressContainer.classList.remove('is-active');
          progressContainer.setAttribute('aria-hidden', 'true');
        }
        if (progressTrack) progressTrack.setAttribute('aria-valuenow', '0');
        newsletterForm.setAttribute('aria-busy', 'false');
        btn.disabled = false;
        input.readOnly = false;
        buttonResetTimer = setTimeout(() => {
          btn.innerHTML = originalButtonHTML;
        }, 3500);
      }
    });
  }

  // 9. Modal de Principios
  const principlesData = {
    1: {
      badge: '01 / CIENCIA',
      title: 'Razón y pensamiento crítico',
      image: assetPrefix + 'assets/img/principles/principio_ciencia.webp',
      imageAlt: 'Investigación y método científico como guía del conocimiento',
      body: `<p>En APERAT partimos de una premisa fundamental: el conocimiento confiable sobre el mundo sólo puede construirse mediante la observación, la evidencia y la razón. El método científico —con su énfasis en la comprobación, la revisión por pares y la autocorrección— es la herramienta más poderosa que la humanidad ha desarrollado para comprender la realidad.</p>
      <p>Esto no significa que rechacemos la complejidad de la experiencia humana o las emociones. Significa que, cuando se trata de tomar decisiones colectivas que afectan a todas las personas —en política, salud, educación o justicia— priorizamos la evidencia por encima de la autoridad, la tradición o la fe.</p>
      <p>El pensamiento crítico es también una herramienta de protección ciudadana. APERAT promovió durante más de una década el programa radial <em>Para-Normales de la Noche</em>, donde invitamos a astrólogos, chamanes, numerólogos y otros a demostrar sus capacidades en vivo. Ninguno lo logró.</p>
      <p>Desde 2025, continuamos esta labor con <em>La Señal Humanista</em>, un espacio de reflexión sobre derechos, democracia y convivencia desde una perspectiva racional y humanista.</p>`,
      highlights: [
        'Más de una década de divulgación crítica radial (2010–2024)',
        'Aplicación del escepticismo a pseudociencias y charlatanería',
        'Educación crítica como herramienta de protección ciudadana'
      ]
    },
    2: {
      badge: '02 / CONCIENCIA',
      title: 'Libertad de conciencia',
      image: assetPrefix + 'assets/img/principles/principio_freedom_of_thought.webp',
      imageAlt: 'Libertad intelectual y pensamiento humanista ilustrado',
      body: `<p>La libertad de conciencia es el derecho de toda persona a construir, mantener o cambiar sus propias convicciones —religiosas o de cualquier otro tipo— sin sufrir coerción, discriminación ni represalia.</p>
      <p>En el Perú, este derecho existe en el papel pero no siempre en la práctica. Muchas personas han sido bautizadas antes de poder decidir su afiliación religiosa. Muchos estudiantes son obligados a cursar asignaturas de doctrina sin posibilidad real de exonerarse.</p>
      <p>APERAT trabaja para que esta libertad sea real y ejercible:</p>
      <ul>
        <li>La campaña <strong>Exonérate Perú</strong> ayuda a familias a ejercer su derecho legal a la exoneración de cursos de religión en colegios públicos y privados.</li>
        <li>Desde 2010 brindamos orientación a quienes desean apostatar formalmente de la Iglesia Católica, apoyando a cientos de personas.</li>
        <li>Ofrecemos asesoría legal gratuita a quienes enfrentan discriminación por sus convicciones, como el caso del estudiante de la USAT obligado a cursar materias de doctrina para graduarse.</li>
      </ul>
      <p>Creemos que la libertad de conciencia debe ser una garantía efectiva para todas las personas, independientemente de sus creencias.</p>`,
      highlights: [
        'Campaña Exonérate Perú: apoyo legal gratuito para familias',
        'Orientación para apostasía formal desde 2010',
        'Defensa legal de personas discriminadas por sus convicciones'
      ]
    },
    3: {
      badge: '03 / ESTADO LAICO',
      title: 'Estado laico e igualdad',
      image: assetPrefix + 'assets/img/principles/principio_laicidad.webp',
      imageAlt: 'Campaña Nacional por un Estado Laico en el Perú',
      body: `<p>Un Estado laico no es un Estado antirreligioso. Es un Estado neutral: que no favorece ni discrimina ninguna creencia, que trata a todos sus ciudadanos con igual dignidad independientemente de su cosmovisión.</p>
      <p>El Perú tiene principios constitucionales que apuntan hacia la separación entre el Estado y la Iglesia, pero no utiliza explícitamente la palabra "laico" para definirse. Además, mantiene un Concordato con la Santa Sede que otorga privilegios concretos a la Iglesia Católica.</p>
      <p>APERAT ha trabajado en distintos frentes:</p>
      <ul>
        <li>En 2024 presentamos ante la congresista Susel Paredes una propuesta de reforma constitucional para incluir explícitamente la denominación "Estado laico" en los artículos 43 y 50 de la Constitución.</li>
        <li>Publicamos el <strong>Reporte Laico 2022</strong>, un audit que documenta el gasto público destinado a la Iglesia Católica: sueldos, exenciones y subsidios.</li>
        <li>Produjimos el documental <em>¿Perú es un Estado laico?</em> (2024–2025), con apoyo de Humanists International.</li>
      </ul>
      <p>Para nosotros, la laicidad es una condición necesaria para que todas las personas —religiosas y no religiosas— sean tratadas con igual dignidad ante el Estado.</p>`,
      highlights: [
        'Propuesta de reforma constitucional para reconocer al Perú como Estado laico',
        'Reporte Laico 2022: auditoría del gasto estatal hacia la Iglesia Católica',
        'Documental "¿Perú es un Estado laico?" producido con apoyo de Humanists International'
      ]
    },
    4: {
      badge: '04 / DERECHOS',
      title: 'Derechos humanos universales',
      image: assetPrefix + 'assets/img/principles/principio_derechos.webp?v=2',
      imageAlt: 'Dignidad, igualdad y defensa de los derechos humanos universales',
      body: `<p>Los derechos humanos son universales, indivisibles e inalienables. No dependen de la fe, la etnia, el género o la clase social de cada persona. APERAT defiende este principio tanto en su trabajo interno como en sus alianzas con otras organizaciones.</p>
      <p>Somos parte de la <strong>Mesa de Justicia de Género y Derechos Humanos</strong>, un espacio plural que reúne a organizaciones laicas, feministas y religiosas para coordinar respuestas conjuntas frente a retrocesos legislativos. Esta participación demuestra que la defensa de los derechos humanos no requiere acuerdo teológico.</p>
      <ul>
        <li>Realizamos la <strong>primera ceremonia humanista registrada en el Perú</strong> (2023), a través de Ceremonias Laicas.</li>
        <li>Ofrecemos bodas humanistas con validez legal civil mediante notaría.</li>
        <li>Presentamos recomendaciones al mecanismo de la ONU sobre solidaridad internacional, reclamando que los sistemas de derechos humanos incluyan explícitamente a personas ateas, agnósticas y humanistas.</li>
      </ul>
      <p>Creemos que una sociedad justa es aquella en la que nadie es discriminado por sus creencias —o por su falta de ellas.</p>`,
      highlights: [
        'Miembros de la Mesa de Justicia de Género y Derechos Humanos',
        'Primera ceremonia humanista registrada en el Perú (2023)',
        'Presentación de recomendaciones ante mecanismos de la ONU'
      ]
    }
  };

  const principlesDataEn = {
    1: {
      badge: '01 / SCIENCE',
      title: 'Reason and Critical Thinking',
      image: assetPrefix + 'assets/img/principles/principio_ciencia.webp',
      imageAlt: 'Scientific research and methodology as a guide to knowledge',
      body: `<p>At APERAT, we start from a fundamental premise: reliable knowledge about the world can only be built through observation, evidence, and reason. The scientific method — with its emphasis on empirical verification, peer review, and self-correction — is the most powerful tool humanity has developed to understand reality.</p>
      <p>This does not mean rejecting the depth of human emotions or cultural traditions. It means that when making collective decisions that affect everyone — in public policy, healthcare, education, or justice — evidence must take precedence over dogma, authority, or unverified belief.</p>
      <p>Critical thinking is also an essential civic shield. For over a decade, APERAT hosted the radio program <em>Para-Normales de la Noche</em>, inviting astrologers, shamans, and psychics to demonstrate their claims under controlled conditions. None succeeded.</p>
      <p>Today, we continue this mission through <em>La Señal Humanista</em>, a platform fostering dialogue on civil liberties, democracy, and coexistence from a rational and humanist perspective.</p>`,
      highlights: [
        'Over a decade of science communication and critical inquiry (2010–2024)',
        'Applying scientific skepticism to pseudosciences and charlatanism',
        'Critical thinking education as a vital tool for civic empowerment'
      ]
    },
    2: {
      badge: '02 / CONSCIENCE',
      title: 'Freedom of Conscience',
      image: assetPrefix + 'assets/img/principles/principio_freedom_of_thought.webp',
      imageAlt: 'Intellectual liberty and secular humanist thought',
      body: `<p>Freedom of conscience is the fundamental right of every individual to develop, maintain, or change their beliefs — whether religious, agnostic, humanist, or atheist — without suffering coercion, discrimination, or legal penalties.</p>
      <p>In Peru, this right is formally recognized in constitutional law but often denied in practice. Children are routinely baptized before they can make an informed choice, and school students are frequently coerced into confessional religious education without genuine alternatives.</p>
      <p>APERAT actively works to make this freedom tangible and enforceable:</p>
      <ul>
        <li>The <strong>Exonérate Perú</strong> initiative provides free legal tools helping families exercise their right to exempt students from confessional religion classes.</li>
        <li>Since 2010, we have guided hundreds of citizens through formal apostasy from the Catholic Church to reclaim their personal registry privacy.</li>
        <li>We provide legal aid and public advocacy for non-believers facing discrimination, such as university students forced to complete doctrinal courses to graduate.</li>
      </ul>
      <p>We believe that freedom of conscience must be an effective, universal safeguard for all citizens regardless of their worldview.</p>`,
      highlights: [
        'Exonérate Perú: Free legal defense and toolkits for families',
        'Guidance on formal apostasy and registry removal since 2010',
        'Direct legal assistance for citizens facing discrimination on grounds of belief'
      ]
    },
    3: {
      badge: '03 / SECULAR STATE',
      title: 'Secular State and Equality',
      image: assetPrefix + 'assets/img/principles/principio_laicidad.webp',
      imageAlt: 'National Campaign for a Secular State in Peru',
      body: `<p>A secular state is not an anti-religious state. It is an impartial and neutral state: one that neither privileges nor discriminates against any religious faith or secular philosophy, treating every citizen with equal dignity.</p>
      <p>While Peru’s Constitution mentions religious freedom, it does not explicitly declare the republic secular, and an international agreement (Concordat) with the Holy See continues to grant disproportionate financial and institutional privileges to the Catholic Church.</p>
      <p>APERAT works on multiple fronts to advance secularism:</p>
      <ul>
        <li>In 2024, we presented a constitutional reform bill through Member of Congress Susel Paredes to explicitly designate Peru as a "Secular State" in Articles 43 and 50 of the Constitution.</li>
        <li>We published the <strong>Secular Report 2022</strong>, an unprecedented audit documenting public funds allocated to Catholic clerical salaries, tax exemptions, and subsidies.</li>
        <li>We produced the documentary <em>"Is Peru a Secular State?"</em> (2024–2025) with the support of Humanists International.</li>
      </ul>
      <p>For us, state secularism is an indispensable precondition for genuine democracy and the equal treatment of all citizens.</p>`,
      highlights: [
        'Constitutional reform proposal to officially define Peru as a Secular State',
        'Secular Report 2022: Public spending audit on church funding and subsidies',
        'Documentary "Is Peru a Secular State?" supported by Humanists International'
      ]
    },
    4: {
      badge: '04 / HUMAN RIGHTS',
      title: 'Universal Human Rights',
      image: assetPrefix + 'assets/img/principles/principio_derechos.webp?v=2',
      imageAlt: 'Dignity, equality, and defense of universal human rights',
      body: `<p>Human rights are universal, inalienable, and indivisible. They do not depend on faith, gender, sexual orientation, ethnicity, or social class. APERAT defends this principle in its daily advocacy and in strategic coalitions.</p>
      <p>We are active members of the <strong>Roundtable for Gender Justice and Human Rights (Mesa de Justicia de Género y Derechos Humanos)</strong>, a plural civil society coalition uniting secular, feminist, and faith-based groups to resist regressive legislative agendas in Peru. This proves that defending human rights does not require theological alignment.</p>
      <ul>
        <li>We conducted the <strong>first recorded humanist ceremony in Peru</strong> (2023) through Ceremonias Laicas.</li>
        <li>We offer humanist weddings with civil legal validity through partner notaries.</li>
        <li>We submit periodic recommendations to United Nations human rights mechanisms on international solidarity, ensuring non-religious and humanist citizens are recognized.</li>
      </ul>
      <p>We believe a truly just society is one where no one is marginalized for what they believe — or for what they do not believe.</p>`,
      highlights: [
        'Active member of the Roundtable for Gender Justice and Human Rights',
        'Pioneered the first recognized humanist ceremonies and weddings in Peru',
        'Direct reporting and recommendations to UN Human Rights mechanisms'
      ]
    }
  };

  const principlesModal = document.getElementById('principles-modal');
  const principlesModalContent = document.getElementById('principles-modal-content');
  const principlesModalClose = document.getElementById('principles-modal-close');
  const principlesModalOverlay = document.getElementById('principles-modal-overlay');
  let principleTrigger = null;

  function openPrincipleModal(id, trigger) {
    const activePrinciples = isEn ? principlesDataEn : principlesData;
    const data = activePrinciples[id];
    if (!data || !principlesModal) return;
    principleTrigger = trigger instanceof HTMLElement ? trigger : null;

    principlesModalContent.innerHTML = `
      <div class="pmodal__hero">
        <img src="${data.image}" alt="${data.imageAlt}" class="pmodal__hero-img" loading="lazy">
        <div class="pmodal__hero-overlay"></div>
        <span class="pmodal__hero-badge">${data.badge}</span>
        <h2 class="pmodal__hero-title" id="principles-modal-title">${data.title}</h2>
      </div>
      <div class="pmodal__body">
        ${data.body}
        <div class="pmodal__highlights">
          <div class="pmodal__highlights-title">${isEn ? 'Key Points & Milestones' : 'Puntos clave'}</div>
          ${data.highlights.map(h => `<div class="pmodal__highlight-item">${h}</div>`).join('')}
        </div>
      </div>
    `;

    principlesModal.removeAttribute('hidden');
    principlesModalContent.scrollTop = 0;
    setScrollLock('principles', true);
    focusWhenVisible(principlesModalClose);
  }

  function closePrincipleModal() {
    if (!principlesModal || principlesModal.hasAttribute('hidden')) return;
    principlesModal.setAttribute('hidden', '');
    setScrollLock('principles', false);
    if (principleTrigger && principleTrigger.isConnected) principleTrigger.focus();
    principleTrigger = null;
  }

  if (principlesModal) {
    document.querySelectorAll('.principle-item__btn').forEach(btn => {
      btn.addEventListener('click', () => {
        openPrincipleModal(parseInt(btn.dataset.principle, 10), btn);
      });
    });

    principlesModalClose.addEventListener('click', closePrincipleModal);
    principlesModalOverlay.addEventListener('click', closePrincipleModal);

    principlesModal.addEventListener('keydown', event => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closePrincipleModal();
      } else {
        trapFocus(event, principlesModal);
      }
    });
  }

  // 10. Acordeón de logros — Sección Sobre Nosotros
  document.querySelectorAll('.community__acc-trigger').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const panelId = trigger.getAttribute('aria-controls');
      const panel = document.getElementById(panelId);
      const isExpanded = trigger.getAttribute('aria-expanded') === 'true';

      // Cerrar todos los demás
      document.querySelectorAll('.community__acc-trigger').forEach(t => {
        if (t !== trigger) {
          t.setAttribute('aria-expanded', 'false');
          const p = document.getElementById(t.getAttribute('aria-controls'));
          if (p) p.setAttribute('hidden', '');
        }
      });

      // Toggle el actual
      trigger.setAttribute('aria-expanded', String(!isExpanded));
      if (isExpanded) {
        panel.setAttribute('hidden', '');
      } else {
        panel.removeAttribute('hidden');
      }
    });
  });

  // 10b. Slider de Galería de la Comunidad (8 Fotos con Efecto Fade & Ken Burns)
  const communitySlider = document.getElementById('community-slider');
  if (communitySlider) {
    const slides = communitySlider.querySelectorAll('.community__slide');
    const dots = communitySlider.querySelectorAll('.community__slider-dot');
    const prevBtn = communitySlider.querySelector('.community__slider-btn--prev');
    const nextBtn = communitySlider.querySelector('.community__slider-btn--next');
    const counterCurrent = communitySlider.querySelector('.community__slider-current');
    const cardTitle = communitySlider.querySelector('.community__card-title');
    const cardText = communitySlider.querySelector('.community__card-text');

    const captionsEs = [
      { title: 'Comunidad activa', text: 'Personas que comparten razón, libertad de conciencia y valores humanistas en Lima.' },
      { title: 'Comunidad activa', text: 'Espacios de diálogo, integración y apoyo mutuo para librepensadores y humanistas.' },
      { title: 'Activismo laico', text: 'Presencia pública y movilización pacífica en defensa de las libertades civiles y la laicidad.' },
      { title: 'Incidencia ciudadana', text: 'Acciones de vigilancia y participación ciudadana por la neutralidad del Estado y los derechos humanos.' },
      { title: 'Incidencia ciudadana', text: 'Pronunciamientos y campañas activas para garantizar la igualdad ante la ley sin discriminación religiosa.' },
      { title: 'Comunidad diversa y abierta', text: 'Más de 17 años sumando voces diversas unidas por la razón y la empatía.' },
      { title: 'Acción y voluntariado', text: 'Iniciativas ciudadanas para garantizar igualdad y educación laica en el país.' },
      { title: 'Incidencia en el Estado', text: 'Reunión de trabajo en el Congreso de la República presentando una propuesta de proyecto de ley sobre libertad de conciencia y laicidad.' }
    ];

    const captionsEn = [
      { title: 'Active community', text: 'People sharing reason, freedom of conscience, and humanist values in Lima.' },
      { title: 'Active community', text: 'Spaces for dialogue, integration, and mutual support for freethinkers and humanists.' },
      { title: 'Secular activism', text: 'Public presence and peaceful civic action in defense of civil liberties and secularism.' },
      { title: 'Civic advocacy', text: 'Civic monitoring and advocacy initiatives for state neutrality and human rights.' },
      { title: 'Civic advocacy', text: 'Statements and campaigns ensuring equality before the law without religious discrimination.' },
      { title: 'A diverse, open community', text: 'Over 17 years uniting diverse voices bound by reason and empathy.' },
      { title: 'Action and volunteering', text: 'Civic initiatives ensuring equality and secular education nationwide.' },
      { title: 'State & legislative advocacy', text: 'Working meeting at the Congress of the Republic presenting a legislative bill proposal for secularism and freedom of conscience.' }
    ];

    const captions = isEn ? captionsEn : captionsEs;
    const autoplayBtn = communitySlider.querySelector('.community__slider-autoplay');
    const indicators = communitySlider.querySelector('.community__slider-indicators');
    const slideStatus = document.createElement('p');
    slideStatus.className = 'sr-only';
    slideStatus.setAttribute('role', 'status');
    slideStatus.setAttribute('aria-live', 'polite');
    slideStatus.setAttribute('aria-atomic', 'true');
    communitySlider.appendChild(slideStatus);
    let currentSlide = 0;
    const totalSlides = slides.length;
    let autoplayTimer = null;
    let userPaused = motionPreference.matches;
    let hoverPaused = false;
    let focusPaused = false;
    let isCommunityVisible = !('IntersectionObserver' in window);

    if (indicators) indicators.setAttribute('role', 'group');
    slides.forEach((slide, index) => {
      slide.id = `community-slide-${index + 1}`;
      slide.setAttribute('aria-hidden', index === 0 ? 'false' : 'true');
    });
    dots.forEach((dot, index) => {
      dot.removeAttribute('role');
      dot.removeAttribute('aria-selected');
      dot.setAttribute('aria-controls', `community-slide-${index + 1}`);
      dot.setAttribute('aria-current', index === 0 ? 'true' : 'false');
      dot.tabIndex = index === 0 ? 0 : -1;
    });

    const updateAutoplayButton = () => {
      if (!autoplayBtn) return;
      const label = userPaused
        ? (isEn ? 'Resume automatic slideshow' : 'Reanudar reproducción automática')
        : (isEn ? 'Pause automatic slideshow' : 'Pausar reproducción automática');
      autoplayBtn.setAttribute('aria-label', label);
      autoplayBtn.setAttribute('title', label);
      autoplayBtn.setAttribute('aria-pressed', String(userPaused));
      autoplayBtn.innerHTML = userPaused
        ? '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>'
        : '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>';
      if (counterCurrent) counterCurrent.parentElement.setAttribute('aria-live', 'off');
    };

    const restartAutoplay = () => {
      clearInterval(autoplayTimer);
      autoplayTimer = null;
      if (!userPaused && !hoverPaused && !focusPaused && !document.hidden && isCommunityVisible) {
        autoplayTimer = setInterval(() => goToSlide(currentSlide + 1), 4800);
      }
    };

    const loadDeferredImage = image => {
      if (!image) return Promise.resolve(false);
      if (!image.getAttribute('src')) {
        const source = image.dataset.src;
        const sourceSet = image.dataset.srcset;
        if (!source) return Promise.resolve(false);
        image.loading = 'eager';
        if (sourceSet) image.srcset = sourceSet;
        image.src = source;
      }
      if (image.complete) return Promise.resolve(true);
      return new Promise(resolve => {
        image.addEventListener('load', () => resolve(true), { once: true });
        image.addEventListener('error', () => resolve(false), { once: true });
      });
    };

    let slideRequestId = 0;
    const goToSlide = (index, userInitiated = false) => {
      const requestId = ++slideRequestId;
      const targetSlide = (index + totalSlides) % totalSlides;
      loadDeferredImage(slides[targetSlide].querySelector('img')).then(() => {
        if (requestId !== slideRequestId) return;
        currentSlide = targetSlide;

        slides.forEach((slide, idx) => {
          const isActive = idx === currentSlide;
          slide.classList.toggle('is-active', isActive);
          slide.setAttribute('aria-hidden', isActive ? 'false' : 'true');
        });

        dots.forEach((dot, idx) => {
          const isActive = idx === currentSlide;
          dot.classList.toggle('is-active', isActive);
          dot.setAttribute('aria-current', String(isActive));
          dot.tabIndex = isActive ? 0 : -1;
        });

        if (counterCurrent) counterCurrent.textContent = currentSlide + 1;

        if (cardTitle && cardText && captions[currentSlide]) {
          const updateCaption = () => {
            cardTitle.textContent = captions[currentSlide].title;
            cardText.textContent = captions[currentSlide].text;
            cardTitle.style.opacity = '1';
            cardText.style.opacity = '1';
          };
          if (motionPreference.matches) {
            updateCaption();
          } else {
            cardTitle.style.opacity = '0';
            cardText.style.opacity = '0';
            setTimeout(updateCaption, 180);
          }
        }

        if (userInitiated) {
          const caption = captions[currentSlide];
          slideStatus.textContent = isEn
            ? `Slide ${currentSlide + 1} of ${totalSlides}: ${caption ? caption.title : ''}`
            : `Foto ${currentSlide + 1} de ${totalSlides}: ${caption ? caption.title : ''}`;
          restartAutoplay();
        }
      });
    };

    const nextSlide = () => goToSlide(currentSlide + 1, true);
    const prevSlide = () => goToSlide(currentSlide - 1, true);

    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);

    dots.forEach((dot, idx) => {
      dot.addEventListener('click', () => goToSlide(idx, true));
      dot.addEventListener('keydown', event => {
        let targetIndex = null;
        if (event.key === 'ArrowRight') targetIndex = (idx + 1) % totalSlides;
        if (event.key === 'ArrowLeft') targetIndex = (idx - 1 + totalSlides) % totalSlides;
        if (event.key === 'Home') targetIndex = 0;
        if (event.key === 'End') targetIndex = totalSlides - 1;
        if (targetIndex !== null) {
          event.preventDefault();
          event.stopPropagation();
          goToSlide(targetIndex, true);
          dots[targetIndex].focus();
        }
      });
    });

    if (autoplayBtn) {
      autoplayBtn.addEventListener('click', () => {
        userPaused = !userPaused;
        if (!userPaused) {
          hoverPaused = false;
          focusPaused = false;
        }
        updateAutoplayButton();
        restartAutoplay();
      });
    }

    communitySlider.addEventListener('mouseenter', () => {
      hoverPaused = true;
      restartAutoplay();
    });
    communitySlider.addEventListener('mouseleave', () => {
      hoverPaused = false;
      restartAutoplay();
    });
    communitySlider.addEventListener('focusin', () => {
      focusPaused = true;
      restartAutoplay();
    });
    communitySlider.addEventListener('focusout', event => {
      if (!communitySlider.contains(event.relatedTarget)) {
        focusPaused = false;
        restartAutoplay();
      }
    });
    communitySlider.addEventListener('keydown', event => {
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        nextSlide();
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        prevSlide();
      }
    });

    document.addEventListener('visibilitychange', restartAutoplay);
    addMediaQueryListener(motionPreference, event => {
      if (event.matches) userPaused = true;
      updateAutoplayButton();
      restartAutoplay();
    });

    let touchStartX = 0;
    communitySlider.addEventListener('touchstart', event => {
      touchStartX = event.changedTouches[0].screenX;
    }, { passive: true });
    communitySlider.addEventListener('touchend', event => {
      const diffX = event.changedTouches[0].screenX - touchStartX;
      if (Math.abs(diffX) > 40) {
        if (diffX < 0) nextSlide();
        else prevSlide();
      }
    }, { passive: true });

    if ('IntersectionObserver' in window) {
      const communityObserver = new IntersectionObserver(entries => {
        isCommunityVisible = entries[0].isIntersecting;
        if (isCommunityVisible) goToSlide(0);
        restartAutoplay();
      }, { rootMargin: '200px 0px' });
      communityObserver.observe(communitySlider);
    } else {
      isCommunityVisible = true;
      goToSlide(0);
    }
    updateAutoplayButton();
    restartAutoplay();
  }

  // 11. Búsqueda local con destinos reales y feedback visible
  const footerSearchForm = document.querySelector('.footer-search');
  if (footerSearchForm) {
    const searchInput = footerSearchForm.querySelector('.footer-search__input');
    const searchFeedback = document.createElement('p');
    searchFeedback.className = 'footer-search__feedback';
    searchFeedback.id = 'footer-search-feedback';
    searchFeedback.setAttribute('role', 'status');
    searchFeedback.setAttribute('aria-live', 'polite');
    footerSearchForm.insertAdjacentElement('afterend', searchFeedback);
    if (searchInput) searchInput.setAttribute('aria-describedby', searchFeedback.id);

    const normalizeText = value => value.toLocaleLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const staticDestinations = isEn ? [
      { title: 'Home', keywords: 'home aperat start inicio', url: englishRoot },
      { title: 'About Us', keywords: 'about history team community nosotros historia equipo', url: `${englishRoot}about-us/` },
      { title: 'What We Do', keywords: 'projects action science education legal what we do proyectos ciencia que hacemos', url: `${englishRoot}what-we-do/` },
      { title: 'Secularism & Rights', keywords: 'secularism rights conscience law resources laicidad derechos recursos', url: `${englishRoot}secularism-and-rights/` },
      { title: 'Our principles', keywords: 'principles science human rights secular state principios', url: `${englishRoot}#principios` },
      { title: 'World Humanist Congress 2027', keywords: 'congress event lima humanists international congreso evento', url: `${englishRoot}#congreso` },
      { title: 'News and articles', keywords: 'news articles blog science atheism noticias articulos', url: `${englishRoot}#noticias` },
      { title: 'Join as a supporter', keywords: 'join participate supporter newsletter participa simpatizante', url: '#participa' },
      { title: 'Contact APERAT', keywords: 'contact email whatsapp phone contacto correo', url: 'mailto:contacto@aperat.org.pe' },
      { title: 'Donate to APERAT', keywords: 'donate support yape plin paypal donar apoyar', action: 'donate' }
    ] : [
      { title: 'Inicio', keywords: 'inicio portada aperat home', url: siteRoot },
      { title: 'Sobre Nosotros', keywords: 'historia equipo comunidad nosotros about', url: `${siteRoot}sobre-nosotros/` },
      { title: 'Qué Hacemos', keywords: 'proyectos acción ciencia educación legal que hacemos', url: `${siteRoot}que-hacemos/` },
      { title: 'Laicidad y Derechos', keywords: 'laicidad derechos conciencia ley recursos secularism', url: `${siteRoot}laicidad-y-derechos/` },
      { title: 'Nuestros principios', keywords: 'principios ciencia derechos humanos estado laico', url: `${siteRoot}#principios` },
      { title: 'World Humanist Congress 2027', keywords: 'congreso evento lima humanists international congress', url: `${siteRoot}#congreso` },
      { title: 'Noticias y artículos', keywords: 'noticias artículos blog ciencia ateísmo articles', url: `${siteRoot}#noticias` },
      { title: 'Súmate como simpatizante', keywords: 'participa simpatizante registro comunidad join', url: '#participa' },
      { title: 'Contacto institucional', keywords: 'contacto correo email whatsapp teléfono', url: 'mailto:contacto@aperat.org.pe' },
      { title: 'Donar a APERAT', keywords: 'donar apoyar yape plin paypal donate', action: 'donate' }
    ];

    const searchableDestinations = [
      ...staticDestinations,
      ...currentArticles.map(article => ({
        title: article.title,
        keywords: `${article.excerpt} ${article.category} ${article.badge}`,
        url: article.url
      }))
    ];

    footerSearchForm.addEventListener('submit', event => {
      event.preventDefault();
      const term = searchInput ? searchInput.value.trim() : '';
      if (!term) {
        searchFeedback.textContent = isEn ? 'Enter a search term, such as “rights” or “articles”.' : 'Escribe un término de búsqueda, como “derechos” o “artículos”.';
        if (searchInput) searchInput.focus();
        return;
      }

      const normalizedTerm = normalizeText(term);
      const match = searchableDestinations
        .map(destination => {
          const title = normalizeText(destination.title);
          const keywords = normalizeText(destination.keywords || '');
          let score = 0;
          if (title === normalizedTerm) score += 200;
          if (title.includes(normalizedTerm)) score += 100;
          if (keywords.includes(normalizedTerm)) score += 40;
          return { destination, score };
        })
        .filter(result => result.score > 0)
        .sort((a, b) => b.score - a.score)[0];

      if (!match) {
        searchFeedback.textContent = isEn
          ? `No results found for “${term}”. Try “rights”, “science”, “articles”, or “contact”.`
          : `No encontramos resultados para “${term}”. Prueba con “derechos”, “ciencia”, “artículos” o “contacto”.`;
        return;
      }

      const destination = match.destination;
      searchFeedback.textContent = isEn ? `Opening: ${destination.title}` : `Abriendo: ${destination.title}`;

      if (destination.action === 'donate') {
        openModal(searchInput);
        return;
      }

      const onHomePage = isHomePage;
      const homeHash = isEn ? `${englishRoot}#` : `${siteRoot}#`;
      if (destination.url.startsWith('#')) {
        scrollToElement(document.querySelector(destination.url));
        return;
      }
      if (onHomePage && destination.url.startsWith(homeHash)) {
        scrollToElement(document.getElementById(destination.url.split('#')[1]));
        return;
      }
      window.location.href = destination.url;
    });
  }

  // 10. Enlace de Navegación Activo según Scroll (IntersectionObserver solo en index)
  const sections = document.querySelectorAll('section[id], header[id]');
  const navAnchorLinks = document.querySelectorAll('.navbar__link');

  if (isHomePage && 'IntersectionObserver' in window && sections.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navAnchorLinks.forEach(link => {
            const href = link.getAttribute('href');
            const isHomeLink = href === 'index.html' || href === './' || href === '../' || href === '/en/' || href === '/';
            if (href === `#${id}` || (id === 'inicio' && isHomeLink)) {
              link.classList.add('active');
              link.setAttribute('aria-current', isHomeLink ? 'page' : 'location');
            } else if (href.startsWith('#') || isHomeLink) {
              link.classList.remove('active');
              link.removeAttribute('aria-current');
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
