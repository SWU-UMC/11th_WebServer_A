package com.umc.movie.dto;

// 공통 응답의 result에 닉네임과 인증 요청에 사용할 토큰을 담습니다.
public record LoginResponse(String nickname, String accessToken) {}
