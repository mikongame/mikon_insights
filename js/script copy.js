// Función para cargar componentes dinámicamente
async function loadComponent(containerId, filePath) {
  try {
    const container = document.getElementById(containerId);
    if (container) {
      const response = await fetch(filePath);
      const html = await response.text();
      container.innerHTML = html;
    }
  } catch (error) {
    console.error(`❌ Error cargando ${filePath}:`, error);
  }
}

function ajustarEspaciadoPorHeader() {
  const header = document.querySelector("header");
  const main = document.getElementById("main-content");

  if (header && main) {
    const altura = header.offsetHeight;
    main.style.marginTop = `${altura}px`;
    console.log(`🔧 Espaciado ajustado a ${altura}px`);
  }
}

window.addEventListener("resize", ajustarEspaciadoPorHeader);

// Función para ajustar los enlaces del menú cuando se está en /cv
function initializeMenuLinks() {
  // Esperar brevemente por si el contenido aún no ha cargado
  setTimeout(() => {
    const links = document.querySelectorAll(".nav-menu a[href^='#']");
    if (links.length === 0) {
      console.warn("⚠️ No se encontraron enlaces del menú para modificar.");
      return;
    }

    links.forEach(link => {
      const target = link.getAttribute("href");
      if (target && !target.startsWith("/#")) {
        // Reemplazar href por versión absoluta hacia la home
        link.setAttribute("href", `/#${target.replace("#", "")}`);
      }
    });

    console.log("🔗 Enlaces del menú reescritos para navegación SPA.");
  }, 200); // 200ms de espera como margen de seguridad
}

// Función para inicializar menú hamburguesa tras cargar el header
function initializeMenuToggle() {
  const menuToggle = document.querySelector(".menu-toggle");
  const navMenu = document.querySelector(".nav-menu");

  if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", () => {
      navMenu.classList.toggle("show");
      ajustarEspaciadoPorHeader();
    });
    navMenu.addEventListener("click", (event) => {
      if (event.target.tagName === "A") {
        navMenu.classList.remove("show");
      }
    });
  } else {
    console.error("❌ No se encontró el botón del menú hamburguesa o el menú.");
  }
}

// Inicializar Lightbox
function initializeLightbox() {
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.querySelector(".lightbox-img");
  const closeLightbox = document.querySelector(".close-lightbox");

  if (!lightbox || !lightboxImg || !closeLightbox) return;

  document.querySelectorAll(".zoomable").forEach(img => {
    img.addEventListener("click", () => {
      lightbox.style.display = "flex";
      lightboxImg.src = img.src;
    });
  });

  closeLightbox.addEventListener("click", () => {
    lightbox.style.display = "none";
  });

  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
      lightbox.style.display = "none";
    }
  });
}

// Función para cargar un caso de estudio
function loadCaseStudy(caseName) {
  if (!caseName) return;
  history.pushState(null, "", `?case=${caseName}`);

  fetch(`components/cases/${caseName}.html`)
    .then(response => response.text())
    .then(data => {
      const section = document.getElementById("case-study-content");
      section.innerHTML = `<button id="close-case-study">⬅ Volver</button>${data}`;
      section.classList.remove("hidden");
      document.getElementById("projects-list").style.display = "none";

      setTimeout(() => initializeLightbox(), 300);
      window.scrollTo({ top: section.offsetTop, behavior: "smooth" });
    })
    .catch(error => console.error("❌ Error cargando el caso de estudio:", error));
}

// Cerrar caso de estudio
function closeCaseStudy() {
  const section = document.getElementById("case-study-content");
  section.classList.add("hidden");
  section.innerHTML = "";
  document.getElementById("projects-list").style.display = "flex";
  history.pushState(null, "", window.location.pathname);
  window.scrollTo({ top: document.getElementById("projects-list").offsetTop, behavior: "smooth" });
}

// Inicializar todo al cargar
document.addEventListener("DOMContentLoaded", async () => {
  console.log("🚀 Script iniciado...");

  const path = window.location.pathname;

  await loadComponent("header-container", "components/header.html");
  await loadComponent("hero-container", "components/hero.html");
  await loadComponent("contact-container", "components/contact.html");
  await loadComponent("footer-container", "components/footer.html");

  // Inicializar menú hamburguesa cuando el header esté listo
  const observer = new MutationObserver(() => {
    if (document.querySelector(".menu-toggle")) {
      initializeMenuToggle();
      observer.disconnect();
    }
  });
  observer.observe(document.getElementById("header-container"), { childList: true });

  if (path === "/cv") {
    await loadComponent("cv-container", "components/cv-content.html");

    // Ocultar todo lo demás
    ["benefits-container", "services-container", "projects-container"]
      .forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = "none";
      });

  }else if (path === "/conocenos") {
    await loadComponent("conocenos-container", "components/conocenos-content.html");
  
    ["benefits-container", "services-container", "projects-container", "cv-container"]
      .forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = "none";
      });
  
  } else {
    // Página normal
    await loadComponent("benefits-container", "components/benefits.html");
    await loadComponent("services-container", "components/services.html");
    await loadComponent("projects-container", "components/projects.html");
  }

  // Comprobación por parámetro ?case=
  const caseName = new URLSearchParams(window.location.search).get("case");
  if (caseName) loadCaseStudy(caseName);

  // Delegación de eventos global
  document.addEventListener("click", (event) => {
    if (event.target.classList.contains("view-case")) {
      event.preventDefault();
      const caseName = new URL(event.target.href).searchParams.get("case");
      loadCaseStudy(caseName);
    }
    if (event.target.id === "close-case-study") {
      closeCaseStudy();
    }
  });

// EmailJS
const contactForm = document.getElementById("contact-form");
if (contactForm) {
  emailjs.init("z1S6y48MZ5PIPDneM");

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
      .then(() => {
        alert("¡Gracias por tu mensaje!");
        contactForm.reset();
      })
      .catch(() => {
        alert("Hubo un error. Intenta más tarde.");
      });
  });
}
initializeMenuToggle(); 
initializeMenuLinks();
ajustarEspaciadoPorHeader();
});