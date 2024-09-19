import express from "express";
import cors from "cors";
import pkg from "pg";

const { Pool } = pkg;
const app = express();
const port = 3001; //

// Habilitar CORS
app.use(cors());
app.use(express.json());

// conexión a la base de datos
const pool = new Pool({
  user: "williamscamacaro",
  host: "localhost",
  database: "likeme",
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

// Ruta PUT para actualizar un post existente
app.put("/posts/:id", async (req, res) => {
  const { id } = req.params;
  const { titulo, img, descripcion, likes } = req.body;
  try {
    const result = await pool.query(
      "UPDATE posts SET titulo = $1, img = $2, descripcion = $3, likes = $4 WHERE id = $5 RETURNING *",
      [titulo, img, descripcion, likes, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).send("Post no encontrado");
    }
    console.log(`Post con ID ${id} actualizado correctamente.`);
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error en el servidor al actualizar el post:", err);
    res.status(500).send("Error en el servidor");
  }
});

// Ruta PUT para incrementar los likes de un post
app.put("/posts/like/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "UPDATE posts SET likes = likes + 1 WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).send("Post no encontrado");
    }
    console.log(`Likes del post con ID ${id} incrementados.`);
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error en el servidor al incrementar los likes:", err);
    res.status(500).send("Error en el servidor");
  }
});

// Ruta DELETE para eliminar un post existente
app.delete("/posts/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM posts WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).send("Post no encontrado");
    }
    console.log(`Post con ID ${id} eliminado correctamente.`);
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error en el servidor al eliminar el post:", err);
    res.status(500).send("Error en el servidor");
  }
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
