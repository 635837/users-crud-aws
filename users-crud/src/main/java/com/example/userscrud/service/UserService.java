package com.example.userscrud.service;

import com.example.userscrud.model.User;
import com.example.userscrud.repo.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {
    private final UserRepository repo;
    public UserService(UserRepository repo) { this.repo = repo; }

    public List<User> findAll() { return repo.findAll(); }

    public User create(User user) {
        if (repo.existsById(user.getId())) {
            throw new IllegalArgumentException("User with id " + user.getId() + " already exists");
        }
        return repo.save(user);
    }

    public User update(Long id, User payload) {
        return repo.findById(id).map(u -> {
            u.setName(payload.getName());
            u.setEmail(payload.getEmail());
            return repo.save(u);
        }).orElseThrow(() -> new IllegalArgumentException("User " + id + " not found"));
    }

    public void delete(Long id) {
        if (!repo.existsById(id)) {
            throw new IllegalArgumentException("User " + id + " not found");
        }
        repo.deleteById(id);
    }
}