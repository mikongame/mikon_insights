function loadComponent(containerId, filePath) {
  fetch(filePath)
      .then(response => response.text())
      .then(data => {
          document.getElementById(containerId).innerHTML = data;
      })
      .catch(error => console.error("Error cargando el componente:", error));
}

document.addEventListener("DOMContentLoaded", () => {
  loadComponent("header-container", "components/header.html");
  loadComponent("hero-container", "components/hero.html");
  loadComponent("benefits-container", "components/benefits.html");
  loadComponent("services-container", "components/services.html");
  loadComponent("projects-container", "components/projects.html");
  loadComponent("contact-container", "components/contact.html");
  loadComponent("footer-container", "components/footer.html");
  loadComponent("case-study-container", "components/case-study.html");
});


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
