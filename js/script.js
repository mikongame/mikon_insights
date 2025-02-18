function loadComponent(containerId, filePath) {
  fetch(filePath)
      .then(response => response.text())
      .then(data => {
          document.getElementById(containerId).innerHTML = data;
      })
      .catch(error => console.error("Error cargando el componente:", error));
}

document.addEventListener("DOMContentLoaded", () => {
  // Cargar componentes generales
  loadComponent("header-container", "components/header.html");
  loadComponent("hero-container", "components/hero.html");
  loadComponent("benefits-container", "components/benefits.html");
  loadComponent("services-container", "components/services.html");
  loadComponent("projects-container", "components/projects.html");
  loadComponent("contact-container", "components/contact.html");
  loadComponent("footer-container", "components/footer.html");

  // Manejar clics en los botones de "Leer más"
  document.addEventListener("click", function (event) {
      if (event.target.classList.contains("view-case")) {
          const caseName = event.target.closest(".project").getAttribute("data-case");
          loadCaseStudy(caseName);
      }

      if (event.target.id === "close-case-study") {
          closeCaseStudy();
      }
  });
});

function loadCaseStudy(caseName) {
  fetch(`components/cases/${caseName}.html`)
      .then(response => response.text())
      .then(data => {
          const projectsList = document.getElementById("projects-list");
          const caseStudySection = document.getElementById("case-study-content");

          projectsList.style.display = "none"; // Ocultar lista de proyectos
          caseStudySection.innerHTML = `<button id="close-case-study">⬅ Volver</button>` + data;
          caseStudySection.classList.remove("hidden");

          window.scrollTo({ top: caseStudySection.offsetTop, behavior: "smooth" });
      })
      .catch(error => console.error("Error cargando el caso de estudio:", error));
}

function closeCaseStudy() {
  const projectsList = document.getElementById("projects-list");
  const caseStudySection = document.getElementById("case-study-content");

  caseStudySection.classList.add("hidden");
  caseStudySection.innerHTML = ""; // Limpiar contenido del caso de estudio
  projectsList.style.display = "flex"; // Volver a mostrar la lista de proyectos correctamente
  projectsList.style.flexWrap = "wrap"; // Mantener distribución original

  window.scrollTo({ top: projectsList.offsetTop, behavior: "smooth" });
}




document.querySelector("form").addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.querySelector("input[type='text']").value;
  const email = document.querySelector("input[type='email']").value;
  const message = document.querySelector("textarea").value;

  if (name && email && message) {
      alert("¡Gracias por contactarnos! Nos pondremos en contacto pronto.");
  } else {
      alert("Por favor, completa todos los campos.");
  }
});
