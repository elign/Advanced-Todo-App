import React from 'react'
import { useNavigate, Link, useResolvedPath } from 'react-router-dom'
import { useEffect, useState } from 'react'
import TodoForm from './TodoForm'
import { onAuthStateChanged, getAuth, signOut } from 'firebase/auth'
import {auth} from '../firebase/firebaseConfig'
import { getDoc, setDoc } from "firebase/firestore"
import {
  collection,
  query,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
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
        console.log(user)
        setUserDetails(user.displayName)
        setUserEmail(user.email);
        const docRef = doc(db, "individual-todos", user.email)
        try {
          const docSnap = await getDoc(docRef);
          if(docSnap.exists()) {
              console.log(docSnap.data().task);
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

  const handleEdit = async (todo, title) => {
    await updateDoc(doc(db, "todos", id), { title: title });
  };
  const toggleComplete = async (idx, newValue) => {
    // await updateDoc(doc(db, "todos", id), { completed: newValue });
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
    // // await deleteDoc(doc(db, "individual-todos", idx));
    const docRef = doc(db, "individual-todos", userEmail)
    const arr = [];
    for(let i = 0; i < todos.length; i++) {
      if(i != idx) 
      arr.push(todos[i])
    }

    // setTodos(prevValue => {
    //   return ([data, ...prevValue])
    // })
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
    // setTodos(prevValue => {
    //   return ([data, ...prevValue])
    // })

    setTodos(newData.task)
    await setDoc(docRef, newData);
    setTitle("")
    // window.location.reload(false)
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