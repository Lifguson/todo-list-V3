import { useState } from "react";
import { useTasksContext } from "../hooks/useTasksContext";
import { useAuthContext } from "../hooks/useAuthContext";
import "../index.css";

const TaskForm = () => {
  const { dispatch } = useTasksContext();
  const { user } = useAuthContext();
  const [taskName, setTaskName] = useState("");
  const [error, setError] = useState(null);
  const [emptyFields, setEmptyFields] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setError("You must be logged in");
      return;
    }

    const response = await fetch("http://localhost:3000/api/tasks/", {
      method: "POST",
      body: JSON.stringify({ taskName }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    });
    const json = await response.json();

    if (!response.ok) {
      setError(json.error);
      setEmptyFields(json.emptyFields);
    }

    if (response.ok) {
      setTaskName("");
      setError(null);
      setEmptyFields([]);
      console.log("new task added", json);
      dispatch({ type: "CREATE_TASK", payload: json });
    }
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      {/* <label>Add a new task</label> */}
      <input
        type="text"
        placeholder="Add a new task"
        onChange={(e) => setTaskName(e.target.value)}
        value={taskName}
        className={emptyFields.includes("title") ? "error" : ""}
      />
      <button className="submit-button">Add</button>
      {error && <div className="error">{error}</div>}
    </form>
  );
};

export default TaskForm;
