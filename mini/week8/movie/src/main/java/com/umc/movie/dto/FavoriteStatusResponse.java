package com.umc.movie.dto;

// 즐겨찾기하지 않은 영화도 오류가 아니라 isFavorite: false인 정상 상태로 응답합니다.
public record FavoriteStatusResponse(
        boolean isFavorite
) {
}
