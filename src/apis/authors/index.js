import express from "express";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import uniqid from "uniqid";

const authorsRouter = express.Router();

const authorsJSONPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "authors.json"
);

authorsRouter.post("/", (req, res) => {
  const newAuthor = { ...req.body, createdAt: new Date(), id: uniqid() };
  const authorsArray = JSON.parse(fs.readFileSync(authorsJSONPath));
  authorsArray.push(newAuthor);
  fs.writeFileSync(authorsJSONPath, JSON.stringify(authorsArray));
  res.status(201).send(newAuthor);
});

authorsRouter.get("/", (req,res)=>{
    const fileContent = fs.readFileSync(authorsJSONPath)
    const authorsArray = JSON.parse(fileContent)
    res.send(authorsArray)
})

authorsRouter.get("/:authorsId", (req, res)=> {
    const authorID = req.params.authorsId

    const authorsArray = JSON.parse(fs.readFileSync(authorsJSONPath))

    const foundAuthor = authorsArray.find(current => current.id === authorID)

    res.send(foundAuthor)
})

authorsRouter.put("/:authorsId", (req, res)=>{
    const authorsArray = JSON.parse(fs.readFileSync(authorsJSONPath))
    const index = authorsArray.findIndex( author => author.id === req.params.authorsId)
    const oldAuthor = authorsArray[index]
    const updatedAuthor = {...oldAuthor, ...req.body, updatedAt: new Date()}
    authorsArray[index] = updatedAuthor
    fs.writeFileSync(authorsJSONPath, JSON.stringify(authorsArray))
    res.send(updatedAuthor)
})

authorsRouter.delete("/:authorsId", (req, res)=> {
    const authorsArray = JSON.parse(fs.readFileSync(authorsJSONPath))
    const remainingAuthors = authorsArray.filter(current => current.id !== req.params.authorsId)
    fs.writeFileSync(authorsJSONPath, JSON.stringify(remainingAuthors))
    res.status(204).send()
})


export default authorsRouter;
