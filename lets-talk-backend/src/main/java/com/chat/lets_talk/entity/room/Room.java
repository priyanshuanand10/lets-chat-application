package com.chat.lets_talk.entity.room;


import com.chat.lets_talk.dto.message.MessageDto;
import com.chat.lets_talk.entity.message.Message;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;


@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
@Document(value = "ROOM")
public class Room {
    @Id
    private String id;
    private String roomId;
    private String createdBy;
    private LocalDateTime createdOn;
    private List<Message> messages = new ArrayList<>();
}
