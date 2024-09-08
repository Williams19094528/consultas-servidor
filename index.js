import express from "express";
import cors from "cors";
import pkg from "pg";

const { Pool } = pkg;
const app = express();
const port = 3001; // Cambiado a 3001

// Habilitar CORS
app.use(cors());
app.use(express.json());

// Configurar conexión a la base de datos
const pool = new Pool({
  user: "williamscamacaro",
  host: "localhost",
  database: "likeme",
  password: "tu_contraseña",
  port: 5432,
});

// Ruta GET para obtener todos los posts
app.get("/posts", async (req, res) => {
  console.log("Solicitud GET recibida para obtener los posts");
  try {
    const result = await pool.query("SELECT * FROM posts");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error en el servidor");
  }
});

// Ruta POST para agregar un nuevo post
app.post("/posts", async (req, res) => {
  console.log("Datos recibidos en la solicitud POST:", req.body);
  const { titulo, img, descripcion, likes } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO posts (titulo, img, descripcion, likes) VALUES ($1, $2, $3, $4) RETURNING *",
      [titulo, img, descripcion, likes]
    );
    console.log("Post agregado a la base de datos:", result.rows[0]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error en el servidor al agregar el post:", err);
    res.status(500).send("Error en el servidor");
  }
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
