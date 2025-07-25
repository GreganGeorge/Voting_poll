package com.voting.backend.Services;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.voting.backend.Response.PollResponse;
import com.voting.backend.entity.Poll;
import com.voting.backend.entity.User;
import com.voting.backend.entity.Vote;
import com.voting.backend.request.CreatePoll;

import lombok.RequiredArgsConstructor;

import com.voting.backend.repositories.PollRepository;
import com.voting.backend.repositories.VoteRepository;
import org.springframework.http.ResponseEntity;

@Service
@RequiredArgsConstructor

public class PollService {
    private final PollRepository pollRepository;
    private final VoteRepository voteRepository;

    public Poll CreatePoll(Poll poll) {
        return pollRepository.save(poll);
    }

    public Optional<Poll> getPoll(Long id) {
        return pollRepository.findById(id);
    }

    // public void vote(Long pollId, int optionIndex) {
    // Poll poll = pollRepository.findById(pollId).orElseThrow(() -> new
    // RuntimeException("Poll not found!"));
    // List<OptionVote> options = poll.getOptions();
    // if (optionIndex < 0 || optionIndex >= options.size()) {
    // throw new IllegalArgumentException("Invalid option index");
    // }
    // OptionVote selectedOption = options.get(optionIndex);
    // selectedOption.setVoteCount(selectedOption.getVoteCount() + 1);
    // pollRepository.save(poll);
    // }

    public ResponseEntity<?> addPoll(CreatePoll request, User user) {
        Poll poll = new Poll();
        poll.setQuestion(request.getQuestion());
        poll.setOptions(request.getOptions());
        poll.setUser(user);
        poll.setExpiresAt(LocalDateTime.now().plusDays(3));
        pollRepository.save(poll);
        return ResponseEntity.ok("Poll created");
    }

    public List<PollResponse> getAllPollsWithVotes(Long userId) {
        List<Poll> polls = pollRepository.findAll();
        List<Vote> allVotes = voteRepository.findAll();
        return polls.stream().map(poll -> {
            Map<String, Long> voteCounts = new HashMap<>();

            for (String option : poll.getOptions()) {
                voteCounts.put(option, 0L);
            }

            allVotes.stream()
                    .filter(v -> v.getPoll().getId().equals(poll.getId()))
                    .forEach(vote -> {
                        voteCounts.put(
                                vote.getSelectedOption(),
                                voteCounts.getOrDefault(vote.getSelectedOption(), 0L) + 1);
                    });

            List<String> votedOptions = allVotes.stream()
                    .filter(v -> v.getPoll().getId().equals(poll.getId()) && v.getUser().getId().equals(userId))
                    .map(Vote::getSelectedOption)
                    .collect(Collectors.toList());

            return new PollResponse(
                    poll.getId(),
                    poll.getQuestion(),
                    poll.getOptions(),
                    poll.getExpiresAt(),
                    voteCounts,
                    votedOptions);
        }).collect(Collectors.toList());
    }

}
