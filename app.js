const express = require('express');
require("dotenv").config();
require("./src/config/databaseConnection")
const port = process.env.PORT || 5002
const router = require("./src/routes")
const {errorHandler} = require("./src/middleware/errorMiddleware")

const app = express()
app.use(express.json())
app.use(express.urlencoded({extended : false}))

app.use("/api", router)
app.get("/", (req, res) => {
    res.json({
      message: "Hoş geldiniz",
    });
  });

app.use(errorHandler) // otherwise errors returns like html code

app.listen(port, () => console.log(`server started on port ${port}`));