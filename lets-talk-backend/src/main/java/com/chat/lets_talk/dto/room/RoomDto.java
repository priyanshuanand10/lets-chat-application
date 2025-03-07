package com.chat.lets_talk.dto.room;


import com.chat.lets_talk.dto.message.MessageDto;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;


@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class RoomDto {
    private String id;
    private String roomId;
    private String createdBy;
    @JsonFormat(shape = JsonFormat.Shape.STRING , pattern = "dd-MM-yyyy hh:mm:ss a")
    private LocalDateTime createdOn;
    private List<MessageDto> messages = new ArrayList<>();


}
