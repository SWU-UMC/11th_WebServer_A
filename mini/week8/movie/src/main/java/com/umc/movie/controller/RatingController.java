package com.umc.movie.controller;

import com.umc.movie.dto.ApiResponse;
import com.umc.movie.dto.CreateRatingRequest;
import com.umc.movie.dto.RatingResponse;
import com.umc.movie.dto.UpdateRatingRequest;
import com.umc.movie.interceptor.AuthInterceptor;
import com.umc.movie.service.RatingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class RatingController {

    private final RatingService ratingService;

    // 클래스의 /members 매핑을 제거했으므로 조회 경로 전체를 적습니다.
    // 공개 조회는 누구나 특정 회원의 평점 목록을 볼 수 있는 기능입니다.
    // 여기의 memberId는 로그인한 요청자가 아니라 "목록을 조회할 대상 회원"을 지정하므로 URL에 남깁니다.
    // 예를 들어 /members/2/ratings는 로그인 여부와 관계없이 2번 회원의 평점 목록을 조회합니다.
    // 등록·수정·삭제는 요청자가 작성자여야 하므로 URL에서 회원 ID를 받지 않고 JWT의 회원 ID를 사용합니다.
    // 조회 대상과 요청자의 신원은 역할이 다르므로 공개 조회에서는 @PathVariable을 유지합니다.
    @GetMapping("/members/{memberId}/ratings")
    public List<RatingResponse> getMemberRatings(@PathVariable Long memberId) {
        return ratingService.getRatingsByMember(memberId);
    }

    // ApiResponse<T>의 T는 JSON 응답에서 result에 담기는 데이터의 타입입니다.
    // 이전에는 평점 ID(Long)만 반환했고, 이제는 등록한 평점 정보를 RatingResponse로 담습니다.
    @PostMapping("/ratings")
    public ResponseEntity<ApiResponse<RatingResponse>> create(
            // 작성자는 URL이나 Body가 아니라 인터셉터가 JWT 검증 후 저장한 회원 ID로 결정합니다.
            @RequestAttribute(AuthInterceptor.MEMBER_ID) Long memberId,
            @RequestBody @Valid CreateRatingRequest request
    ) {
        RatingResponse response = ratingService.create(memberId, request);
        return ResponseEntity.status(201)
                .body(ApiResponse.created("평점을 등록했습니다.", response));
    }

    @PatchMapping("/ratings/{ratingId}")
    public ResponseEntity<ApiResponse<RatingResponse>> update(
            @RequestAttribute(AuthInterceptor.MEMBER_ID) Long memberId,
            // URL은 수정할 평점만 지정합니다. 서비스에서 실제 작성자인지 확인합니다.
            @PathVariable Long ratingId,
            @RequestBody @Valid UpdateRatingRequest request
    ) {
        RatingResponse response = ratingService.update(memberId, ratingId, request);
        return ResponseEntity.ok(ApiResponse.ok("평점을 수정했습니다.", response));
    }

    @DeleteMapping("/ratings/{ratingId}")
    public ResponseEntity<ApiResponse<Void>> delete(
            @RequestAttribute(AuthInterceptor.MEMBER_ID) Long memberId,
            @PathVariable Long ratingId
    ) {
        ratingService.delete(memberId, ratingId);
        // 공통 JSON 응답을 보내기 위해 HTTP 200을 사용하고 result는 null로 둡니다.
        // HTTP 204는 응답 Body를 보낼 수 없으므로 이 응답 형식과 함께 사용할 수 없습니다.
        return ResponseEntity.ok(ApiResponse.ok("평점을 삭제했습니다.", null));
    }
}
