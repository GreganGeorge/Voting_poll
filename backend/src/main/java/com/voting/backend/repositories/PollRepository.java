package com.voting.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.voting.backend.entity.Poll;

@Repository
public interface PollRepository extends JpaRepository<Poll, Long> {

}
