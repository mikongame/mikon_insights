// Función para inicializar el menú hamburguesa correctamente
function initializeMenuToggle() {
  const menuToggle = document.querySelector(".menu-toggle");
  const navMenu = document.querySelector(".nav-menu");

  if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", () => {
      navMenu.classList.toggle("show");
    });

    // Cerrar el menú si el usuario hace clic en un enlace dentro de la navegación
    navMenu.addEventListener("click", (event) => {
      if (event.target.tagName === "A") {
        navMenu.classList.remove("show");
      }
    });
  } else {
    console.error("❌ No se encontró el botón del menú hamburguesa o la navegación.");
  }
}


// Función para cargar componentes dinámicamente
function loadComponent(containerId, filePath) {
  return fetch(filePath)
    .then(response => response.text())
    .then(data => {
      document.getElementById(containerId).innerHTML = data;
    })
    .catch(error => console.error(`Error cargando ${filePath}:`, error));
}

// Observer para detectar cambios en el DOM (cuando `header.html` se cargue)
const observer = new MutationObserver(() => {
  if (document.querySelector(".menu-toggle")) {
    initializeMenuToggle();
    observer.disconnect(); // Detener la observación una vez encontrado
  }
});

// Configuración del observer para observar cambios en `#header-container`
observer.observe(document.getElementById("header-container"), { childList: true });

document.addEventListener("DOMContentLoaded", async () => {
  console.log("🚀 Script iniciado...");

  // Cargar componentes dinámicos
  await loadComponent("header-container", "components/header.html");
  await loadComponent("hero-container", "components/hero.html");
  await loadComponent("benefits-container", "components/benefits.html");
  await loadComponent("services-container", "components/services.html");
  await loadComponent("projects-container", "components/projects.html"); 
  await loadComponent("contact-container", "components/contact.html");
  await loadComponent("footer-container", "components/footer.html");

  // Una vez que los componentes se han cargado, verificamos si hay un caso en la URL
  const urlParams = new URLSearchParams(window.location.search);
  const caseName = urlParams.get("case");

  if (caseName) {
      console.log(`🔍 Detectado parámetro en la URL: ${caseName}`);
      loadCaseStudy(caseName);
  }

  // Delegación de eventos para "Leer más" y "Cerrar"
  document.addEventListener("click", function (event) {
      if (event.target.classList.contains("view-case")) {
          event.preventDefault();
          const caseName = event.target.closest(".project").getAttribute("data-case");
          loadCaseStudy(caseName);
      }

      if (event.target.id === "close-case-study") {
          closeCaseStudy();
      }
  });
});

document.addEventListener("DOMContentLoaded", async () => {
  const path = window.location.pathname;

  const loadComponent = async (containerId, componentPath) => {
    const container = document.getElementById(containerId);
    if (container) {
      const response = await fetch(componentPath);
      const html = await response.text();
      container.innerHTML = html;
    }
  };

  // Siempre cargamos header y footer
  await loadComponent("header-container", "components/header.html");
  await loadComponent("footer-container", "components/footer.html");

  if (path === "/cv") {
    // Solo mostrar header, hero, CV y footer
    await loadComponent("hero-container", "components/hero.html");
    await loadComponent("cv-container", "components/cv-content.html");

    // Ocultar secciones que no queremos en /cv
    const sectionsToHide = [
      "benefits-container",
      "services-container",
      "projects-container",
      "contact-container"
    ];
    sectionsToHide.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.style.display = "none";
    });
  } else {
    // Página principal → cargar todo
    await loadComponent("hero-container", "components/hero.html");
    await loadComponent("benefits-container", "components/benefits.html");
    await loadComponent("services-container", "components/services.html");
    await loadComponent("projects-container", "components/projects.html");
    await loadComponent("contact-container", "components/contact.html");
  }
});

