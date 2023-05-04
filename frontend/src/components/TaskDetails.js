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
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";

const TaskDetails = ({ task }) => {
  const { dispatch } = useTasksContext();
  const { user } = useAuthContext();
  const [open, setOpen] = useState(false);
  const [newTaskName, setNewTaskName] = useState("");
  const [priority, setPriority] = useState("");

  const handlePriority = (e) => {
    setPriority(e.target.value);
  };

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

    const updatedTask = {
      taskName: newTaskName ? newTaskName : task.taskName,
      priority,
    };

    const response = await fetch(
      "http://localhost:3000/api/tasks/" + task._id,
      {
        method: "PATCH",
        body: JSON.stringify(updatedTask),
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
    <div
      className="task-details"
      style={open ? { boxShadow: "inset 0px 0px 2px 0 orange" } : {}}
    >
      <div className="task-segment">
        {task.priority && (
          <span className="priority-icons">
            {task.priority === "Low" && (
              <PriorityHighIcon
                sx={{ fontSize: "large", margin: "-5px", color: "green" }}
              />
            )}
            {task.priority === "Mid" && [
              <PriorityHighIcon
                sx={{ fontSize: "large", margin: "-5px", color: "yellow" }}
              />,
            ]}
            {task.priority === "High" && [
              <PriorityHighIcon
                sx={{
                  fontSize: "large",
                  margin: "-5px",
                  color: "red",
                  opacity: "50%",
                }}
              />,
            ]}
          </span>
        )}
        <h4>{task.taskName}</h4>
      </div>
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
          style={open ? { color: "orange" } : {}}
        />
      </div>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            backgroundColor: "#141414",
            color: "white",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          },
        }}
      >
        <DialogTitle>Edit task</DialogTitle>
        <DialogContent
          style={{
            display: "flex",
            alignItems: "center",
            gap: "40px",
          }}
        >
          <TextField
            className="modal-text"
            margin="dense"
            id="name"
            label="Task Name"
            type="text"
            fullWidth
            variant="standard"
            value={newTaskName}
            onChange={(e) => setNewTaskName(e.target.value)}
          />
          <Box sx={{ minWidth: 120, color: "white" }}>
            <FormControl variant="standard" fullWidth sx={{}}>
              <InputLabel
                id="select-label"
                sx={{ color: "white", opacity: "90%" }}
              >
                Priority
              </InputLabel>
              <Select
                className="modal-text"
                labelId="select-label"
                id="select"
                value={priority}
                label="Priority"
                onChange={handlePriority}
                sx={{ color: "white" }}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value={"Low"}>Low</MenuItem>
                <MenuItem value={"Mid"}>Mid</MenuItem>
                <MenuItem value={"High"}>High</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleEdit}>Confirm</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default TaskDetails;
