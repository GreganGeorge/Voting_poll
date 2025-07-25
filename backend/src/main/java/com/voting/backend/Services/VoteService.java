package com.voting.backend.Services;

import java.util.Optional;

import org.springframework.stereotype.Service;

import com.voting.backend.entity.Poll;
import com.voting.backend.entity.User;
import com.voting.backend.entity.Vote;
import com.voting.backend.repositories.PollRepository;
import com.voting.backend.repositories.UserRepository;
import com.voting.backend.repositories.VoteRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class VoteService {
    private final VoteRepository voteRepository;
    private final UserRepository userRepository;
    private final PollRepository pollRepository;

    public boolean toggleVote(Long userId, Long pollId, String option) {
        Optional<Vote> existingVote = voteRepository.findByUserIdAndPollIdAndSelectedOption(userId, pollId, option);
        if (existingVote.isPresent()) {
            voteRepository.delete(existingVote.get());
            return false;
        } else {
            Vote vote = new Vote();
            User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
            vote.setUser(user);
            Poll poll = pollRepository.findById(pollId).orElseThrow(() -> new RuntimeException("Poll not found"));
            vote.setPoll(poll);
            vote.setSelectedOption(option);
            voteRepository.save(vote);
            return true;
        }
    }
}
