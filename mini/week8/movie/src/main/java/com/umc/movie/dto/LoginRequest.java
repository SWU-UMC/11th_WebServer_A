package com.umc.movie.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record LoginRequest(
        @NotBlank(message = "이메일을 입력해주세요.")
        @Email(message = "이메일 형식이 올바르지 않습니다.")
        String email,

        // 기존 회원도 로그인할 수 있도록 가입 시의 비밀번호 복잡도 규칙은 적용하지 않습니다.
        @NotBlank(message = "비밀번호를 입력해주세요.")
        String password
) {}
