/*
    Obtener elementos del HTML
*/
const formulario = document.getElementById("formulario");

const titulo = document.getElementById("titulo");
const genero = document.getElementById("genero");
const año = document.getElementById("año");
const duracion = document.getElementById("duracion");
const idioma = document.getElementById("idioma");
const calificacion = document.getElementById("calificacion");
const portada = document.getElementById("portada");

const btnGuardar = document.getElementById("btnGuardar");
const btnConsultar = document.getElementById("btnConsultar");
const listaPeliculas = document.getElementById("listaPeliculas");

/*
    Crear una tarjeta para cada película
*/
function crearTarjetaPelicula(pelicula) {
    const tarjeta = document.createElement("li");

    /*
        Crear la imagen de la portada
    */
    const imagen = document.createElement("img");

    imagen.classList.add("pelicula-portada");

    imagen.src = pelicula.portada;

    imagen.alt =
        `Portada de ${pelicula.titulo}`;

    imagen.loading = "lazy";

    /*
        Si la URL de la portada no funciona,
        se elimina la imagen y se muestra
        el diseño alternativo.
    */
    imagen.addEventListener("error", () => {
        imagen.remove();

        tarjeta.classList.add("sin-portada");
    });

    /*
        Crear el contenedor de información
    */
    const informacion = document.createElement("div");

    informacion.classList.add("pelicula-info");

    /*
        Título
    */
    const nombre = document.createElement("h3");

    nombre.textContent =
        pelicula.titulo || "Sin título";

    /*
        Género y año
    */
    const datosPrincipales =
        document.createElement("p");

    datosPrincipales.classList.add(
        "datos-principales"
    );

    datosPrincipales.textContent =
        `${pelicula.genero || "Sin género"} • ` +
        `${pelicula.año || "Año desconocido"}`;

    /*
        Duración e idioma
    */
    const detalles = document.createElement("p");

    detalles.classList.add("detalles");

    const textoDuracion = pelicula.duracion
        ? `${pelicula.duracion} minutos`
        : "Duración desconocida";

    const textoIdioma =
        pelicula.idioma || "Idioma desconocido";

    detalles.textContent =
        `${textoDuracion} • ${textoIdioma}`;

    /*
        Calificación
    */
    const puntuacion = document.createElement("span");

    puntuacion.classList.add("puntuacion");

    const numeroCalificacion =
        Number(pelicula.calificacion || 0);

    puntuacion.textContent =
        `★ ${numeroCalificacion.toFixed(1)}`;

    /*
        Agregar información a la tarjeta
    */
    informacion.appendChild(nombre);
    informacion.appendChild(datosPrincipales);
    informacion.appendChild(detalles);
    informacion.appendChild(puntuacion);

    /*
        Agregar imagen e información
    */
    tarjeta.appendChild(imagen);
    tarjeta.appendChild(informacion);

    return tarjeta;
}

/*
    Consultar y mostrar películas
*/
async function mostrarPeliculas() {
    listaPeliculas.innerHTML = `
        <li class="mensaje mensaje-carga">
            Consultando películas...
        </li>
    `;

    btnConsultar.disabled = true;
    btnConsultar.textContent = "Consultando...";

    try {
        const respuesta =
            await obtenerPeliculas();

        /*
            La API devuelve la lista dentro
            de la propiedad peliculas.
        */
        const peliculas =
            respuesta.peliculas || [];

        listaPeliculas.innerHTML = "";

        /*
            Comprobar que existan películas
        */
        if (peliculas.length === 0) {
            listaPeliculas.innerHTML = `
                <li class="mensaje">
                    No hay películas registradas.
                </li>
            `;

            return;
        }

        peliculas.forEach((pelicula) => {
            const tarjeta =
                crearTarjetaPelicula(pelicula);

            listaPeliculas.appendChild(tarjeta);
        });

    } catch (error) {
        listaPeliculas.innerHTML = "";

        const mensajeError =
            document.createElement("li");

        mensajeError.classList.add(
            "mensaje",
            "mensaje-error"
        );

        mensajeError.textContent =
            error.message;

        listaPeliculas.appendChild(
            mensajeError
        );

        console.error(error);

    } finally {
        btnConsultar.disabled = false;

        btnConsultar.textContent =
            "Consultar películas";
    }
}

/*
    Registrar una película
*/
formulario.addEventListener(
    "submit",
    async (evento) => {
        evento.preventDefault();

        /*
            Crear el objeto que se enviará
            a la API.
        */
        const pelicula = {
            titulo: titulo.value.trim(),

            genero: genero.value.trim(),

            año: Number(año.value),

            duracion: Number(
                duracion.value
            ),

            idioma: idioma.value.trim(),

            calificacion: Number(
                calificacion.value
            ),

            /*
                Esta es la propiedad correcta
                utilizada por la API.
            */
            portada: portada.value.trim()
        };

        btnGuardar.disabled = true;

        btnGuardar.textContent =
            "Guardando película...";

        try {
            const respuesta =
                await agregarPelicula(
                    pelicula
                );

            alert(
                respuesta.mensaje ||
                "Película registrada correctamente"
            );

            formulario.reset();

            /*
                Actualizar el catálogo después
                de guardar.
            */
            await mostrarPeliculas();

        } catch (error) {
            alert(error.message);

            console.error(error);

        } finally {
            btnGuardar.disabled = false;

            btnGuardar.textContent =
                "Guardar película";
        }
    }
);

/*
    Consultar usando el botón
*/
btnConsultar.addEventListener(
    "click",
    mostrarPeliculas
);

/*
    Mostrar películas automáticamente
    cuando se abre la página.
*/
mostrarPeliculas();