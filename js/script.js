
const lenguaje = document.getElementById("lenguaje");
const botonBuscar = document.getElementById("buscar");
const botonRefrescar = document.getElementById("refrescar");
const mensaje = document.getElementById("mensaje");
const resultado = document.getElementById("resultado");

async function buscarRepositorio() {

    const lenguajeSeleccionado = lenguaje.value;

    if (lenguajeSeleccionado === "") {
        mensaje.textContent = "Por favor, selecciona un lenguaje.";
        resultado.innerHTML = "";
        botonRefrescar.classList.add("oculto");
        return;
    }

    mensaje.textContent = "Buscando repositorio...";
    resultado.innerHTML = "";
    botonBuscar.disabled = true;
    botonRefrescar.disabled = true;
    botonRefrescar.classList.add("oculto");

    try {

        const url = `https://api.github.com/search/repositories?q=language:${encodeURIComponent(lenguajeSeleccionado)}&sort=stars&order=desc&per_page=100`;

        const respuesta = await fetch(url);

        if (!respuesta.ok) {
            const datosError = await respuesta.json();
            throw new Error(datosError.message || "Error al consultar GitHub.");
        }

        const datos = await respuesta.json();

        if (!datos.items || datos.items.length === 0) {
            mensaje.textContent = "No se encontraron repositorios.";
            return;
        }

        const numeroAleatorio = Math.floor(Math.random() * datos.items.length);

        const repositorio = datos.items[numeroAleatorio];

        mensaje.textContent = "";

        const tarjeta = document.createElement("div");
        tarjeta.classList.add("tarjeta");

        const nombre = document.createElement("h3");

        const enlace = document.createElement("a");
        enlace.textContent = repositorio.full_name;
        enlace.href = repositorio.html_url;
        enlace.target = "_blank";
        enlace.rel = "noopener noreferrer";

        nombre.appendChild(enlace);

        const descripcion = document.createElement("p");
        descripcion.textContent = repositorio.description || "Este repositorio no tiene descripción.";

        const estadisticas = document.createElement("div");
        estadisticas.classList.add("estadisticas");

        const estrellas = document.createElement("span");
        estrellas.textContent = "⭐ Estrellas: " + repositorio.stargazers_count;

        const forks = document.createElement("span");
        forks.textContent = "🍴 Forks: " + repositorio.forks_count;

        const issues = document.createElement("span");
        issues.textContent = "❗ Issues: " + repositorio.open_issues_count;

        estadisticas.appendChild(estrellas);
        estadisticas.appendChild(forks);
        estadisticas.appendChild(issues);

        tarjeta.appendChild(nombre);
        tarjeta.appendChild(descripcion);
        tarjeta.appendChild(estadisticas);

        resultado.appendChild(tarjeta);

        botonRefrescar.classList.remove("oculto");

    } catch (error) {

        mensaje.textContent = "Error: " + error.message;
        console.error(error);

    } finally {

        botonBuscar.disabled = false;
        botonRefrescar.disabled = false;

    }

}

botonBuscar.addEventListener("click", buscarRepositorio);

botonRefrescar.addEventListener("click", buscarRepositorio);
