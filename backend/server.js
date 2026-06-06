  
const express = require("express")
const cors = require("cors")
const db = require("./database")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const app = express()
const SECRET = "supersecretkey123"

app.use(cors())
app.use(express.json())

// ---------------- POSTS ----------------

app.get("/posts", (req, res) => {
  db.all("SELECT * FROM posts", (err, rows) => {
    if (err) {
      return res.status(500).json(err)
    }
    res.json(rows)
  })
})

app.post("/posts", verifyToken, (req, res) => {
  const { id, text, image, liked } = req.body

  const userid = req.body.id

  db.run(
    "INSERT INTO posts (userid, id, text, image, liked) VALUES (?, ?, ?, ?, ?)",
    [userid, id, text, image, liked ? 1 : 0],
    (err) => {
      if (err) {
        return res.status(500).json(err)
      }

      res.json({ id, text, image, liked })
    }
  )
})

app.delete("/posts/:id", verifyToken, (req, res) => {

  const userid = req.body.id

  const postid = req.params.id
 
  if (userid === id){
  db.run(
    "DELETE FROM posts WHERE id = ?",
    [id],
    (err) => {
      if (err) {
        return res.status(500).json(err)
      }

      res.json({ message: "Post gelöscht" })
    }
  )
}})

// ---------------- REGISTER ----------------

app.post("/register", (req, res) => {
  const { email, password } = req.body

  db.get(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, user) => {
      if (err) {
        return res.status(500).json(err)
      }

      if (user) {
        return res.json({ message: "Email existiert bereits" })
      }

      const hashedPassword = await bcrypt.hash(password, 10)

      db.run(
        "INSERT INTO users (email, password) VALUES (?, ?)",
        [email, hashedPassword],
        (err) => {
          if (err) {
            return res.status(500).json(err)
          }

          res.json({ message: "User erstellt" })
        }
      )
    }
  )
})

// ---------------- LOGIN ----------------

app.post("/login", (req, res) => {
  const { email, password } = req.body

  db.get(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, user) => {
      if (err) {
        return res.status(500).json(err)
      }

      if (!user) {
        return res.json({ message: "User nicht gefunden" })
      }

      const match = await bcrypt.compare(password, user.password)

      if (!match) {
        return res.json({ message: "Falsches Passwort" })
      }

      const token = jwt.sign(
        { id: user.id, email: user.email },
        SECRET,
        { expiresIn: "1h" }
      )

      res.json({
        message: "Login erfolgreich",
        token: token
      })
    }
  )
})

app.put("/posts/:id", verifyToken, (req, res) => {

  const postid = req.params.id
  const {text, image} = req.body

  db.get("SELECT * FROM posts where id = ?",
  [postid],
  (err, post) => {

    if (post.userid !== req.user.id) {

      return res.status(403).json({
        message: "keine berechtigung"
      })
    }

    db.run("UPDATE posts set text = ?, image = ?, where id = ?",
      [text, image, postid],
      (err) => {

        if (err) {
          return res.status(500).json(err)
        }

        res.json({message: "post aktualisiert"})
      }
    )
  }
  )
})

// ---------------- MIDDLEWARE ----------------

function verifyToken(req, res, next) {
  const token = req.headers.authorization

  if (!token) {
    return res.status(401).json({ message: "kein token" })
  }

  try {
    const decoded = jwt.verify(token, SECRET)
    req.user = decoded
    next()
  } catch (err) {
    return res.status(401).json({ message: "Token ungültig" })
  }
}

// ---------------- START SERVER ----------------

app.listen(5000, () => {
  console.log("SERVER LÄUFT")
})