package com.chat.lets_talk.service.message;

import com.chat.lets_talk.dto.message.MessageDto;
import com.chat.lets_talk.dto.response.SuccessResponse;
import com.chat.lets_talk.dto.room.RoomDto;
import com.chat.lets_talk.entity.message.Message;
import com.chat.lets_talk.entity.room.Room;
import com.chat.lets_talk.exception.CustomException;
import com.chat.lets_talk.repo.room.RoomRepo;
import com.chat.lets_talk.utility.LTUtility;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Collections;
import java.util.List;
import java.util.UUID;


@Slf4j
@Service
@RequiredArgsConstructor
public class MessageServiceImpl implements MessageService {
    private final RoomRepo roomRepo;

    private static String geenarteUUID() {

        return UUID.randomUUID().toString().replace("-", "");
    }

    @Override
    public MessageDto addMessage(String roomId, MessageDto messageDto) {
        log.info(":: Inside MessageServiceImpl : method addMessage : roomId  = {} : messageDto = {}", roomId, messageDto);
        messageDto.setId(geenarteUUID());
        LocalDateTime now = LocalDateTime.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm:ss");
        String formattedDateTime = now.format(formatter);
        messageDto.setMsgTime(LocalDateTime.parse(formattedDateTime, formatter));
        Room chats = roomRepo.findByRoomId(roomId).orElseThrow(() -> new CustomException("Record not found", HttpStatus.NOT_FOUND));
        chats.getMessages().add(LTUtility.toEntity(messageDto, Message.class));
        roomRepo.save(chats);
//        RoomDto roomDto = LTUtility.toDto(savedChat, RoomDto.class);
//        return SuccessResponse.builder()
//                .httpStatus(HttpStatus.OK.value())
//                .message(HttpStatus.OK.name())
//                .data(messageDto)
//                .build();
        return messageDto;
    }

    @Override
    public SuccessResponse updateMessage(String roomId, MessageDto messageDto) {
        log.info(":: Inside MessageServiceImpl : method updateMessage :roomId : {} , messageDto = {}", roomId, messageDto);

        Room chats = roomRepo.findByRoomId(roomId).orElseThrow(() -> new CustomException("Record not found", HttpStatus.NOT_FOUND));
        List<Message> messages = chats.getMessages();
        Message message = messages.stream().filter(x -> x.getId().equals(messageDto.getId())).toList().get(0);
        messages.remove(message);
        message.setMessage(messageDto.getMessage());
        messages.add(message);
        Collections.sort(messages, (o1, o2) -> o1.getMsgTime().isAfter(o2.getMsgTime()) ? 1 : -1);
        chats.setMessages(messages);
        Room savedChat = roomRepo.save(chats);
        RoomDto roomDto = LTUtility.toDto(savedChat, RoomDto.class);
        return SuccessResponse.builder()
                .httpStatus(HttpStatus.OK.value())
                .message(HttpStatus.OK.name())
                .data(roomDto)
                .build();
    }
}
