package com.umc.movie.dto;

// addToFavorites가 false면 favorite은 null로 응답합니다.
public record MovieRecordResponse(
        RatingResponse rating,
        FavoriteResponse favorite
) {
}
