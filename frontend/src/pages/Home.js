import TaskForm from "../components/TaskForm";
import TaskDetails from "../components/TaskDetails";
import { useEffect } from "react";
import { useTasksContext } from "../hooks/useTasksContext";
import { useAuthContext } from "../hooks/useAuthContext";
import "../index.css";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import {
  Select,
  MenuItem,
  FormHelperText,
  FormControl,
  InputLabel,
  Chip,
} from "@mui/material";

const Home = () => {
  const { tasks, dispatch } = useTasksContext();
  const { user } = useAuthContext();
  const [selected, setSelected] = useState([]);

  const selectionChangeHandler = (e) => {
    setSelected(e.target.value);
  };

  const priorities = ["Low", "Mid", "High"];

  useEffect(() => {
    const fetchTasks = async () => {
      const response = await fetch("http://localhost:3000/api/tasks/", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      const json = await response.json();

      if (response.ok) {
        dispatch({ type: "SET_TASKS", payload: json });
      }
    };

    if (user) {
      fetchTasks();
    }
  }, [dispatch, user]);

  return (
    <div className="home">
      <TaskForm />

      <div className="tasks">
        <FormControl
          sx={{
            backgroundColor: "#141414",
            width: "10vw",
            marginBottom: "15px",
            boxShadow: "inset 0px 0px 2px 0 grey",
            borderRadius: "4px",
            height: "5vh",
          }}
        >
          <InputLabel sx={{ color: "white" }}>Filter</InputLabel>
          <Select
            sx={{ height: "5vh", color: "white" }}
            multiple
            value={selected}
            onChange={selectionChangeHandler}
            renderValue={(selected) => (
              <div>
                {selected.map((value) => (
                  <Chip
                    key={value}
                    label={value}
                    sx={{ color: "white", backgroundColor: "black" }}
                  />
                ))}
              </div>
            )}
          >
            <MenuItem value={"Low"}>Low</MenuItem>
            <MenuItem value={"Mid"}>Mid</MenuItem>
            <MenuItem value={"High"}>High</MenuItem>
          </Select>
        </FormControl>
        {/* <Autocomplete

          disablePortal
          id="combo-box"
          options={priorities}
          sx={{
            backgroundColor: "#141414",
            borderRadius: "10px",
            boxShadow: "inset 0px 0px 2px 0 grey",
            width: "10vw",
            height: "5vh",
            marginBottom: "15px",
            textAlign: "center",
          }}
          renderInput={(params) => (
            <TextField {...params} label="Filter by priority" />
          )}
        /> */}

        {tasks &&
          tasks.map((task) => (
            <TaskDetails key={task._id} task={task} selected={selected} />
          ))}
      </div>
    </div>
  );
};

export default Home;
