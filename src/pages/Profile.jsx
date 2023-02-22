import React from 'react'
import { useNavigate, Link, useResolvedPath } from 'react-router-dom'
import { useEffect, useState } from 'react'
import TodoForm from './TodoForm'
import { onAuthStateChanged, getAuth, signOut } from 'firebase/auth'
import {auth} from '../firebase/firebaseConfig'
import { getDoc, setDoc } from "firebase/firestore"
import {
  doc,
} from "firebase/firestore";

import { db } from "../firebase/firebaseConfig";

export default function Profile() {

  const navigate = useNavigate()
  const [userDetails, setUserDetails] = useState()
  const [todos, setTodos] = useState()
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    onAuthStateChanged(auth, async(user) => {
      if(user) {
        setUserDetails(user.displayName)
        setUserEmail(user.email);

        // Reference of the doc that you want to edit
        const docRef = doc(db, "individual-todos", user.email)
        try {

          // Brings the value of the docRef collection
          const docSnap = await getDoc(docRef);
          if(docSnap.exists()) {

            setTodos(docSnap.data().task)
          } else {

            console.log("Document does not exist")
          }
  
        } catch(error) {
            console.log(error)
        }
      }
    })

  }, [])


  const toggleComplete = async (idx, newValue) => {
    const docRef = doc(db, "individual-todos", userEmail)
    const arr = [];
    for(let i = 0; i < todos.length; i++) {
      if(i != idx) 
        arr.push(todos[i])
      else {
        arr.push({title: todos[i].title, completed: newValue})
      }
        
    }
    setTodos(arr)
    await setDoc(docRef, {task: arr});
  };

  const handleDelete = async (idx) => {

    const docRef = doc(db, "individual-todos", userEmail)
    const arr = [];
    for(let i = 0; i < todos.length; i++) {
      if(i != idx) 
      arr.push(todos[i])
    }

    setTodos(arr)
    await setDoc(docRef, {task: arr});
  };

  const handleSubmit = async(e, title, setTitle) => {

    e.preventDefault()
    const docRef = doc(db, "individual-todos", userEmail)
    const data = {
      title: title,
      completed: false,
    }
    const newData = todos == undefined ? {task: [data]} : {task: [data, ...todos]}

    setTodos(newData.task)
    await setDoc(docRef, newData);
    setTitle("")
  }
  
  const logOutUser = () => {
    const auth = getAuth();
    signOut(auth).then(() => {  
      navigate("/")
    }) 
  }

  const clearAll = () => {
    const docRef = doc(db, "individual-todos", userEmail)
    setTodos([])
    setDoc(docRef, {});
  }
    
  return (
    <>
      {
        userDetails != undefined ? (
          <>
            <div className='profile'>
              <span className='hello-name'>Hello {userDetails} !</span>
              <div><p onClick={logOutUser} className='logout'>Log out</p>
              <p onClick={clearAll} className='logout'>Clear All</p></div>
              
            </div>
            { <TodoForm
              id={userEmail}
              todos={todos}
              toggleComplete={toggleComplete}
              handleDelete={handleDelete}
              handleEdit={handleEdit}
              handleSubmit={handleSubmit} 
              /> }
          </>
        ) : (
          <>
            <p>Please Login to see Profile</p>
            <Link to="/">
              <button>
                Login
              </button>
            </Link>
          </>
        )
      }
    </>
  )
}