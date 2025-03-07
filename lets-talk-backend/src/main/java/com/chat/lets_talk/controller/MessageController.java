package com.chat.lets_talk.controller;

import com.chat.lets_talk.dto.message.MessageDto;
import com.chat.lets_talk.service.message.MessageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;

@Controller
//@RequestMapping("/message")
@Slf4j
@RequiredArgsConstructor
public class MessageController {

    private final MessageService messageService;


//    @PostMapping("/add-message/{room-id}")

    @MessageMapping("/add-message/{roomId}")
    @SendTo("/topic/room/{roomId}")
    public ResponseEntity<MessageDto> addMessageToRoom(@DestinationVariable String roomId,
                                                       @RequestBody MessageDto messageDto) {
        log.info(":: Inside MessageController : method addMessageToRoom : roomId  = {} : messageDto = {}", roomId, messageDto);
        MessageDto message = messageService.addMessage(roomId, messageDto);
        return ResponseEntity.ok(message);

    }

//    @PostMapping("/update-message/{room-id}")
//    public ResponseEntity<SuccessResponse> updateMessageToRoom(@PathVariable(name = "room-id") String roomId, @RequestBody MessageDto messageDto) {
//        log.info(":: Inside MessageController : method updateMessageToRoom : roomId : {} , messageDto = {}", roomId, messageDto);
//        SuccessResponse successResponse = messageService.updateMessage(roomId, messageDto);
//        return ResponseEntity.ok(successResponse);
//
//    }


}
