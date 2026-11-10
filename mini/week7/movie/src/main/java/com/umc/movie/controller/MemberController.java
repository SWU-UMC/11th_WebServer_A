package com.umc.movie.controller;

import com.umc.movie.dto.*;
import com.umc.movie.interceptor.AuthInterceptor;
import com.umc.movie.service.MemberService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

// /members로 시작하는 요청을 받고, 실제 회원 처리는 MemberService에 맡깁니다.
@RestController
@RequiredArgsConstructor
@RequestMapping("/members")
public class MemberController {

    private final MemberService memberService;

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<MemberInfoResponse>> getMyInfo(
            // URL에 회원 ID가 없으므로, 인터셉터가 JWT 검증 후 현재 요청에 저장한 ID를 꺼냅니다.
            @RequestAttribute(AuthInterceptor.MEMBER_ID) Long memberId
    ) {
        MemberInfoResponse response = memberService.getMyInfo(memberId);
        return ResponseEntity.ok(ApiResponse.ok("회원 정보를 조회했습니다.", response));
    }

    @PatchMapping("/me")
    public ResponseEntity<ApiResponse<MemberInfoResponse>> updateMyInfo(
            // 인터셉터가 검증한 회원 ID로 수정 대상을 결정합니다.
            @RequestAttribute(AuthInterceptor.MEMBER_ID) Long memberId,
            // JSON의 nickname을 DTO로 받고 @Valid로 빈 값과 길이를 검사합니다.
            @RequestBody @Valid MemberUpdateRequest request
    ) {
        MemberInfoResponse response = memberService.updateMyInfo(memberId, request);
        return ResponseEntity.ok(ApiResponse.ok("회원 정보를 수정했습니다.", response));
    }

    // URL의 {nickname} 값을 @PathVariable로 받아 닉네임 사용 가능 여부를 조회합니다.
    @GetMapping("/nickname/{nickname}")
    public NicknameCheckResponse checkNickname(@PathVariable String nickname) {
        return memberService.checkNickname(nickname);
    }

    // 회원가입 전에 이메일 중복을 확인하는 공개 API입니다.
    @GetMapping("/email/{email}")
    public EmailCheckResponse checkEmail(@PathVariable String email) {
        return memberService.checkEmail(email);
    }

    // POST /members의 JSON을 DTO로 변환하고, @Valid로 DTO에 선언된 입력 규칙을 검사합니다.
    @PostMapping
    public ResponseEntity<ApiResponse<MemberResponse>> signUp(
            @Valid @RequestBody SignUpRequest request
    ) {
        MemberResponse response = memberService.signUp(request);

        // 회원이 새로 만들어졌으므로 HTTP 201과 공통 성공 응답(COMMON201)을 반환합니다.
        return ResponseEntity.status(201)
                .body(ApiResponse.created("회원가입에 성공했습니다.", response));
    }

}