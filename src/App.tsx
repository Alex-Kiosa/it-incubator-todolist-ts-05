import React, {useState} from 'react';
import './App.css';
import {Todolist} from './Todolist';
import {v1} from 'uuid';

export type FilterValuesType = "all" | "active" | "completed";

export type TodolistType = {
    id: string
    title: string
    filter: FilterValuesType
}

function App() {
    function removeTodolist(id: string) {
        // засетаем в стейт список тудулистов id которых не равны id удаляемого тудулиста
        setTodolists(todolists.filter(todolist => todolist.id !== id))

        // удалим таски для этого тудулиста из второго стейта, где мы отдельно храним таски
        delete tasksObj[id]

        // засетаем в стейт копию объекта, чтобы React отреагировал перерисовкой
        setTasksObj({...tasksObj})
    }

    function removeTask(todolistId: string, id: string) {
        // достаем нужный массив по todolistId
        const tasks = tasksObj[todolistId]

        // перезапишем в объекте с тасками массив для нужного тудулиста с отфильтрованными тасками
        tasksObj[todolistId] = tasks.filter(t => t.id != id)

        // засетаем в стейт копию объекта, чтобы React отреагировал перерисовкой
        setTasksObj({...tasksObj});
    }

    function addTask(todolistId: string, title: string) {
        // достаем нужный массив по todolistId
        const tasks = tasksObj[todolistId]

        // создаем таску
        const task = {id: v1(), title: title, isDone: false};

        // перезапишем массив тасок в объекте копией, добавив в начало новую таску
        tasksObj[todolistId] = [task, ...tasks];

        // засетаем в стейт копию объекта, чтобы React отреагировал перерисовкой
        setTasksObj({...tasksObj});
    }

    function changeStatus(todolistId: string, taskId: string, isDone: boolean) {
        // достанем из объекта с тасками массив по todolistId
        let tasks = tasksObj[todolistId]

        // ищем нужную таску в массиве
        let task = tasks.find(t => t.id === taskId);

        // если таска найдена, поменяем статус таски и засетаем в стейт копию объекта, чтобы React отреагировал перерисовкой
        if (task) {
            task.isDone = isDone;
            setTasksObj({...tasksObj});
        }
    }

    function changeFilter(id: string, value: FilterValuesType) {
        let todolist = todolists.find(tl => tl.id === id)
        if (todolist) {
            todolist.filter = value
            setTodolists([...todolists])
        }
        // setTodolists()
    }

    const todolistId1 = v1()
    const todolistId2 = v1()

    let [todolists, setTodolists] = useState<Array<TodolistType>>([
        {id: todolistId1, title: "What to learn", filter: "active"},
        {id: todolistId2, title: "What to buy", filter: "completed"}
    ])

    let [tasksObj, setTasksObj] = useState({
        [todolistId1]: [
            {id: v1(), title: "HTML&CSS", isDone: true},
            {id: v1(), title: "JS", isDone: true},
            {id: v1(), title: "ReactJS", isDone: false},
            {id: v1(), title: "Rest API", isDone: false},
            {id: v1(), title: "GraphQL", isDone: false},
        ],
        [todolistId2]: [
            {id: v1(), title: "Cookies", isDone: true},
            {id: v1(), title: "Water", isDone: false},
            {id: v1(), title: "Cat food", isDone: false},
        ]
    })

    return (
        <div className="App">
            {todolists.map(tl => {
                let tasksForTodolist = tasksObj[tl.id];

                if (tl.filter === "active") {
                    tasksForTodolist = tasksForTodolist.filter(t => !t.isDone);
                }
                if (tl.filter === "completed") {
                    tasksForTodolist = tasksForTodolist.filter(t => t.isDone);
                }

                return <Todolist
                    key={tl.id}
                    id={tl.id}
                    title={tl.title}
                    tasks={tasksForTodolist}
                    removeTodolist={removeTodolist}
                    removeTask={removeTask}
                    changeFilter={changeFilter}
                    addTask={addTask}
                    changeTaskStatus={changeStatus}
                    filter={tl.filter}
                />
            })}
        </div>
    );
}

export default App;
