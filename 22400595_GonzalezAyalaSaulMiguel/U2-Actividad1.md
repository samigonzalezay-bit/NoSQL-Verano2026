# U2 - Actividad 1

**Alumno:** Saul Miguel Gonzalez Ayala
**No. Control:** 22400595
**Base de datos:** `biblioteca`

---

## Consultas

### 1. Mostrar todos los libros publicados despues del año 2022.

```js
db["libros"].find({ "año": { $gt: 2022 } })
```

### 2. Mostrar los usuarios cuya edad sea mayor o igual a 21 años.

```js
db["usuarios"].find({ "edad": { $gte: 21 } })
```

### 3. Mostrar los libros con menos de 350 paginas.

```js
db["libros"].find({ "paginas": { $lt: 350 } })
```

### 4. Mostrar los usuarios cuya edad sea menor o igual a 20 años.

```js
db["usuarios"].find({ "edad": { $lte: 20 } })
```

### 5. Mostrar los libros cuya categoria sea diferente de "Programacion".

```js
db["libros"].find({ "categoria": { $ne: "Programacion" } })
```

### 6. Mostrar los usuarios que estudien Ingenieria Informatica y esten en sexto semestre o superior.

```js
db["usuarios"].find({ "carrera": "Ingenieria Informatica", "semestre": { $gte: 6 } })
```

### 7. Mostrar los libros cuya categoria sea Programacion o Bases de Datos.

```js
db["libros"].find({ $or: [ { "categoria": "Programacion" }, { "categoria": "Bases de Datos" } ] })
```

### 8. Mostrar los prestamos que no han sido devueltos y cuya duracion sea mayor a 8 dias.

```js
db["prestamos"].find({ "devuelto": false, "diasPrestamo": { $gt: 8 } })
```

### 9. Mostrar los libros cuyo titulo empiece con la letra M.

```js
db["libros"].find({ "titulo": { $regex: /^M/ } })
```

### 10. Mostrar los usuarios cuyo nombre empiece con la letra A.

```js
db["usuarios"].find({ "nombre": { $regex: /^A/ } })
```

### 11. Mostrar los libros cuyo titulo contenga la palabra "Base".

```js
db["libros"].find({ "titulo": { $regex: /Base/ } })
```

### 12. Mostrar unicamente el nombre y la carrera de todos los usuarios.

```js
db["usuarios"].find({}, { "nombre": 1, "carrera": 1, "_id": 0 })
```

### 13. Mostrar unicamente el titulo y el autor de todos los libros.

```js
db["libros"].find({}, { "titulo": 1, "autor": 1, "_id": 0 })
```

### 14. Mostrar unicamente el usuario y el libro de todos los prestamos.

```js
db["prestamos"].find({}, { "usuario": 1, "libro": 1, "_id": 0 })
```

### 15. Mostrar los libros ordenados por año de publicacion, del mas reciente al mas antiguo.

```js
db["libros"].find().sort({ "año": -1 })
```

### 16. Mostrar los usuarios ordenados alfabeticamente por nombre.

```js
db["usuarios"].find().sort({ "nombre": 1 })
```

### 17. Mostrar los prestamos ordenados por la cantidad de dias de prestamo, del mayor al menor.

```js
db["prestamos"].find().sort({ "diasPrestamo": -1 })
```

### 18. Mostrar unicamente el titulo y el año de los libros publicados a partir de 2022, ordenados del mas reciente al mas antiguo.

```js
db["libros"].find({ "año": { $gte: 2022 } }, { "titulo": 1, "año": 1, "_id": 0 }).sort({ "año": -1 })
```

### 19. Mostrar el nombre y la carrera de los usuarios cuya carrera sea Ingenieria en Sistemas Computacionales o Ingenieria Informatica.

```js
db["usuarios"].find(
  { $or: [ { "carrera": "Ingenieria en Sistemas Computacionales" }, { "carrera": "Ingenieria Informatica" } ] },
  { "nombre": 1, "carrera": 1, "_id": 0 }
)
```

### 20. Mostrar los prestamos no devueltos, ordenados por la cantidad de dias de prestamo de mayor a menor, mostrando unicamente el usuario, el libro y los dias de prestamo.

```js
db["prestamos"].find(
  { "devuelto": false },
  { "usuario": 1, "libro": 1, "diasPrestamo": 1, "_id": 0 }
).sort({ "diasPrestamo": -1 })
```
