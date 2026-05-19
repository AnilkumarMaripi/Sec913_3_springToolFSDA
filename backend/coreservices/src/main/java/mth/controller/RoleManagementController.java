package mth.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import mth.models.Roles;
import mth.models.Menus;
import mth.models.Rolesmapping;
import mth.repository.RolesRepository;
import mth.repository.MenusRepository;
import mth.repository.RolesMappingRepository;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/")
public class RoleManagementController {

    @Autowired
    RolesRepository RR;

    @Autowired
    MenusRepository MR;

    @Autowired
    RolesMappingRepository RMR;

    @GetMapping("/role/list")
    public Object listRoles() {
        Map<String, Object> response = new HashMap<>();
        response.put("code", 200);
        response.put("data", RR.findAll());
        return response;
    }

    @PostMapping("/role/add")
    public Object addRole(@RequestBody Roles role) {
        Map<String, Object> response = new HashMap<>();
        if (role.getRole() != null && role.getRole() == 0) {
            role.setRole(null);
        }
        RR.save(role);
        response.put("code", 200);
        response.put("message", "Role added successfully");
        return response;
    }

    @GetMapping("/menu/list")
    public Object listMenus() {
        Map<String, Object> response = new HashMap<>();
        response.put("code", 200);
        response.put("data", MR.findAll());
        return response;
    }

    @PostMapping("/menu/add")
    public Object addMenu(@RequestBody Menus menu) {
        Map<String, Object> response = new HashMap<>();
        if (menu.getMid() != null && menu.getMid() == 0) {
            menu.setMid(null);
        }
        MR.save(menu);
        response.put("code", 200);
        response.put("message", "Menu added successfully");
        return response;
    }

    @GetMapping("/role/stats")
    public Object getStats() {
        Map<String, Object> response = new HashMap<>();
        response.put("code", 200);
        response.put("rolesCount", RR.count());
        response.put("menusCount", MR.count());
        return response;
    }

    @GetMapping("/role/mappings")
    public Object listMappings() {
        Map<String, Object> response = new HashMap<>();
        response.put("code", 200);
        response.put("data", RMR.findAll());
        return response;
    }

    @PostMapping("/role/map")
    public Object mapRoleMenu(@RequestBody Map<String, Object> data) {
        Map<String, Object> response = new HashMap<>();
        try {
            Object role = data.get("role");
            Object menus = data.get("menus");

            if (role == null || menus == null) {
                response.put("code", 400);
                response.put("message", "Missing role or menus");
                return response;
            }

            Long roleId = Long.valueOf(role.toString());
            List<Integer> menuIds = (List<Integer>) menus;

            // Delete existing mappings for this role
            RMR.deleteByRole(roleId);

            // Add new mappings
            for (Integer mid : menuIds) {
                Rolesmapping mapping = new Rolesmapping();
                mapping.setRole(roleId);
                mapping.setMid(mid.longValue());
                RMR.save(mapping);
            }

            response.put("code", 200);
            response.put("message", "Role mapping updated successfully");
        } catch (Exception e) {
            response.put("code", 500);
            response.put("message", e.getMessage());
        }
        return response;
    }
}
