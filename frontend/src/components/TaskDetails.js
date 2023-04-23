import { useTasksContext } from "../hooks/useTasksContext";
import { useAuthContext } from "../hooks/useAuthContext";
import { useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

const TaskDetails = ({ task }) => {
  const { dispatch } = useTasksContext();
  const { user } = useAuthContext();
  const [open, setOpen] = useState(false);
  const [newTaskName, setNewTaskName] = useState("");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = async () => {
    if (!user) {
      return;
    }

    const response = await fetch(
      "http://localhost:3000/api/tasks/" + task._id,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
    );
    const json = await response.json();

    if (response.ok) {
      dispatch({ type: "DELETE_TASK", payload: json });
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    setOpen(false);

    if (!user) {
      return;
    }

    const response = await fetch(
      "http://localhost:3000/api/tasks/" + task._id,
      {
        method: "PATCH",
        body: JSON.stringify({ taskName: newTaskName }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      }
    );
    const json = await response.json();

    if (response.ok) {
      console.log("task updated", json);
      dispatch({ type: "UPDATE_TASK", payload: json });
    }
  };

  return (
    <div className="task-details">
      <h4>{task.taskName}</h4>
      <div className="task-actions">
        <DeleteIcon
          onClick={handleDelete}
          className="delete-button"
          sx={{ "& :hover": { color: "red" } }}
        />
        <ModeEditIcon
          onClick={handleClickOpen}
          className="edit-button"
          sx={{ "& :hover": { color: "orange" } }}
        />
      </div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edit task</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Task Name"
            type="text"
            fullWidth
            variant="standard"
            value={newTaskName}
            onChange={(e) => setNewTaskName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleEdit}>Confirm Edit</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default TaskDetails;
