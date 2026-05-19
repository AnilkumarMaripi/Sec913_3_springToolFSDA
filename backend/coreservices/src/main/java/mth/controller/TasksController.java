package mth.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import mth.models.Tasks;
import mth.services.TasksService;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/tasks")
public class TasksController {

    @Autowired
    TasksService TS;

    @GetMapping("/list")
    public Object listTasks() {
        return TS.listTasks();
    }

    @PostMapping("/add")
    public Object addTask(@RequestBody Tasks task) {
        return TS.addTask(task);
    }

    @PostMapping("/delete")
    public Object deleteTask(@RequestBody Tasks task) {
        return TS.deleteTask(task);
    }
}
