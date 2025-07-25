package com.voting.backend.controllers;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.voting.backend.Services.VoteService;
import com.voting.backend.request.Vote;
import com.voting.backend.utility.JwtUtil;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@RestController
@CrossOrigin("*")
@RequestMapping("/api")
@RequiredArgsConstructor
public class VoteController {
    private final VoteService voteService;
    private final JwtUtil jwtUtil;

    @PostMapping("/vote")
    public ResponseEntity<?> toggleVote(@RequestBody Vote request, HttpServletRequest httpRequest) {
        String token = httpRequest.getHeader("Authorization").substring(7);
        Long userId = Long.parseLong(jwtUtil.extractId(token));
        boolean isVoted = voteService.toggleVote(userId, request.getPollId(), request.getSelectedOption());
        return ResponseEntity.ok(Map.of("message", isVoted ? "Voted" : "Vote removed"));
    }
}
