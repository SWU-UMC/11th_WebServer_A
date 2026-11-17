package com.umc.movie.repository;

import com.umc.movie.entity.Favorite;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FavoriteRepository extends JpaRepository<Favorite, Long> {

    // 내 즐겨찾기 목록을 최신 등록 순서로 조회합니다.
    List<Favorite> findByMember_MemberIdOrderByFavoriteIdDesc(Long memberId);

    // 해제할 즐겨찾기를 회원과 영화의 조합으로 찾습니다.
    Optional<Favorite> findByMember_MemberIdAndMovieId(Long memberId, Long movieId);

    // 중복 등록 검사와 즐겨찾기 여부 조회에 사용합니다.
    boolean existsByMember_MemberIdAndMovieId(Long memberId, Long movieId);
}
