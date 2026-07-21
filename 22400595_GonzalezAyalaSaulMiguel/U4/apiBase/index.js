const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");

const app = express();
const PORT = 3000;

// Middlewares
app.use(express.json());
app.use(morgan("dev"));

/* =====================================================
   ESQUEMA Y MODELO DE MONGODB
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
   RUTAS CRUD DE ALUMNOS
===================================================== */

/*
    CREAR UN ALUMNO
    POST http://localhost:3000/alumnos
*/
app.post("/alumnos", async (req, res) => {
    try {
        const { nombre, carrera, semestre } = req.body;

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

        const alumnoGuardado = await nuevoAlumno.save();

        res.status(201).json({
            mensaje: "Alumno registrado correctamente",
            alumno: alumnoGuardado
        });

    } catch (error) {
        console.error("ERROR AL GUARDAR:", error);

        res.status(500).json({
            mensaje: "Error al guardar alumno",
            error: error.message
        });
    }
});

/*
    OBTENER TODOS LOS ALUMNOS
    GET http://localhost:3000/alumnos
*/
app.get("/alumnos", async (req, res) => {
    try {
        const alumnos = await Alumno.find();

        res.json({
            cantidad: alumnos.length,
            alumnos: alumnos
        });

    } catch (error) {
        console.error("ERROR AL OBTENER ALUMNOS:", error);

        res.status(500).json({
            mensaje: "Error al obtener los alumnos",
            error: error.message
        });
    }
});

/*
    OBTENER UN ALUMNO POR ID
    GET http://localhost:3000/alumnos/ID
*/
app.get("/alumnos/:id", async (req, res) => {
    try {
        const id = req.params.id;

        // Verifica que el ID tenga formato válido de MongoDB
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                mensaje: "El ID proporcionado no es válido"
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
        console.error("ERROR AL OBTENER ALUMNO:", error);

        res.status(500).json({
            mensaje: "Error al obtener alumno",
            error: error.message
        });
    }
});

/*
    ACTUALIZAR UN ALUMNO
    PUT http://localhost:3000/alumnos/ID
*/
app.put("/alumnos/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const { nombre, carrera, semestre } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                mensaje: "El ID proporcionado no es válido"
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
            mensaje: "Alumno actualizado correctamente",
            alumno: alumnoActualizado
        });

    } catch (error) {
        console.error("ERROR AL ACTUALIZAR:", error);

        res.status(500).json({
            mensaje: "Error al actualizar alumno",
            error: error.message
        });
    }
});

/*
    ELIMINAR UN ALUMNO
    DELETE http://localhost:3000/alumnos/ID
*/
app.delete("/alumnos/:id", async (req, res) => {
    try {
        const id = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                mensaje: "El ID proporcionado no es válido"
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
        console.error("ERROR AL ELIMINAR:", error);

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
    const numero = Math.floor(Math.random() * 100) + 1;

    res.send(`Número generado: ${numero}`);
});

/* =====================================================
   RUTA PARA DIRECCIONES NO EXISTENTES
===================================================== */

app.use((req, res) => {
    res.status(404).json({
        mensaje: "Ruta no encontrada"
    });
});

/* =====================================================
   CONEXIÓN A MONGODB E INICIO DEL SERVIDOR
===================================================== */

async function iniciarServidor() {
    try {
        await mongoose.connect(
            "mongodb://127.0.0.1:27017/Escuela"
        );

        console.log("CONECTADO CORRECTAMENTE A MONGODB");

        app.listen(PORT, () => {
            console.log(
                `Servidor iniciado en http://localhost:${PORT}`
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