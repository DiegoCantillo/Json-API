const express = require('express');
const path = require('path');
const fs = require('fs/promises');

const app = express();

app.use(express.json())

const jsonPath = path.resolve('./file/todos.json');

app.get('/todos', async(req, res)=> {
    const jsonFile = await fs.readFile(jsonPath, ('utf-8'));
    res.send(jsonFile);
});

app.post('/todos', async (req, res) => {
    const todo =  req.body;
    const todoArray = JSON.parse(await fs.readFile(jsonPath, 'utf-8'));
    const index = todoArray.length - 1;
    const id = todoArray[index].id + 1;
    todoArray.push({...todo, id: id});
    await fs.writeFile(jsonPath, JSON.stringify(todoArray))
    res.end(); 
})

app.put('/todos',async (req, res) => {
    const todoArray = JSON.parse(await fs.readFile(jsonPath, 'utf-8'));
    const { status, id } = req.body;
    const todoIndex = todoArray.findIndex(todo => todo.id === id);
    if(todoIndex >= 0){
        todoArray[todoIndex].status = status;
    }
    await fs.writeFile(jsonPath, JSON.stringify(todoArray));
    res.send()
})

app.delete('/todos', async (req, res) => {
    const todoArray = JSON.parse( await fs.readFile(jsonPath, 'utf-8'));
    const {id} = req.body;
    const indexTodoDelete = todoArray.findIndex(todo => todo.id === id);
    todoArray.splice(indexTodoDelete, 1);
    await fs.writeFile(jsonPath, JSON.stringify(todoArray));
    res.end();
})

const PORT = 8000;

app.listen(PORT, () => {
    console.log(`servidor escuchando en el puerto ${PORT}`);
});

