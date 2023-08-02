import mysql from "mysql"

//connect to mysql
export const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "liuyaxin",
    database: "socialapp",
})