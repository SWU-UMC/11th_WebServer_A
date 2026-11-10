package com.umc.movie.controller;

import com.umc.movie.dto.RatingCreateRequest;
import com.umc.movie.dto.RatingResponse;
import com.umc.movie.interceptor.AuthInterceptor;
import com.umc.movie.service.RatingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/movies")
public class MovieController {

    private final RatingService ratingService;

    @PostMapping("/{movieId}/ratings")
    @ResponseStatus(HttpStatus.CREATED)
    public RatingResponse createRating(
            // 기존 경로에서도 고정된 1번 회원 대신 JWT로 확인한 회원을 작성자로 사용합니다.
            @RequestAttribute(AuthInterceptor.MEMBER_ID) Long memberId,
            @PathVariable Long movieId,
            @Valid @RequestBody RatingCreateRequest request
    ) {
        return ratingService.createRating(memberId, movieId, request);
    }
}