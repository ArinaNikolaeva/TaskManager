import React, { useState, useEffect } from 'react';
import './styles.css';

const API_URL = 'http://localhost:5001';

function App() {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState('');

    useEffect(() => {
        loadTasks();
    }, []);

    const loadTasks = async () => {
        const response = await fetch(`${API_URL}/tasks`);
        const data = await response.json();
        setTasks(data);
    };

    const addTask = async () => {
        if (!newTask.trim()) return;
        const response = await fetch(`${API_URL}/tasks`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: newTask })
        });
        const task = await response.json();
        setTasks([...tasks, task]);
        setNewTask('');
    };

    const toggleTask = async (id, completed) => {
        await fetch(`${API_URL}/tasks/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ completed: completed ? 0 : 1 })
        });
        loadTasks();
    };

    const deleteTask = async (id) => {
        await fetch(`${API_URL}/tasks/${id}`, {
            method: 'DELETE'
        });
        loadTasks();
    };

    return (
        <div className="app">
            <h1>Менеджер задач</h1>
            <div className="add-task">
                <input
                    data-testid="task-input"
                    type="text"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    placeholder="Новая задача..."
                    onKeyPress={(e) => e.key === 'Enter' && addTask()}
                />
                <button data-testid="task-add-button" onClick={addTask}>
                    Добавить
                </button>
            </div>
            <ul className="task-list">
                {tasks.map(task => (
                    <li
                        key={task.id}
                        data-testid="task-item"
                        className={task.completed ? 'completed' : ''}
                    >
                        <span onClick={() => toggleTask(task.id, task.completed)}>
                            {task.title}
                        </span>
                        <button onClick={() => deleteTask(task.id)}>✗</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App; 