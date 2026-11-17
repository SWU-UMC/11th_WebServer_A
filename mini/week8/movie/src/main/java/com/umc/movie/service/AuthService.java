package com.umc.movie.service;

import com.umc.movie.dto.LoginRequest;
import com.umc.movie.dto.LoginResponse;
import com.umc.movie.entity.Member;
import com.umc.movie.exception.ApiException;
import com.umc.movie.repository.MemberRepository;
import com.umc.movie.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Transactional(readOnly = true)
    public LoginResponse login(LoginRequest request) {
        // 이메일로 회원을 조회하고, 조회 결과가 비어 있으면 로그인 실패로 처리합니다.
        Member member = memberRepository.findByEmail(request.email())
                .orElseThrow(this::invalidCredentials);

        // 입력한 비밀번호를 저장된 해시와 비교합니다.
        if (!passwordEncoder.matches(request.password(), member.getPassword())) {
            throw invalidCredentials();
        }

        // 비밀번호 검증을 통과한 회원 ID를 JWT의 subject에 담아 토큰을 발급합니다.
        String accessToken = jwtUtil.createAccessToken(member.getMemberId(), member.getEmail());
        return new LoginResponse(member.getNickname(), accessToken);
    }

    // 미등록 이메일과 비밀번호 불일치에 같은 응답을 보내 가입 여부를 숨깁니다.
    private ApiException invalidCredentials() {
        return new ApiException(
                HttpStatus.UNAUTHORIZED, // 실제 HTTP 응답 상태 (401)
                "AUTH401_1", // JSON 응답 본문의 code 값
                "이메일 또는 비밀번호가 올바르지 않습니다."
        );
    }
}
