import List from '../components/List'
import { useEffect, useState } from 'react'
import { collection, addDoc } from "firebase/firestore";
import {db} from '../firebase/firebaseConfig'

const TodoForm = (props) => {

  const {todos, toggleComplete, handleEdit, handleDelete} = props
  const [title, setTitle] = useState("")

  const handleSubmit = async (e) => {
    
    e.preventDefault();
    if(title != "") {
      await addDoc(collection(db, "todos"), {
        title: title,
        completed: false,
    });
    setTitle("")
    }
  }

  const list = todos.map((todo) => (
    <List
      key={todo.id} 
      id={todo.id}
      title={todo.title}
      doneOrNot={todo.completed}
      toggleComplete={toggleComplete}
      handleDelete={handleDelete}
      handleEdit={handleEdit}
    />))


  return (
    <div className="page-center">
      <h1>To Do List App</h1>
      <form onSubmit={handleSubmit} className="input">
        <input 
          value={title}
          type="text" 
          className="input-field"
          onChange={(e) => setTitle(e.target.value)} 
          placeholder="Add Todo"
          />
        <button className="input-button done">Add</button>
      </form>
      {list}
    </div>
  )
}

export default TodoForm