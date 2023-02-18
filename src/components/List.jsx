
export default function List(props) {

    const {id, title, doneOrNot, toggleComplete, handleEdit, handleDelete} = props

    const taskDone =  {
        textDecoration: "line-through"
    };

    const taskNotDone = {
        textDecoration: "none"
    };

    return (
        <div className="todo">
            <p style={ doneOrNot ? taskDone : taskNotDone}>{title}</p>
            <button onClick={() => toggleComplete(id, !doneOrNot)} className="done">Done</button>
            <button onClick={() => handleDelete(id)} className="remove">Remove</button>
        </div>
    )
};