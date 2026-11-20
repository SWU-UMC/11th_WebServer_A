package com.umc.movie.util;

import com.umc.movie.exception.ApiException;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.time.Instant;
import java.util.Date;

@Component
public class JwtUtil {

    private final SecretKey secretKey;
    private final Duration accessExpiration;

    public JwtUtil(
            @Value("${jwt.secret}") String secret,
            @Value("${jwt.access-expiration}") Long accessExpiration
    ) {
        // 문자열 비밀키를 JWT 서명에 사용할 HMAC 키 객체로 변환
        this.secretKey = Keys.hmacShaKeyFor(
                secret.getBytes(StandardCharsets.UTF_8)
        );

        // application.yml에서 받은 초 단위 만료 시간을 Duration으로 변환
        this.accessExpiration = Duration.ofSeconds(accessExpiration);
    }

    /**
     * 로그인에 성공한 회원에게 발급할 Access Token을 생성합니다.
     */
    public String createAccessToken(Long memberId, String email) {
        Instant now = Instant.now();

        return Jwts.builder()
                // 토큰의 주인: memberId
                .subject(String.valueOf(memberId))
                // 참고용 부가 정보
                .claim("email", email)
                // 토큰 발급 시각
                .issuedAt(Date.from(now))
                // 토큰 만료 시각
                .expiration(Date.from(now.plus(accessExpiration)))
                // 비밀키로 서명
                .signWith(secretKey)
                .compact();
    }

    /**
     * JWT를 검증한 뒤 토큰의 subject에 저장된 memberId를 반환합니다.
     */
    public Long getMemberId(String token) {
        try {
            return Long.valueOf(
                    getClaims(token).getPayload().getSubject()
            );
        } catch (ExpiredJwtException e) {
            // 서명은 정상이지만 유효기간이 지난 경우
            throw new ApiException(
                    HttpStatus.UNAUTHORIZED,
                    "AUTH401_4",
                    "토큰이 만료되었습니다. 다시 로그인해주세요."
            );
        } catch (JwtException | IllegalArgumentException e) {
            // 서명 불일치, 잘못된 JWT 형식 등
            throw new ApiException(
                    HttpStatus.UNAUTHORIZED,
                    "AUTH401_3",
                    "유효하지 않은 토큰입니다."
            );
        }
    }

    private Jws<Claims> getClaims(String token) {
        return Jwts.parser()
                // 같은 비밀키를 이용해 JWT 서명 검증
                .verifyWith(secretKey)
                // 서버/클라이언트 시간 차이를 최대 60초까지 허용
                .clockSkewSeconds(60)
                .build()
                .parseSignedClaims(token);
    }
}