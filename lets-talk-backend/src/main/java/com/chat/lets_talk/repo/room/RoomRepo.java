package com.chat.lets_talk.repo.room;

import com.chat.lets_talk.entity.room.Room;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface RoomRepo extends MongoRepository<Room, String> {
    void deleteByRoomId(String id);
    Optional<Room> findByRoomId(String id);
}
