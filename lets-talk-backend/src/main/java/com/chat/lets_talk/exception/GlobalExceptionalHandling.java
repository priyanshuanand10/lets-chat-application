package com.chat.lets_talk.exception;

import com.chat.lets_talk.dto.response.SuccessResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionalHandling {


    @ExceptionHandler(CustomException.class)
    public ResponseEntity<SuccessResponse> handleCustomException(CustomException e) {
        SuccessResponse successResponse = SuccessResponse.builder().httpStatus(e.getHttpStatus().value())
                .message(e.getMessage())
                .build();
        return ResponseEntity.status(e.getHttpStatus()).body(successResponse);
    }

}
