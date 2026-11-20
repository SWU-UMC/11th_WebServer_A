package com.umc.movie.service;

import com.umc.movie.dto.CreateRatingRequest;
import com.umc.movie.dto.RatingCreateRequest;
import com.umc.movie.dto.RatingResponse;
import com.umc.movie.dto.UpdateRatingRequest;
import com.umc.movie.entity.Member;
import com.umc.movie.entity.Rating;
import com.umc.movie.exception.ApiException;
import com.umc.movie.repository.MemberRepository;
import com.umc.movie.repository.RatingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RatingService {

    private final RatingRepository ratingRepository;
    private final MemberRepository memberRepository;

    // 공개 조회의 memberId는 조회 대상입니다. 로그인한 회원과 달라도 조회할 수 있습니다.
    @Transactional(readOnly = true)
    public List<RatingResponse> getRatingsByMember(Long memberId) {
        if (!memberRepository.existsById(memberId)) {
            throw new ApiException(HttpStatus.NOT_FOUND, "MEMBER404_1",
                    "해당 회원을 찾을 수 없습니다.");
        }

        return ratingRepository.findByMember_MemberIdOrderByRatingIdDesc(memberId).stream()
                .map(RatingResponse::from)
                .toList();
    }

    // 기존 영화별 등록 경로도 JWT의 회원 ID를 받아 같은 등록 로직을 사용합니다.
    @Transactional
    public RatingResponse createRating(Long memberId, Long movieId, RatingCreateRequest request) {
        return create(memberId, new CreateRatingRequest(movieId, request.score(), request.comment()));
    }

    @Transactional
    public RatingResponse create(Long memberId, CreateRatingRequest request) {
        // 토큰이 유효해도 회원이 삭제됐을 수 있으므로 현재 DB의 회원을 확인합니다.
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "MEMBER404_1",
                        "해당 회원을 찾을 수 없습니다."));

        // 중복 기준은 회원과 영화의 조합입니다. 다른 회원은 같은 영화에 등록할 수 있습니다.
        if (ratingRepository.existsByMember_MemberIdAndMovieId(memberId, request.movieId())) {
            throw new ApiException(HttpStatus.CONFLICT, "RATING409_1",
                    "이미 이 영화에 평점을 남기셨습니다.");
        }

        Rating rating = Rating.builder()
                .member(member)
                .movieId(request.movieId())
                .score(request.score())
                .comment(request.comment())
                .build();

        // 저장 후 생성된 평점 ID와 평점 정보를 응답 DTO에 담습니다.
        return RatingResponse.from(ratingRepository.save(rating));
    }

    @Transactional
    public RatingResponse update(Long memberId, Long ratingId, UpdateRatingRequest request) {
        Rating rating = findOwnedRating(memberId, ratingId);
        rating.update(request.score(), request.comment());
        ratingRepository.save(rating);
        return RatingResponse.from(rating);
    }

    @Transactional
    public void delete(Long memberId, Long ratingId) {
        Rating rating = findOwnedRating(memberId, ratingId);
        ratingRepository.delete(rating);
    }

    /**
     * 수정과 삭제에서 평점 존재 여부와 소유권을 함께 확인합니다.
     * 첫 인자는 JWT로 확인한 요청자, 두 번째 인자는 URL에서 받은 대상 평점입니다.
     */
    private Rating findOwnedRating(Long memberId, Long ratingId) {
        Rating rating = ratingRepository.findById(ratingId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "RATING404_1",
                        "해당 평점을 찾을 수 없습니다."));

        // 인증은 토큰이 유효한지 확인하는 일이고, 인가는 이 평점을 바꿀 권한이 있는지 확인하는 일입니다.
        // JWT의 회원 ID와 DB에 저장된 실제 작성자 ID가 다르면 403으로 차단합니다.
        if (!rating.getMember().getMemberId().equals(memberId)) {
            throw new ApiException(HttpStatus.FORBIDDEN, "RATING403_1",
                    "본인이 작성한 평점만 수정하거나 삭제할 수 있습니다.");
        }

        return rating;
    }
}
