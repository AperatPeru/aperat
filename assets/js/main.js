/**
 * APERAT - Script Principal (JavaScript Vanilla Moderno)
 * Funcionalidades: Barra de progreso de lectura, Scroll Reveal animado,
 * contador numérico interactivo, Header sticky dinámico, Modal de donación con pestañas,
 * carrusel de artículos, scroll suave y botón volver arriba.
 */

document.addEventListener('DOMContentLoaded', () => {
  const isEn = document.documentElement.lang === 'en';
  const assetPrefix = isEn ? '../' : '';

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
          btn.innerHTML = isEn ? '✓ Copied!' : '✓ ¡Copiado!';
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

  // 7. Carrusel / Paginación de Artículos
  const articlesData = [
    {
      id: 'exoneracion-curso-religion-peru',
      title: '¿Se puede exonerar a un estudiante del curso de religión en el Perú?',
      excerpt: 'En el Perú, los estudiantes y sus familias tienen derecho legal a exonerarse del curso de Educación Religiosa por motivos de conciencia. Conoce la normativa y los pasos para el trámite.',
      category: 'Educación y libertad de conciencia',
      badge: 'Educación',
      image: 'assets/img/articles/exoneracion-curso-religion-peru.webp',
      imageAlt: 'Estudiantes en el aula escolar peruana',
      url: 'articulos/exoneracion-curso-religion-peru.html',
      date: '2026-11-07',
      dateLabel: '7 nov. 2026'
    },
    {
      id: 'ceremonias-humanistas',
      title: 'Ceremonias humanistas: cómo celebrar los momentos importantes de la vida sin una ceremonia religiosa',
      excerpt: 'Una alternativa laica y personalizada para bodas, funerales y momentos trascendentales, centrada en las personas, sus historias y los vínculos que las unen.',
      category: 'Sociedad y humanismo',
      badge: 'Ceremonias',
      image: 'assets/img/articles/ceremonia-1600x1000.webp',
      imageAlt: 'Ceremonia humanista en el Perú',
      url: 'articulos/ceremonias-humanistas.html',
      date: '2026-11-06',
      dateLabel: '6 nov. 2026'
    },
    {
      id: 'estado-laico-peru',
      title: 'El Estado laico: una condición para la libertad y la democracia en el Perú',
      excerpt: 'Por qué la separación entre el poder político y las instituciones religiosas sigue siendo una tarea pendiente de nuestra República para garantizar la igualdad y los derechos de todos.',
      category: 'Democracia y laicidad',
      badge: 'Estado Laico',
      image: 'assets/img/articles/articulo_marcha_laica.webp',
      imageAlt: 'Marcha en Lima por la defensa del Estado Laico',
      url: 'articulos/estado-laico-peru.html',
      date: '2026-11-05',
      dateLabel: '5 nov. 2026'
    },
    {
      id: 'humanismo-laico',
      title: 'Humanismo laico: una forma de vivir con razón, libertad y humanidad',
      excerpt: 'Una visión del mundo que encuentra en la capacidad humana de pensar, cuidar y construir un futuro compartido las bases de una vida con sentido y ética.',
      category: 'Sociedad y humanismo',
      badge: 'Humanismo',
      image: 'assets/img/articles/articulo_humanismo_asamblea.webp',
      imageAlt: 'Asamblea de la comunidad de APERAT y Humanists International en Lima',
      url: 'articulos/humanismo-laico.html',
      date: '2026-11-04',
      dateLabel: '4 nov. 2026'
    },
    {
      id: 'por-que-no-creo-en-dios',
      title: '¿Por qué no creo en Dios? Una mirada racional al ateísmo y la ausencia de evidencia',
      excerpt: 'No creer en Dios no exige tener una explicación para cada misterio del universo: exige no aceptar como verdadero aquello para lo que no encontramos razones suficientes.',
      category: 'Razón y filosofía',
      badge: 'Ateísmo',
      image: 'assets/img/articles/russell.webp',
      imageAlt: 'Bertrand Russell, filósofo y matemático humanista',
      url: 'articulos/por-que-no-creo-en-dios.html',
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
      url: isEn ? 'articles/exemption-religious-education-peru.html' : 'en/articles/exemption-religious-education-peru.html',
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
      url: isEn ? 'articles/humanist-ceremonies.html' : 'en/articles/humanist-ceremonies.html',
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
      url: isEn ? 'articles/secular-state-peru.html' : 'en/articles/secular-state-peru.html',
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
      url: isEn ? 'articles/secular-humanism.html' : 'en/articles/secular-humanism.html',
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
      url: isEn ? 'articles/why-i-do-not-believe-in-god.html' : 'en/articles/why-i-do-not-believe-in-god.html',
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

  if (articlesGrid && sliderDotsContainer) {
    const ITEMS_PER_PAGE = 3;
    const totalPages = Math.ceil(currentArticles.length / ITEMS_PER_PAGE);
    let currentPage = 0;

    // Generar los dots de paginación dinámicamente
    sliderDotsContainer.innerHTML = '';
    for (let i = 0; i < totalPages; i++) {
      const dot = document.createElement('button');
      dot.className = `slider-dot${i === 0 ? ' active' : ''}`;
      dot.setAttribute('aria-label', isEn ? `News page ${i + 1}` : `Página ${i + 1} de noticias`);
      if (i === 0) dot.setAttribute('aria-current', 'true');
      dot.addEventListener('click', () => renderArticlesPage(i));
      sliderDotsContainer.appendChild(dot);
    }

    const renderArticlesPage = (pageIndex) => {
      currentPage = (pageIndex + totalPages) % totalPages;

      // Actualizar dots
      const dots = sliderDotsContainer.querySelectorAll('.slider-dot');
      dots.forEach((dot, idx) => {
        const isActive = idx === currentPage;
        dot.classList.toggle('active', isActive);
        if (isActive) {
          dot.setAttribute('aria-current', 'true');
        } else {
          dot.removeAttribute('aria-current');
        }
      });

      // Transición suave (fade)
      articlesGrid.classList.add('is-fading');

      setTimeout(() => {
        const start = currentPage * ITEMS_PER_PAGE;
        const pageArticles = currentArticles.slice(start, start + ITEMS_PER_PAGE);

        articlesGrid.innerHTML = pageArticles.map((art, idx) => `
          <article class="article-card is-revealed" data-reveal data-reveal-delay="${(idx + 1) * 100}">
            <div class="article-card__media">
              <a href="${art.url}" tabindex="-1" aria-hidden="true">
                <img src="${art.image}" alt="${art.imageAlt}" class="article-card__image" loading="lazy">
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
      }, 140);
    };

    if (sliderPrevBtn) {
      sliderPrevBtn.addEventListener('click', () => {
        renderArticlesPage(currentPage - 1);
      });
    }

    if (sliderNextBtn) {
      sliderNextBtn.addEventListener('click', () => {
        renderArticlesPage(currentPage + 1);
      });
    }

    // Render inicial
    renderArticlesPage(0);
  }

  // 8. Formulario de Registro de Simpatizantes
  const newsletterForm = document.querySelector('.newsletter__form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const input = newsletterForm.querySelector('.newsletter__input');
      const btn = newsletterForm.querySelector('.newsletter__btn');
      const progressContainer = document.getElementById('newsletter-progress');
      const progressBar = document.getElementById('newsletter-progress-bar');
      const progressStatus = document.getElementById('newsletter-progress-status');
      const progressVal = document.getElementById('newsletter-progress-val');
      const feedbackEl = document.getElementById('newsletter-feedback');
      const email = input ? input.value.trim() : '';

      if (!email) return;

      const originalHTML = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = '<span class="newsletter__spinner" aria-hidden="true"></span><span>Enviando...</span>';

      // Limpiar feedback previo
      if (feedbackEl) {
        feedbackEl.classList.remove('is-visible');
        feedbackEl.innerHTML = '';
      }

      // Activar barra de progreso visible (Fase 1: 15%)
      if (progressContainer && progressBar) {
        progressBar.style.width = '15%';
        if (progressStatus) progressStatus.textContent = 'Conectando con el servidor...';
        if (progressVal) progressVal.textContent = '15%';
        progressContainer.classList.add('is-active');
      }

      const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

      try {
        const targetUrl = newsletterForm.action || 'https://smartica.ing/aperat/api/';

        // Iniciar la petición fetch en paralelo
        const fetchPromise = fetch(targetUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({ email: email })
        });

        // Fase 2: Avance al 45% (200ms)
        await sleep(200);
        if (progressBar) {
          progressBar.style.width = '45%';
          if (progressStatus) progressStatus.textContent = isEn ? 'Connecting...' : 'Enviando registro de simpatizante...';
          if (progressVal) progressVal.textContent = '45%';
        }

        // Fase 3: Avance al 75% (300ms)
        await sleep(300);
        if (progressBar) {
          progressBar.style.width = '75%';
          if (progressStatus) progressStatus.textContent = isEn ? 'Registering supporter...' : 'Confirmando en el sistema...';
          if (progressVal) progressVal.textContent = '75%';
        }

        // Esperar la respuesta del servidor
        const response = await fetchPromise;

        if (!response.ok) {
          throw new Error(`Error en el servidor: ${response.status}`);
        }

        // Fase 4: Avance al 100% (Completado)
        if (progressBar) {
          progressBar.style.width = '100%';
          if (progressStatus) progressStatus.textContent = isEn ? 'Successfully completed!' : '¡Completado con éxito!';
          if (progressVal) progressVal.textContent = '100%';
        }

        btn.innerHTML = isEn ? '<span>✓ Joined!</span>' : '<span>✓ ¡Registrado!</span>';
        btn.style.backgroundColor = '#0584ab';

        // Pausa de 350ms para que se aprecie la barra al 100%
        await sleep(350);

        // Ocultar barra de progreso y limpiar input
        if (progressContainer) progressContainer.classList.remove('is-active');
        input.value = '';

        // Mostrar tarjeta de confirmación de forma suave
        if (feedbackEl) {
          feedbackEl.innerHTML = `
            <div class="newsletter__card-feedback newsletter__card-feedback--success">
              <div class="newsletter__feedback-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
              </div>
              <div class="newsletter__feedback-body">
                <div class="newsletter__feedback-title">${isEn ? 'Registration Completed Successfully!' : '¡Registro completado con éxito!'}</div>
                <p class="newsletter__feedback-text">${isEn ? 'You have joined as an APERAT supporter. You will receive invitations to our public events, talks, and community activities.' : 'Te has sumado como simpatizante de APERAT. Recibirás en tu correo las invitaciones a nuestros eventos y actividades gratuitas.'}</p>
              </div>
            </div>
          `;
          requestAnimationFrame(() => {
            feedbackEl.classList.add('is-visible');
          });
        }

        setTimeout(() => {
          btn.innerHTML = originalHTML;
          btn.style.backgroundColor = '';
          btn.disabled = false;
        }, 5000);

        setTimeout(() => {
          if (feedbackEl) feedbackEl.classList.remove('is-visible');
        }, 12000);

      } catch (err) {
        console.error('Error al registrar simpatizante:', err);
        if (progressBar) {
          progressBar.style.width = '100%';
          if (progressStatus) progressStatus.textContent = 'Error al enviar';
          if (progressVal) progressVal.textContent = '!';
        }

        await sleep(300);
        if (progressContainer) progressContainer.classList.remove('is-active');

        btn.innerHTML = '<span>Reintentar</span>';
        btn.style.backgroundColor = '#c62828';

        if (feedbackEl) {
          feedbackEl.innerHTML = `
            <div class="newsletter__card-feedback newsletter__card-feedback--error">
              <div class="newsletter__feedback-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
              </div>
              <div class="newsletter__feedback-body">
                <div class="newsletter__feedback-title">No se pudo completar el registro</div>
                <p class="newsletter__feedback-text">Hubo un problema de conexión con el servidor. Por favor, verifica tu conexión o intenta nuevamente.</p>
              </div>
            </div>
          `;
          requestAnimationFrame(() => {
            feedbackEl.classList.add('is-visible');
          });
        }

        setTimeout(() => {
          btn.innerHTML = originalHTML;
          btn.style.backgroundColor = '';
          btn.disabled = false;
        }, 4000);
      }
    });
  }

  // 9. Modal de Principios
  const principlesData = {
    1: {
      badge: '01 / CIENCIA',
      title: 'Razón y pensamiento crítico',
      image: 'assets/img/principles/principio_ciencia.webp',
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
      image: 'assets/img/principles/principio_freedom_of_thought.webp',
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
      image: 'assets/img/principles/principio_laicidad.webp',
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
      image: 'assets/img/principles/principio_derechos.webp?v=2',
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

  function openPrincipleModal(id) {
    const activePrinciples = isEn ? principlesDataEn : principlesData;
    const data = activePrinciples[id];
    if (!data || !principlesModal) return;

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
    document.body.style.overflow = 'hidden';
    principlesModalClose.focus();
  }

  function closePrincipleModal() {
    if (!principlesModal) return;
    principlesModal.setAttribute('hidden', '');
    document.body.style.overflow = '';
  }

  if (principlesModal) {
    document.querySelectorAll('.principle-item__btn').forEach(btn => {
      btn.addEventListener('click', () => {
        openPrincipleModal(parseInt(btn.dataset.principle));
      });
    });

    principlesModalClose.addEventListener('click', closePrincipleModal);
    principlesModalOverlay.addEventListener('click', closePrincipleModal);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !principlesModal.hasAttribute('hidden')) {
        closePrincipleModal();
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
      { title: 'Una comunidad activa', text: 'Personas que comparten razón, libertad de conciencia y valores humanistas en Lima.' },
      { title: 'Diálogo y pensamiento crítico', text: 'Conversatorios abiertos para debatir ideas con rigor científico y respeto mutuo.' },
      { title: 'Encuentros presenciales', text: 'Espacios de confraternidad y apoyo para la comunidad secular en el Perú.' },
      { title: 'Defensa del Estado Laico', text: 'Incidencia ciudadana por la neutralidad estatal y la libertad de conciencia.' },
      { title: 'Talleres y actividades', text: 'Promoviendo el humanismo, los derechos humanos y la divulgación científica.' },
      { title: 'Comunidad diversa y abierta', text: 'Más de 15 años sumando voces diversas unidas por la razón y la empatía.' },
      { title: 'Acción y voluntariado', text: 'Iniciativas ciudadanas para garantizar igualdad y educación laica en el país.' },
      { title: 'El Ágora Laica', text: 'Un espacio donde cada persona puede dudar, preguntar y pertenecer libremente.' }
    ];

    const captionsEn = [
      { title: 'An active community', text: 'People sharing reason, freedom of conscience, and humanist values in Lima.' },
      { title: 'Dialogue and critical thinking', text: 'Open panels discussing ideas with scientific rigor and mutual respect.' },
      { title: 'In-person community meetups', text: 'Spaces for camaraderie and support for the secular community in Peru.' },
      { title: 'Secular state advocacy', text: 'Civic engagement for state neutrality and freedom of conscience.' },
      { title: 'Workshops and activities', text: 'Promoting humanism, human rights, and scientific dissemination.' },
      { title: 'A diverse, open community', text: 'Over 15 years uniting diverse voices bound by reason and empathy.' },
      { title: 'Action and volunteering', text: 'Civic initiatives ensuring equality and secular education nationwide.' },
      { title: 'The Secular Agora', text: 'A place where everyone can doubt, question, and freely belong.' }
    ];

    const captions = isEn ? captionsEn : captionsEs;
    let currentSlide = 0;
    const totalSlides = slides.length;
    let autoplayTimer = null;
    let isPaused = false;

    const goToSlide = (index) => {
      if (index < 0) {
        currentSlide = totalSlides - 1;
      } else if (index >= totalSlides) {
        currentSlide = 0;
      } else {
        currentSlide = index;
      }

      // Actualizar slides
      slides.forEach((slide, idx) => {
        const isActive = idx === currentSlide;
        slide.classList.toggle('is-active', isActive);
        slide.setAttribute('aria-hidden', isActive ? 'false' : 'true');
      });

      // Actualizar dots
      dots.forEach((dot, idx) => {
        const isActive = idx === currentSlide;
        dot.classList.toggle('is-active', isActive);
        dot.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });

      // Actualizar contador
      if (counterCurrent) {
        counterCurrent.textContent = currentSlide + 1;
      }

      // Transición suave de texto de la tarjeta
      if (cardTitle && cardText && captions[currentSlide]) {
        cardTitle.style.opacity = '0';
        cardText.style.opacity = '0';
        setTimeout(() => {
          cardTitle.textContent = captions[currentSlide].title;
          cardText.textContent = captions[currentSlide].text;
          cardTitle.style.opacity = '1';
          cardText.style.opacity = '1';
        }, 220);
      }
    };

    const nextSlide = () => goToSlide(currentSlide + 1);
    const prevSlide = () => goToSlide(currentSlide - 1);

    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        nextSlide();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        prevSlide();
      });
    }

    dots.forEach((dot, idx) => {
      dot.addEventListener('click', (e) => {
        e.preventDefault();
        goToSlide(idx);
      });
    });

    // Autoplay automático cada 4.8 segundos con pausa en hover
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const startAutoplay = () => {
      if (prefersReducedMotion || autoplayTimer) return;
      autoplayTimer = setInterval(() => {
        if (!isPaused) {
          nextSlide();
        }
      }, 4800);
    };

    communitySlider.addEventListener('mouseenter', () => { isPaused = true; });
    communitySlider.addEventListener('mouseleave', () => { isPaused = false; });
    communitySlider.addEventListener('focusin', () => { isPaused = true; });
    communitySlider.addEventListener('focusout', () => { isPaused = false; });

    // Soporte para gestos táctiles (Swipe en móviles y tabletas)
    let touchStartX = 0;
    let touchEndX = 0;

    communitySlider.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    communitySlider.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const diffX = touchEndX - touchStartX;
      if (Math.abs(diffX) > 40) {
        if (diffX < 0) {
          nextSlide();
        } else {
          prevSlide();
        }
      }
    }, { passive: true });

    startAutoplay();
  }

  // 11. Búsqueda Rápida en Footer
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
