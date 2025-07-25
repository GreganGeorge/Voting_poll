package com.voting.backend.controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.voting.backend.Services.PollService;
import com.voting.backend.Response.PollResponse;
import com.voting.backend.Services.AuthService;
import com.voting.backend.entity.Poll;
import com.voting.backend.entity.User;
import com.voting.backend.request.CreatePoll;
import jakarta.servlet.http.HttpServletRequest;
import com.voting.backend.utility.JwtUtil;

import io.jsonwebtoken.ExpiredJwtException;
import lombok.RequiredArgsConstructor;

@RestController
@CrossOrigin("*")
@RequestMapping("/api")
@RequiredArgsConstructor
public class PollController {
    private final PollService pollService;
    private final AuthService authService;
    private final JwtUtil jwtUtil;

    @PostMapping("/createpoll")
    public Poll CreatePoll(@RequestBody Poll poll) {
        return pollService.CreatePoll(poll);
    }

    @GetMapping("/getpoll/{id}")
    public ResponseEntity<Poll> getPoll(@PathVariable Long id) {
        return pollService.getPoll(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/polls")
    public ResponseEntity<?> createPoll(@RequestBody CreatePoll request, HttpServletRequest httpRequest) {
        String token = httpRequest.getHeader("Authorization").substring(7);
        Long userId = Long.parseLong(jwtUtil.extractId(token));
        User user = authService.getUserById(userId);
        return pollService.addPoll(request, user);
    }

    @GetMapping("/getAllPolls")
    public ResponseEntity<List<PollResponse>> getPolls(HttpServletRequest httpRequest) {
        String authHeader = httpRequest.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
        String token = authHeader.substring(7);
        try {
            Long userId = Long.parseLong(jwtUtil.extractId(token));
            return ResponseEntity.ok(pollService.getAllPollsWithVotes(userId));
        } catch (ExpiredJwtException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
    }
}
