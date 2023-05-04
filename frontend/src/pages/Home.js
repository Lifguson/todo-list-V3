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
        {/* <FormControl
          sx={{
            backgroundColor: "#141414",
            width: "10vw",
            marginBottom: "15px",
            boxShadow: "inset 0px 0px 2px 0 grey",
            borderRadius: "4px",
            fontFamily: "satoshiRegular",
            height: "6vh",
          }}
        >
          <InputLabel
            sx={{
              color: "white",
              fontFamily: "satoshiRegular",
              fontSize: "14px",
            }}
          >
            Filter by priority
          </InputLabel>
          <Select
            sx={{
              color: "white",
              fontFamily: "satoshiRegular",
              height: "6vh",
            }}
            multiple
            value={selected}
            onChange={selectionChangeHandler}
            renderValue={(selected) => (
              <div>
                {selected.map((value) => (
                  <Chip
                    key={value}
                    label={value}
                    sx={{
                      color: "white",
                      backgroundColor: "gray",
                      fontFamily: "satoshiRegular",
                    }}
                  />
                ))}
              </div>
            )}
          >
            <MenuItem value={"Low"} sx={{ fontFamily: "satoshiRegular" }}>
              Low
            </MenuItem>
            <MenuItem value={"Mid"} sx={{ fontFamily: "satoshiRegular" }}>
              Mid
            </MenuItem>
            <MenuItem value={"High"} sx={{ fontFamily: "satoshiRegular" }}>
              High
            </MenuItem>
          </Select>
        </FormControl> */}

        {tasks &&
          tasks.map((task) => (
            <TaskDetails key={task._id} task={task} selected={selected} />
          ))}
      </div>
    </div>
  );
};

export default Home;
