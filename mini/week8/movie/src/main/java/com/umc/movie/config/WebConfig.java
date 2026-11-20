package com.umc.movie.config;

import com.umc.movie.interceptor.AuthInterceptor;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@RequiredArgsConstructor
public class WebConfig implements WebMvcConfigurer {

    private final AuthInterceptor authInterceptor;

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // 모든 API 경로에 CORS 설정 적용
                // 프론트엔드(localhost:5173)에서 오는 요청을 허용합니다.
                .allowedOrigins("http://localhost:5173")
                .allowedMethods("GET", "POST", "PATCH", "DELETE")
                .allowedHeaders("*");
    }

    /**
     * AuthInterceptor를 Spring MVC에 등록하여
     * Controller 실행 전에 JWT 인증 검사를 수행하도록 설정합니다.
     *
     * 기본적으로 모든 경로를 인증 대상으로 설정하고,
     * 로그인이나 회원가입처럼 로그인 전에도 사용할 수 있어야 하는
     * 공개 API만 인증 대상에서 제외합니다.
     */
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(authInterceptor)

                // 모든 요청을 기본적으로 JWT 인증 대상으로 설정합니다.
                .addPathPatterns("/**")

                // 아래 경로들은 로그인하지 않은 사용자도 접근할 수 있어야 하므로
                // AuthInterceptor의 인증 검사 대상에서 제외합니다.
                .excludePathPatterns(
                        "/auth/**",              // 로그인 등 인증 관련 API
                        "/members",              // 회원가입
                        "/members/nickname/**",  // 닉네임 관련 공개 API
                        "/members/email/**",     // 이메일 관련 공개 API

                        // 기존 경로를 사용하는 평점 조회/등록 API입니다.
                        // excludePathPatterns는 HTTP Method가 아니라 경로를 기준으로 하므로
                        // 현재 이 주소를 공유하는 GET과 POST 요청이 모두 인증에서 제외됩니다.
                        "/members/*/ratings",

                        // Spring Boot가 오류를 처리할 때 사용하는 경로이므로 제외합니다.
                        "/error"
                );
    }
}