package com.umc.movie.service;

import com.umc.movie.dto.RatingCreateRequest;
import com.umc.movie.entity.Member;
import com.umc.movie.entity.Rating;
import com.umc.movie.dto.RatingResponse;
import com.umc.movie.repository.RatingRepository;
import com.umc.movie.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RatingService {

    private final RatingRepository ratingRepository;
    private final MemberRepository memberRepository;

    // 로그인 기능 전까지는 1번 회원이 작성하는 것으로 처리합니다.
    private static final Long TEMP_MEMBER_ID = 1L;

    @Transactional(readOnly = true)
    public List<RatingResponse> getRatingsByMember(Long memberId) {
        if (!memberRepository.existsById(memberId)) {
            // @RestControllerAdvice로 예외를 한 곳에서 다루는 방법은 6주차에 배웁니다.
            // 지금은 Spring이 기본 제공하는 ResponseStatusException으로 404를 바로 응답합니다.
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "존재하지 않는 유저입니다.");
        }

        return ratingRepository.findByMember_MemberIdOrderByRatingIdDesc(memberId).stream()
                .map(RatingResponse::from)
                .toList();
    }

    @Transactional
    public RatingResponse createRating(Long movieId, RatingCreateRequest request) {
        Member member = memberRepository.findById(TEMP_MEMBER_ID)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "존재하지 않는 유저입니다."));

        if (ratingRepository.existsByMember_MemberIdAndMovieId(TEMP_MEMBER_ID, movieId)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "이미 평점을 남긴 영화입니다.");
        }

        Rating rating = new Rating(member, movieId, request.score(), request.comment());
        Rating savedRating = ratingRepository.save(rating);

        return RatingResponse.from(savedRating);
    }
}