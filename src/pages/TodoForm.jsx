import List from '../components/List'
import { useEffect, useState } from 'react'
import { collection, addDoc, setDoc } from "firebase/firestore";
import {db} from '../firebase/firebaseConfig'
const TodoForm = (props) => {

  const {todos, handleSubmit, toggleComplete, handleEdit, handleDelete} = props
  const [title, setTitle] = useState("")

  // const handleSubmit = async (e) => {
    
  //   e.preventDefault();
  //   if(title != "") {
  //     await addDoc(collection(db, "todos"), {
  //       title: title,
  //       completed: false,
  //   });
  //   setTitle("")
  //   }
  // }



  return (
    <div className="page-center">
      <h1>To Do List App</h1>
      <form className="input">
        <input 
          value={title}
          type="text" 
          className="input-field"
          onChange={(e) => setTitle(e.target.value)} 
          placeholder="Add Todo"
          />
        <button onClick={(e) => handleSubmit(e, title, setTitle)}className="input-button done">Add</button>
      </form>
      {todos != undefined ? todos.map((todo, idx) => (
        <List
          key={idx} 
          id={idx}
          title={todo.title}
          doneOrNot={todo.completed}
          toggleComplete={toggleComplete}
          handleDelete={handleDelete}
          handleEdit={handleEdit}
        />)) : ""}
    </div>
  )
}

export default TodoForm