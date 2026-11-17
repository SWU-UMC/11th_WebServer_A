package com.umc.movie.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

// 회원은 토큰으로 식별하므로 요청 Body에는 영화 ID만 받습니다.
public record CreateFavoriteRequest(
        @NotNull(message = "영화 ID는 필수입니다.")
        @Positive(message = "영화 ID는 양수여야 합니다.")
        Long movieId
) {
}
