package com.umc.movie.interceptor;

import com.umc.movie.exception.ApiException;
import com.umc.movie.util.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
@RequiredArgsConstructor
public class AuthInterceptor implements HandlerInterceptor {

    // JWT에서 확인한 로그인 회원 ID를 request에 저장할 때 사용하는 이름
    // 이후 Controller에서 같은 이름으로 꺼내 현재 로그인한 회원을 확인할 수 있습니다.
    public static final String MEMBER_ID = "memberId";

    // Authorization 헤더는 "Bearer {JWT}" 형식으로 전달됩니다.
    private static final String BEARER_PREFIX = "Bearer ";

    private final JwtUtil jwtUtil;

    /**
     * Controller가 실행되기 전에 호출되어 요청의 JWT를 검사합니다.
     * 토큰이 정상이라면 로그인한 회원 ID를 request에 저장하고 요청을 계속 진행합니다.
     * 토큰이 없거나 잘못된 경우에는 예외를 발생시켜 Controller까지 요청이 전달되지 않도록 합니다.
     */
    @Override
    public boolean preHandle(
            HttpServletRequest request,
            HttpServletResponse response,
            Object handler
    ) {
        // 브라우저는 실제 요청 전에 CORS 허용 여부를 확인하기 위해
        // OPTIONS 사전 요청을 보낼 수 있습니다.
        // 이 요청에는 JWT가 없을 수 있으므로 인증 검사를 하지 않고 통과시킵니다.
        if (HttpMethod.OPTIONS.matches(request.getMethod())) {
            return true;
        }

        // 요청의 Authorization 헤더를 가져옵니다.
        // 정상적인 경우 "Bearer eyJ..."와 같은 값이 들어 있습니다.
        String header = request.getHeader(HttpHeaders.AUTHORIZATION);

        // Authorization 헤더가 없거나 "Bearer "로 시작하지 않으면
        // 로그인 토큰이 없는 요청으로 판단합니다.
        if (header == null || !header.startsWith(BEARER_PREFIX)) {
            throw new ApiException(
                    HttpStatus.UNAUTHORIZED,
                    "AUTH401_2",
                    "로그인이 필요한 요청입니다."
            );
        }

        // "Bearer " 부분을 제거하여 실제 JWT만 꺼냅니다.
        String token = header.substring(BEARER_PREFIX.length());

        // JwtUtil이 JWT의 서명과 만료 여부를 검증하고,
        // 정상적인 토큰이면 토큰의 sub에 저장된 회원 ID를 반환합니다.
        // 위조된 토큰이나 만료된 토큰은 JwtUtil에서 각각 예외로 처리합니다.
        Long memberId = jwtUtil.getMemberId(token);

        // 현재 로그인한 회원을 알아야 하는 컨트롤러가 꺼내 쓸 수 있도록,
        // JWT에서 확인한 회원 ID를 이 요청에 저장합니다.
        request.setAttribute(MEMBER_ID, memberId);

        // 인증에 성공했으므로 Controller까지 요청을 계속 진행합니다.
        return true;
    }
}