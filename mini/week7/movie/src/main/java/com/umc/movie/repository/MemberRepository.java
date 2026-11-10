package com.umc.movie.repository;

import com.umc.movie.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member, Long> {
    boolean existsByNickname(String nickname);
    boolean existsByEmail(String email);

    // Spring Data JPA가 메서드 이름에서 이메일 조회 조건을 만들고, 결과가 없으면 Optional.empty()를 반환합니다.
    Optional<Member> findByEmail(String email);
    // nickname이 같고 memberId는 다른 회원이 있는지 확인합니다.
    // 자기 자신의 ID는 제외하므로 기존 닉네임을 그대로 보내도 중복으로 처리하지 않습니다.
    boolean existsByNicknameAndMemberIdNot(String nickname, Long memberId);
}