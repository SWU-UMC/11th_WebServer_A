package com.umc.study.repository;

import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository // 스프링 컨테이너에 "나 창고지기 부품이야!"라고 등록
@RequiredArgsConstructor
public class BookRepository {

    // 2단계에서 준비된 스프링의 DB 통신 도구(JdbcTemplate) 주입
    private final JdbcTemplate jdbcTemplate;

    public List<Map<String, Object>> findAll() {
        String sql = "SELECT * FROM book";

        // 쿼리를 실행하고 결과를 List<Map> 형태의 날것 데이터로 긁어옵니다.
        // Map의 Key는 '컬럼명(title)', Value는 '실제 데이터(달빛 도서관)'가 됩니다.
        return jdbcTemplate.queryForList(sql);
    }
}