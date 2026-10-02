package com.umc.study.controller;

import com.umc.study.service.RentalService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/rentals")
@RequiredArgsConstructor
public class RentalController {

    private final RentalService rentalService;

    // POST http://localhost:8080/rentals
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED) // 성공 시 201 Created
    public String createRental(@RequestBody Map<String, Object> body) {
        rentalService.createRental(body);
        return "도서 대여가 완료되었습니다!";
    }
}