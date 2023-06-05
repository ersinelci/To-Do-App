import './App.css';
import TaskForm from "./components/TaskForm";
import Task from "./components/Task"
import { useEffect, useState } from "react";


function App() {
  const [tasks, setTasks] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem('tasks'));
    if (storedTasks) {
      setTasks(storedTasks);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  function addTask(name) {
    if (name.length === 0) {
      setErrorMessage("We need tasks to do. Please enter something 🙌");
      return;
    }

    setTasks(prev => {
      return [...prev, { name: name, done: false }];
    });
    setErrorMessage("");
  }

  function removeTask(indexToRemove) {
    setTasks(prev => {
      return prev.filter((taskObject, index) => index !== indexToRemove);
    });
  }

  function removeAllTasks () {
    setTasks ([]);
  }

  function updateTaskDone(taskIndex, newDone) {
    setTasks(prev => {
      const newTasks = [...prev];
      newTasks[taskIndex].done = newDone;
      return newTasks;
    });
  }

  const numberComplete = tasks.filter(t => t.done).length;
  const numberTotal = tasks.length;

  function getMessage() {
    const percentage = numberComplete / numberTotal * 100;
    if (numberTotal === 0) {
      return 'Add at least one item for today'
    }
    if (percentage === 0) {
      return 'Try to do at least one! 🙏';
    }
    if (percentage === 100) {
      return 'Nice job for today! 🏝';
    }
    return 'Keep it going 💪🏻';
  }

  function renameTask(index, newName) {
    setTasks(prev => {
      const newTasks = [...prev];
      newTasks[index].name = newName;
      return newTasks;
    })
  }

  return (
    <main>
      
      <h1>{numberComplete}/{numberTotal} Complete</h1>
      <h2>{getMessage()}</h2>
      <h2>{errorMessage && <p style={{ color: '#61DAFB'}}>{errorMessage}</p>}</h2>
      
       <div className="task-form-container">
        <TaskForm onAdd={addTask} />
        <button className="remove-all-tasks" onClick={removeAllTasks}>Clear All</button>
      </div>
      
      {tasks.map((task, index) => (
        <Task
          {...task}
          onRename={newName => renameTask(index, newName)}
          onTrash={() => removeTask(index)}
          onToggle={done => updateTaskDone(index, done)}
        />

      ))}
    </main>
  );
}

export default App;
