package com.voting.backend.Response;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Data
@AllArgsConstructor
public class PollResponse {
    private Long id;
    private String question;
    private List<String> options;
    private LocalDateTime expiresAt;
    private Map<String, Long> optionVoteCounts;
    private List<String> selectedOption;
}
