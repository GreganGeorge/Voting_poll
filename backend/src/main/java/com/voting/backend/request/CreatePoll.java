package com.voting.backend.request;

import lombok.Data;
import java.util.List;

@Data
public class CreatePoll {
    private String question;
    private List<String> options;
}