function loadCaseStudy(caseName) {
  if (!caseName) return;

  // Actualizar la URL sin recargar la página
  history.pushState(null, "", `?case=${caseName}`);

  // Cargar el contenido del caso de estudio
  fetch(`components/cases/${caseName}.html`)
      .then(response => response.text())
      .then(data => {
          const caseStudySection = document.getElementById("case-study-content");
          caseStudySection.innerHTML = `<button id="close-case-study">⬅ Volver</button>` + data;
          caseStudySection.classList.remove("hidden");

          // Ocultar lista de proyectos
          document.getElementById("projects-list").style.display = "none";

          // Esperar un pequeño tiempo para asegurar que las imágenes existen en el DOM antes de inicializar el Lightbox
          setTimeout(() => {
            initializeLightbox();
        }, 300);

          // Scroll al inicio del caso de estudio
          window.scrollTo({ top: caseStudySection.offsetTop, behavior: "smooth" });
      })
      .catch(error => console.error("Error cargando el caso de estudio:", error));
}

// Manejar el cierre del caso de estudio
function closeCaseStudy() {
  const caseStudySection = document.getElementById("case-study-content");
  caseStudySection.classList.add("hidden");
  caseStudySection.innerHTML = ""; // Limpiar contenido

  // Restaurar la lista de proyectos
  document.getElementById("projects-list").style.display = "flex";

  // Eliminar el parámetro de la URL
  history.pushState(null, "", window.location.pathname);

  // Scroll arriba
  window.scrollTo({ top: document.getElementById("projects-list").offsetTop, behavior: "smooth" });
}

// Detectar si hay un caso en la URL al cargar la página
document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const caseName = urlParams.get("case");

  if (caseName) {
      loadCaseStudy(caseName);
  }

  // Delegar eventos para "Leer más" y "Cerrar"
  document.addEventListener("click", function (event) {
      if (event.target.classList.contains("view-case")) {
          event.preventDefault(); // Prevenir la navegación
          const caseName = new URL(event.target.href).searchParams.get("case");
          loadCaseStudy(caseName);
      }

      if (event.target.id === "close-case-study") {
          closeCaseStudy();
      }
  });
});

document.addEventListener("DOMContentLoaded", function () {
  emailjs.init("z1S6y48MZ5PIPDneM"); // Sustituye con tu Public Key de EmailJS

  const contactForm = document.getElementById("contact-form");
  if (!contactForm) {
      console.error("❌ Formulario de contacto no encontrado.");
      return;
  }

  contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const name = document.querySelector("input[name='name']").value;
      const email = document.querySelector("input[name='email']").value;
      const message = document.querySelector("textarea[name='message']").value;

      if (!name || !email || !message) {
          alert("Por favor, completa todos los campos.");
          return;
      }

      const templateParams = {
        from_name: name,
        from_email: email,
        message: message,
        signature_url: "https://drive.google.com/uc?export=view&id=1iIj6uesm70LJROvUFSIt6zCzSesqkwOS"
    };
    

      emailjs.send("service_350kf7n", "template_it17y9k", templateParams)
          .then(response => {
              console.log("✅ Correo enviado con éxito:", response);
              alert("¡Gracias por tu mensaje! Nos pondremos en contacto pronto.");
              contactForm.reset();
          })
          .catch(error => {
              console.error("❌ Error al enviar el correo:", error);
              alert("Hubo un problema al enviar tu mensaje. Inténtalo más tarde.");
          });
  });
});

function initializeLightbox() {
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.querySelector(".lightbox-img");
  const closeLightbox = document.querySelector(".close-lightbox");

  if (!lightbox || !lightboxImg || !closeLightbox) {
      console.error("❌ Error: Lightbox no encontrado en el DOM.");
      return;
  }

  console.log("🔄 Inicializando Lightbox...");

  // Agregar evento a todas las imágenes .zoomable dentro del caso de estudio cargado
  document.querySelectorAll(".zoomable").forEach(img => {
      img.addEventListener("click", function () {
          console.log("🖼️ Imagen clickeada:", img.src);
          lightbox.style.display = "flex";
          lightboxImg.src = img.src; // Mostrar la imagen ampliada
      });
  });

  // Cerrar el lightbox al hacer clic en la 'X'
  closeLightbox.addEventListener("click", () => {
      lightbox.style.display = "none";
  });

  // Cerrar el lightbox al hacer clic fuera de la imagen
  lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox) {
          lightbox.style.display = "none";
      }
  });

  console.log("✅ Lightbox listo.");
}


