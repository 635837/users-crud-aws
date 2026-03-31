package com.example.userscrud.api;

import com.example.userscrud.model.User;
import com.example.userscrud.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService service;

    public UserController(UserService service) {
        this.service = service;
    }

    // ✅ USER + ADMIN can view users
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    @GetMapping
    public List<User> all() {
        return service.findAll();
    }

    // ✅ USER + ADMIN can create users
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    @PostMapping
    public ResponseEntity<User> create(@Valid @RequestBody User user) {
        User saved = service.create(user);
        return ResponseEntity
                .created(URI.create("/users/" + saved.getId()))
                .body(saved);
    }

    // ✅ USER + ADMIN can update users
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    @PutMapping("/{id}")
    public User update(@PathVariable Long id, @Valid @RequestBody User user) {
        return service.update(id, user);
    }

    // ✅ ONLY ADMIN can delete users
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}