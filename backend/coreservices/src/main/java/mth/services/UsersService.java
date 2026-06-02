package mth.services;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import mth.models.Users;
import mth.repository.UsersRepository;

@Service
public class UsersService {
	
	@Autowired
	UsersRepository UR;
	
	@Autowired
	JwtService JWT;
		
	public Object signup(Users U)
	{
		Map<String, Object> response = new HashMap<>();
		try
		{
			Object id = UR.checkByEmail(U.getEmail());
			if(id != null)
			{				
				response.put("code", 501);
				response.put("message", "Email ID already registered");
			}
			else
			{
				U.setId(null);      // Ensure ID is null for new records
				U.setStatus(1);		// Make the status of the user as active
				
				UR.save(U);			// Insert into the database table (users)
				
				response.put("code", 200);
				response.put("message", "User account has been created.");
			}
		}catch(Exception e)
		{
			response.put("code", 500);
			response.put("message", e.getMessage());
		}
		return response;
	}
	
	public Object signin(Map<String, Object> data)
	{
		Map<String, Object> response = new HashMap<>();
		try
		{
			Object username = data.get("username");
			Object password = data.get("password");
			
			if (username == null || password == null) {
				response.put("code", 400);
				response.put("message", "Missing username or password");
				return response;
			}
			
			Object role = UR.validateCredentials(username.toString(), password.toString()); 	//Validate user name and password
			if(role != null)
			{
				response.put("code", 200);
				response.put("jwt", JWT.generateJWT(username, role)); //Generate JWT token and return as response
			}
			else
			{
				response.put("code", 404);
				response.put("message", "Invalid Credentials!");
			}
		}catch(Exception e)
		{
			response.put("code", 500);
			response.put("message", e.getMessage());
		}
		return response;
	}
	
	public Object uinfo(String token)
	{
		Map<String, Object> response = new HashMap<>();
		try
		{
			Map<String, Object> payload = JWT.validateJWT(token);
	        String email = (String) payload.get("username");
	        Users U = (Users) UR.findByEmail(email);
	        
	        List<Object> menuList = UR.getMenus(Long.valueOf(U.getRole()));
			
	        response.put("code", 200);
	        response.put("fullname", U.getFullname());
	        response.put("email", U.getEmail());
	        response.put("phone", U.getPhone());
	        response.put("roleId", U.getRole());
	        response.put("menulist", menuList);
		}catch(Exception e)
		{
			response.put("code", 500);
			response.put("message", e.getMessage());
		}
		return response;
	}

	public Object listUsers() {
		Map<String, Object> response = new HashMap<>();
		try {
			response.put("code", 200);
			response.put("data", UR.listUsersWithRoles());
		} catch (Exception e) {
			response.put("code", 500);
			response.put("message", e.getMessage());
		}
		return response;
	}

	public Object resetPassword(Map<String, Object> data) {
		Map<String, Object> response = new HashMap<>();
		try {
			Object emailObj = data.get("email");
			Object newpasswordObj = data.get("newpassword");

			if (emailObj == null || newpasswordObj == null) {
				response.put("code", 400);
				response.put("message", "Missing email or new password");
				return response;
			}

			String email = emailObj.toString();
			String newpassword = newpasswordObj.toString();

			Users U = (Users) UR.findByEmail(email);
			if (U != null) {
				U.setPassword(newpassword);
				UR.save(U);
				response.put("code", 200);
				response.put("message", "Password has been successfully updated.");
			} else {
				response.put("code", 404);
				response.put("message", "Email ID not found.");
			}
		} catch (Exception e) {
			response.put("code", 500);
			response.put("message", e.getMessage());
		}
		return response;
	}
}
