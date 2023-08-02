import express from "express"
const app = express()
import userRoutes from "./routes/users.js"
import postRoutes from "./routes/posts.js"
import commentRoutes from "./routes/comments.js"
import likeRoutes from "./routes/likes.js"
import storyRoutes from "./routes/stories.js"
import authRoutes from "./routes/auth.js"
import cookieParser from "cookie-parser"
import cors from "cors"
import multer from "multer"
import relationshipsRoutes from "./routes/relationships.js"

//middlewares
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Credentials", true) //solve "Access-Control-Allow-Origin"
    next()
})
app.use(express.json())
app.use(cors(
    { origin: "http://localhost:3000", }
))
app.use(cookieParser())

//multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '../client/public/upload')
    },
    filename: function (req, file, cb) {

        cb(null, Date.now() + file.originalname) //unique file name
    }
})

const upload = multer({ storage: storage })

app.post("/api/upload", upload.single("file"), (req, res) => {
    const file = req.file;
    res.status(200).json(file.filename)
})
app.use("/api/users", userRoutes)
app.use("/api/posts", postRoutes)
app.use("/api/comments", commentRoutes)
app.use("/api/likes", likeRoutes)
app.use("/api/stories", storyRoutes)
app.use("/api/auth", authRoutes)
app.use("/api/relationships", relationshipsRoutes)




app.listen(8800, () => {
    console.log("API Working")
})