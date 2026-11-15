package com.umc.movie.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

// 컨트롤러의 @Valid가 빈 값 여부와 닉네임 길이(2~12자)를 검사합니다.
public record MemberUpdateRequest(
        @NotBlank(message = "닉네임을 입력해주세요.")
        @Size(min = 2, max = 12, message = "닉네임은 2자 이상 12자 이하여야 합니다.")
        String nickname
) {
}
