const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

/* =====================================================
   MIDDLEWARES
===================================================== */

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

/* =====================================================
   ESQUEMA Y MODELO DE ALUMNOS
===================================================== */

const alumnoSchema = new mongoose.Schema(
    {
        nombre: {
            type: String,
            required: true,
            trim: true
        },
        carrera: {
            type: String,
            required: true,
            trim: true
        },
        semestre: {
            type: Number,
            required: true,
            min: 1
        }
    },
    {
        timestamps: true
    }
);

const Alumno = mongoose.model(
    "Alumno",
    alumnoSchema,
    "alumnos"
);

/* =====================================================
   ESQUEMA Y MODELO DE PELÍCULAS
===================================================== */

/*
    strict: false permite leer todos los campos que
    ya existen en la colección "peliculas".
*/
const peliculaSchema = new mongoose.Schema(
    {},
    {
        strict: false,
        timestamps: true
    }
);

const Pelicula = mongoose.model(
    "Pelicula",
    peliculaSchema,
    "peliculas"
);

/* =====================================================
   CRUD DE PELÍCULAS
===================================================== */

/*
    OBTENER TODAS LAS PELÍCULAS
    GET /peliculas
*/
app.get("/peliculas", async (req, res) => {
    try {
        const peliculas = await Pelicula.find()
            .sort({ titulo: 1 });

        res.json({
            cantidad: peliculas.length,
            peliculas: peliculas
        });

    } catch (error) {
        console.error(
            "ERROR AL OBTENER PELÍCULAS:",
            error
        );

        res.status(500).json({
            mensaje: "Error al obtener las películas",
            error: error.message
        });
    }
});

/*
    GUARDAR UNA PELÍCULA
    POST /peliculas
*/
app.post("/peliculas", async (req, res) => {
    try {
        const {
            titulo,
            genero,
            año,
            duracion,
            idioma,
            calificacion
        } = req.body;

        if (
            !titulo ||
            !genero ||
            año === undefined ||
            duracion === undefined ||
            !idioma ||
            calificacion === undefined
        ) {
            return res.status(400).json({
                mensaje: "Faltan datos de la película"
            });
        }

        if (
            Number(calificacion) < 0 ||
            Number(calificacion) > 10
        ) {
            return res.status(400).json({
                mensaje:
                    "La calificación debe estar entre 0 y 10"
            });
        }

        const nuevaPelicula = new Pelicula({
            titulo: titulo.trim(),
            genero: genero.trim(),
            año: Number(año),
            duracion: Number(duracion),
            idioma: idioma.trim(),
            calificacion: Number(calificacion),
            nc: "22400595"
        });

        const peliculaGuardada =
            await nuevaPelicula.save();

        res.status(201).json({
            mensaje: "Película guardada correctamente",
            pelicula: peliculaGuardada
        });

    } catch (error) {
        console.error(
            "ERROR AL GUARDAR PELÍCULA:",
            error
        );

        res.status(500).json({
            mensaje: "Error al guardar la película",
            error: error.message
        });
    }
});

/* =====================================================
   CRUD DE ALUMNOS
===================================================== */

/*
    CREAR UN ALUMNO
    POST /alumnos
*/
app.post("/alumnos", async (req, res) => {
    try {
        const {
            nombre,
            carrera,
            semestre
        } = req.body;

        if (
            !nombre ||
            !carrera ||
            semestre === undefined
        ) {
            return res.status(400).json({
                mensaje: "Faltan datos del alumno"
            });
        }

        const nuevoAlumno = new Alumno({
            nombre,
            carrera,
            semestre
        });

        const alumnoGuardado =
            await nuevoAlumno.save();

        res.status(201).json({
            mensaje: "Alumno registrado correctamente",
            alumno: alumnoGuardado
        });

    } catch (error) {
        console.error(
            "ERROR AL GUARDAR ALUMNO:",
            error
        );

        res.status(500).json({
            mensaje: "Error al guardar alumno",
            error: error.message
        });
    }
});

/*
    OBTENER TODOS LOS ALUMNOS
    GET /alumnos
*/
app.get("/alumnos", async (req, res) => {
    try {
        const alumnos = await Alumno.find();

        res.json({
            cantidad: alumnos.length,
            alumnos: alumnos
        });

    } catch (error) {
        console.error(
            "ERROR AL OBTENER ALUMNOS:",
            error
        );

        res.status(500).json({
            mensaje: "Error al obtener los alumnos",
            error: error.message
        });
    }
});

/*
    OBTENER UN ALUMNO POR ID
    GET /alumnos/:id
*/
app.get("/alumnos/:id", async (req, res) => {
    try {
        const id = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                mensaje:
                    "El ID proporcionado no es válido"
            });
        }

        const alumno = await Alumno.findById(id);

        if (!alumno) {
            return res.status(404).json({
                mensaje: "Alumno no encontrado"
            });
        }

        res.json(alumno);

    } catch (error) {
        console.error(
            "ERROR AL OBTENER ALUMNO:",
            error
        );

        res.status(500).json({
            mensaje: "Error al obtener alumno",
            error: error.message
        });
    }
});

