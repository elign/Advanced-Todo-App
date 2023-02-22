
export default function List(props) {

    const {id, title, doneOrNot, toggleComplete, handleDelete} = props

    const taskDone =  {
        textDecoration: "line-through"
    };

    const taskNotDone = {
        textDecoration: "none"
    };

    return (
        <div className="todo">
            <p style={ doneOrNot ? taskDone : taskNotDone}>{title}</p>
            <button onClick={() => toggleComplete(id, !doneOrNot)} className="todo-button done">Done</button>
            <button onClick={() => handleDelete(id)} className="todo-button remove">Remove</button>
        </div>
    )
};