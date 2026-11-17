package com.umc.movie.dto;

import com.umc.movie.entity.Member;

import java.time.LocalDateTime;

public record MemberInfoResponse(
        // 프론트에서 GET /members/{memberId}/ratings로 내 평점을 조회할 때 사용합니다.
        Long memberId,
        String email,
        String nickname,
        LocalDateTime createdAt
) {
    // 회원 엔티티에는 비밀번호 해시도 들어 있으므로, 응답에 공개할 필드만 옮겨 담습니다.
    public static MemberInfoResponse from(Member member) {
        return new MemberInfoResponse(
                member.getMemberId(),
                member.getEmail(),
                member.getNickname(),
                member.getCreatedAt()
        );
    }
}