/*
    ACTUALIZAR UN ALUMNO
    PUT /alumnos/:id
*/
app.put("/alumnos/:id", async (req, res) => {
    try {
        const id = req.params.id;

        const {
            nombre,
            carrera,
            semestre
        } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                mensaje:
                    "El ID proporcionado no es válido"
            });
        }

        if (
            !nombre ||
            !carrera ||
            semestre === undefined
        ) {
            return res.status(400).json({
                mensaje: "Faltan datos del alumno"
            });
        }

        const alumnoActualizado =
            await Alumno.findByIdAndUpdate(
                id,
                {
                    nombre,
                    carrera,
                    semestre
                },
                {
                    new: true,
                    runValidators: true
                }
            );

        if (!alumnoActualizado) {
            return res.status(404).json({
                mensaje: "Alumno no encontrado"
            });
        }

        res.json({
            mensaje:
                "Alumno actualizado correctamente",
            alumno: alumnoActualizado
        });

    } catch (error) {
        console.error(
            "ERROR AL ACTUALIZAR ALUMNO:",
            error
        );

        res.status(500).json({
            mensaje: "Error al actualizar alumno",
            error: error.message
        });
    }
});

/*
    ELIMINAR UN ALUMNO
    DELETE /alumnos/:id
*/
app.delete("/alumnos/:id", async (req, res) => {
    try {
        const id = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                mensaje:
                    "El ID proporcionado no es válido"
            });
        }

        const alumnoEliminado =
            await Alumno.findByIdAndDelete(id);

        if (!alumnoEliminado) {
            return res.status(404).json({
                mensaje: "Alumno no encontrado"
            });
        }

        res.json({
            mensaje: "Alumno eliminado correctamente",
            alumno: alumnoEliminado
        });

    } catch (error) {
        console.error(
            "ERROR AL ELIMINAR ALUMNO:",
            error
        );

        res.status(500).json({
            mensaje: "Error al eliminar alumno",
            error: error.message
        });
    }
});

/* =====================================================
   OTRAS RUTAS
===================================================== */

app.get("/", (req, res) => {
    res.send("HOLA MUNDO");
});

app.get("/mensaje", (req, res) => {
    res.send("MENSAJE DESDE EXPRESS");
});

app.get("/pagina", (req, res) => {
    const nombre = "HELLO ESMERALDA";

    res.send(`
        <style>
            .p1 {
                color: red;
                background: pink;
            }
        </style>

        <h1>Mi página web</h1>
        <p class="p1">Creada con Express</p>
        <p>${nombre}</p>
    `);
});

app.get("/alumno", (req, res) => {
    res.json({
        nombre: "Esme",
        carrera: "ISC",
        semestre: 9,
        id: 1
    });
});

app.get("/materias", (req, res) => {
    res.json([
        {
            nombre: "NOSQL",
            hora: "8:00 am - 11:00 am"
        },
        {
            nombre: "PW",
            hora: "2:00 pm - 5:00 pm"
        }
    ]);
});

app.get("/mensaje/:nombre", (req, res) => {
    res.send(`Hola ${req.params.nombre}`);
});

app.get("/suma/:a/:b", (req, res) => {
    const a = Number(req.params.a);
    const b = Number(req.params.b);

    res.send(`Resultado: ${a + b}`);
});

app.get("/multiplicar/:a/:b", (req, res) => {
    const a = Number(req.params.a);
    const b = Number(req.params.b);

    res.send(`Resultado: ${a * b}`);
});

app.get("/aleatorio", (req, res) => {
    const numero =
        Math.floor(Math.random() * 100) + 1;

    res.send(`Número generado: ${numero}`);
});

/* =====================================================
   RUTA 404
   SIEMPRE DEBE IR DESPUÉS DE TODAS LAS RUTAS
===================================================== */

app.use((req, res) => {
    res.status(404).json({
        mensaje: "Ruta no encontrada"
    });
});

/* =====================================================
   CONEXIÓN A MONGODB
===================================================== */

async function iniciarServidor() {
    try {
        await mongoose.connect(
            process.env.MONGODB_URI ||
            "mongodb://127.0.0.1:27017/netflix"
        );

        console.log(
            "CONECTADO CORRECTAMENTE A MONGODB"
        );

        app.listen(PORT, () => {
            console.log(
                `Servidor iniciado en el puerto ${PORT}`
            );
        });

    } catch (error) {
        console.error(
            "ERROR AL CONECTAR CON MONGODB:",
            error.message
        );
    }
}

iniciarServidor();