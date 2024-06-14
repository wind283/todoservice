package com.example.todo.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.todo.dto.UserDTO;

import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/auth")
public class UserController {

    @PostMapping("/signin")
    public ResponseEntity<?> signin(@RequestBody UserDTO userDTO) {
        Map<String, String> response = new HashMap<>();
        response.put("token", "mock-jwt-token");
        return ResponseEntity.ok().body(response);
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody UserDTO userDTO) {
        Map<String, String> response = new HashMap<>();
        response.put("id", "mock-user-id");
        return ResponseEntity.ok().body(response);
    }
}
