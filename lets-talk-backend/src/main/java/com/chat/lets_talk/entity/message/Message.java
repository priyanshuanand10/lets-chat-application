package com.chat.lets_talk.entity.message;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class Message {
    private String id;
    private String sentBy;
    private LocalDateTime msgTime;
    private String message;
}
