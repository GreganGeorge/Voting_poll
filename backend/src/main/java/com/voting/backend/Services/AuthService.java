package com.voting.backend.Services;

import java.util.Optional;

import org.springframework.stereotype.Service;

import com.voting.backend.entity.User;
import com.voting.backend.repositories.UserRepository;
import com.voting.backend.utility.JwtUtil;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    public boolean register(String email, String password) {
        if (userRepository.findByEmail(email).isPresent()) {
            return false;
        }
        User user = new User();
        user.setEmail(email);
        user.setPassword(password);
        userRepository.save(user);
        return true;
    }

    public String login(String email, String password) {
        Optional<User> userOpt = userRepository.findByEmailAndPassword(email, password);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            return jwtUtil.generateToken(user.getId());
        } else {
            throw new RuntimeException("Invalid credentials");
        }
    }

    public User getUserById(Long id) {
        return userRepository.findById(id).orElse(null);
    }
}
