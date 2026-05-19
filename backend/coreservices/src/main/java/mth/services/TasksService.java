package mth.services;

import java.util.HashMap;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import mth.models.Tasks;
import mth.repository.TasksRepository;

@Service
public class TasksService {

    @Autowired
    TasksRepository TR;

    public Object listTasks() {
        Map<String, Object> response = new HashMap<>();
        response.put("code", 200);
        response.put("data", TR.findAll());
        return response;
    }

    public Object addTask(Tasks task) {
        Map<String, Object> response = new HashMap<>();
        try {
            if (task.getId() != null && task.getId() == 0) {
                task.setId(null);
            }
            TR.save(task);
            response.put("code", 200);
            response.put("message", "Task added successfully");
        } catch (Exception e) {
            response.put("code", 500);
            response.put("message", e.getMessage());
        }
        return response;
    }

    public Object deleteTask(Tasks task) {
        Map<String, Object> response = new HashMap<>();
        try {
            if (task.getId() == null) {
                response.put("code", 400);
                response.put("message", "Task ID is required for deletion");
                return response;
            }
            TR.deleteById(task.getId());
            response.put("code", 200);
            response.put("message", "Task deleted successfully");
        } catch (Exception e) {
            response.put("code", 500);
            response.put("message", e.getMessage());
        }
        return response;
    }
}
