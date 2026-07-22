const API_URL = "https://api-netflix-eight.vercel.app";

/*
    Consultar todas las películas
*/
async function obtenerPeliculas() {
    const respuesta = await fetch(
        `${API_URL}/peliculas`
    );

    const datos = await respuesta.json();

    if (!respuesta.ok) {
        throw new Error(
            datos.error ||
            datos.mensaje ||
            "Error al consultar las películas"
        );
    }

    return datos;
}

/*
    Registrar una película
*/
async function agregarPelicula(pelicula) {
    const respuesta = await fetch(
        `${API_URL}/peliculas`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(pelicula)
        }
    );

    const datos = await respuesta.json();

    if (!respuesta.ok) {
        throw new Error(
            datos.error ||
            datos.mensaje ||
            `Error HTTP ${respuesta.status}`
        );
    }

    return datos;
}