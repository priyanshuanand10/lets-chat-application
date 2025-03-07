package com.chat.lets_talk.controller;

import com.chat.lets_talk.dto.response.SuccessResponse;
import com.chat.lets_talk.dto.room.RoomDto;
import com.chat.lets_talk.service.room.RoomService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@Slf4j
@RequiredArgsConstructor
@RequestMapping("/room")
public class RoomController {

    private final RoomService roomService;

    @PostMapping("/add-room")
    public ResponseEntity<SuccessResponse> addRoom(@RequestBody RoomDto roomDto) {
        log.info("::inside RoomController : method addRoom :  roomDto : {}", roomDto);
        SuccessResponse response = roomService.addRoom(roomDto);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/delete-room/{room-id}")
    public ResponseEntity<SuccessResponse> deleteRoom(@PathVariable(name = "room-id") String roomId) {
        log.info("::inside RoomController : method deleteRoom :  roomId : {}", roomId);
        SuccessResponse response = roomService.deleteRoom(roomId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/get-all-rooms")
    public ResponseEntity<SuccessResponse> getAllRooms() {
        log.info("::inside RoomController : method deleteRoom");
        SuccessResponse response = roomService.getAllRooms();
        return ResponseEntity.ok(response);
    }
    @GetMapping("/get-room/{room-id}")
    public ResponseEntity<SuccessResponse> getRoomByRoomId(@PathVariable(name = "room-id") String roomId) {
        log.info("::inside RoomController : method getRoomByRoomId :  roomId : {}", roomId);
        SuccessResponse response = roomService.getRoomByRoomId(roomId);
        return ResponseEntity.ok(response);
    }


}
