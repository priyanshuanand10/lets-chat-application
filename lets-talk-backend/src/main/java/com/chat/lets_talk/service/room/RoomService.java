package com.chat.lets_talk.service.room;

import com.chat.lets_talk.dto.response.SuccessResponse;
import com.chat.lets_talk.dto.room.RoomDto;

public interface RoomService {
    SuccessResponse addRoom(RoomDto roomDto);

    SuccessResponse deleteRoom(String roomId);

    SuccessResponse getAllRooms();

    SuccessResponse getRoomByRoomId(String roomId);
}
