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

  // 7. Carrusel / Paginación de Artículos
  const articlesData = [
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
      dateLabel: '6 Noviembre 2026'
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
      dateLabel: '5 Noviembre 2026'
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
      dateLabel: '4 Noviembre 2026'
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
      dateLabel: '3 Noviembre 2026'
    }
  ];

  // Ordenar de forma descendente por fecha (el más reciente primero)
  articlesData.sort((a, b) => new Date(b.date) - new Date(a.date));

  const articlesGrid = document.getElementById('articles-grid');
  const sliderDotsContainer = document.getElementById('articles-slider-dots');
  const sliderPrevBtn = document.querySelector('.slider-btn--prev');
  const sliderNextBtn = document.querySelector('.slider-btn--next');

  if (articlesGrid && sliderDotsContainer) {
    const ITEMS_PER_PAGE = 3;
    const totalPages = Math.ceil(articlesData.length / ITEMS_PER_PAGE);
    let currentPage = 0;

    // Generar los dots de paginación dinámicamente
    sliderDotsContainer.innerHTML = '';
    for (let i = 0; i < totalPages; i++) {
      const dot = document.createElement('button');
      dot.className = `slider-dot${i === 0 ? ' active' : ''}`;
      dot.setAttribute('aria-label', `Página ${i + 1} de noticias`);
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
        const pageArticles = articlesData.slice(start, start + ITEMS_PER_PAGE);

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
                <span class="article-card__meta-sep" aria-hidden="true">•</span>
                <time class="article-card__meta-date" datetime="${art.date}">${art.dateLabel}</time>
              </div>
              <h3 class="article-card__title">
                <a href="${art.url}">${art.title}</a>
              </h3>
              <p class="article-card__excerpt">${art.excerpt}</p>
              <div class="article-card__footer">
                <a href="${art.url}" class="article-card__action">
                  <span>Leer artículo</span>
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
          if (progressStatus) progressStatus.textContent = 'Enviando registro de simpatizante...';
          if (progressVal) progressVal.textContent = '45%';
        }

        // Fase 3: Avance al 75% (300ms)
        await sleep(300);
        if (progressBar) {
          progressBar.style.width = '75%';
          if (progressStatus) progressStatus.textContent = 'Confirmando en el sistema...';
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
          if (progressStatus) progressStatus.textContent = '¡Completado con éxito!';
          if (progressVal) progressVal.textContent = '100%';
        }

        btn.innerHTML = '<span>✓ ¡Registrado!</span>';
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
                <div class="newsletter__feedback-title">¡Registro completado con éxito!</div>
                <p class="newsletter__feedback-text">Te has sumado como simpatizante de APERAT. Recibirás en tu correo las invitaciones a nuestros eventos y actividades gratuitas.</p>
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
      image: 'assets/img/principles/principio_derechos.webp',
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

  const principlesModal = document.getElementById('principles-modal');
  const principlesModalContent = document.getElementById('principles-modal-content');
  const principlesModalClose = document.getElementById('principles-modal-close');
  const principlesModalOverlay = document.getElementById('principles-modal-overlay');

  function openPrincipleModal(id) {
    const data = principlesData[id];
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
          <div class="pmodal__highlights-title">Puntos clave</div>
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
