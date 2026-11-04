package com.umc.movie.repository;

import com.umc.movie.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member, Long> {
    boolean existsByNickname(String nickname);
    boolean existsByEmail(String email);

    // Spring Data JPA가 메서드 이름에서 이메일 조회 조건을 만들고, 결과가 없으면 Optional.empty()를 반환합니다.
    Optional<Member> findByEmail(String email);
}