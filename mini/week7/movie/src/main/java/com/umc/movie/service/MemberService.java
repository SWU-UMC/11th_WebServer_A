package com.umc.movie.service;

import com.umc.movie.dto.EmailCheckResponse;
import com.umc.movie.dto.MemberInfoResponse;
import com.umc.movie.dto.MemberResponse;
import com.umc.movie.dto.NicknameCheckResponse;
import com.umc.movie.dto.SignUpRequest;
import com.umc.movie.entity.Member;
import com.umc.movie.exception.ApiException;
import com.umc.movie.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

// 컨트롤러에서 받은 요청에 따라 회원 조회, 중복 검사, 비밀번호 해시 처리와 저장을 수행합니다.
@Service
@RequiredArgsConstructor
public class MemberService {

    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;

    // 조회 작업임을 트랜잭션에 알립니다. 이 메서드에서는 회원 정보를 수정하거나 저장하지 않습니다.


    @Transactional(readOnly = true)
    public MemberInfoResponse getMyInfo(Long memberId) {
        // 토큰이 유효해도 회원이 삭제됐을 수 있으므로 현재 회원 정보를 조회합니다.
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "MEMBER404_1",
                        "해당 회원을 찾을 수 없습니다."));

        return MemberInfoResponse.from(member);
    }

    // 조회 작업임을 트랜잭션에 알립니다. 이 메서드에서는 회원 정보를 수정하거나 저장하지 않습니다.


    @Transactional(readOnly = true)
    public NicknameCheckResponse checkNickname(String nickname) {
        boolean exists = memberRepository.existsByNickname(nickname);
        // exists는 이미 사용 중이면 true입니다. 응답은 사용 가능 여부이므로 !exists로 뒤집습니다.
        return new NicknameCheckResponse(!exists);
    }

    // 조회 작업임을 트랜잭션에 알립니다. 이 메서드에서는 회원 정보를 수정하거나 저장하지 않습니다.


    @Transactional(readOnly = true)
    public EmailCheckResponse checkEmail(String email) {
        boolean exists = memberRepository.existsByEmail(email);
        // 조회 결과가 없을 때만 사용 가능한 이메일이므로 exists의 반대 값을 응답합니다.
        return new EmailCheckResponse(!exists);
    }

    // 회원가입을 하나의 트랜잭션으로 묶고, 런타임 예외가 발생하면 DB 변경을 되돌립니다.
    @Transactional
    public MemberResponse signUp(SignUpRequest request) {

        // 중복 확인 API를 거치지 않은 요청도 올 수 있으므로, 실제 가입 직전에 다시 검사합니다.
        if (memberRepository.existsByEmail(request.email())) {
            throw new IllegalArgumentException("이미 사용 중인 이메일입니다.");
        }

        if (memberRepository.existsByNickname(request.nickname())) {
            throw new IllegalArgumentException("이미 사용 중인 닉네임입니다.");
        }

        Member member = Member.builder()
                .email(request.email())
                // 원문 비밀번호 대신 해시를 저장합니다. 로그인에서는 matches()로 입력값을 비교합니다.
                .password(passwordEncoder.encode(request.password()))
                .nickname(request.nickname())
                .build();

        // JPA를 통해 회원을 저장하고, DB에서 생성된 회원 ID가 반영된 엔티티를 받습니다.
        Member savedMember = memberRepository.save(member);

        // 응답 DTO에는 회원 ID, 이메일, 닉네임만 담아 비밀번호 해시가 응답에 포함되지 않게 합니다.
        return new MemberResponse(
                savedMember.getMemberId(),
                savedMember.getEmail(),
                savedMember.getNickname()
        );
    }
}