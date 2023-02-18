import React from 'react'
import { useNavigate, Link, useResolvedPath } from 'react-router-dom'
import { useEffect, useState } from 'react'
import TodoForm from './TodoForm'
import { onAuthStateChanged, getAuth, signOut } from 'firebase/auth'
import {auth} from '../firebase/firebaseConfig'

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
  const [userDetails, setUserDetails] = useState("")
  const [todos, setTodos] = useState()

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if(user) {
        const q = query(collection(db, "users"));
        const unsub = onSnapshot(q, (querySnapshot) => {
          let details = "";
          querySnapshot.forEach((doc) => {
            if(doc.uid == user.uid) {
              console.log(doc.name)
              details = doc.name;
            }
          });
          setUserDetails(details);
        });
        return () => unsub();
      }
    })

  }, [])

  const handleEdit = async (todo, title) => {
    await updateDoc(doc(db, "todos", id), { title: title });
  };
  const toggleComplete = async (id, newValue) => {
    await updateDoc(doc(db, "todos", id), { completed: newValue });
  };
  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "todos", id));
  };

  useEffect(() => {
    const q = query(collection(db, "todos"));
    const unsub = onSnapshot(q, (querySnapshot) => {
      let todosArray = [];
      querySnapshot.forEach((doc) => {
        todosArray.push({ ...doc.data(), id: doc.id });
      });
      setTodos(todosArray);
    });
    return () => unsub();
  }, [])
  
  const logOutUser = () => {
    const auth = getAuth();
    signOut(auth).then(() => {  
      navigate("/")
    }) 
  }
    
  return (
    <>
      {
        userDetails != undefined ? (
          <>
            <div className='profile'>
              <span className='hello-name'>Hello {userDetails} !</span>
              <p onClick={logOutUser} className='logout'>Log out</p>
            </div>
            {todos == undefined ? "not found" : 
              <TodoForm 
              todos={todos}
              toggleComplete={toggleComplete}
              handleDelete={handleDelete}
              handleEdit={handleEdit} 
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