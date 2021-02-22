import express from "express";

const app = express();

app.get("/", (request, response) => response.json({message: "Hello, world! NLW04"}));
app.post("/", (request, response) => response.json({message: "Os dados foram salvos!"}));

app.listen(3000, () => console.log("Server is running!"));