package com.chat.lets_talk.service.room;

import com.chat.lets_talk.dto.response.SuccessResponse;
import com.chat.lets_talk.dto.room.RoomDto;
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
import java.util.List;
import java.util.Optional;


@Service
@Slf4j
@RequiredArgsConstructor
public class RoomServiceImpl implements RoomService {

    private final RoomRepo roomRepo;

    @Override
    public SuccessResponse addRoom(RoomDto roomDto) {
        log.info(":: inside RoomServiceImpl : method addRoom : roomDto : {} ", roomDto);
        LocalDateTime now = LocalDateTime.now();

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm:ss");
        String formattedDateTime = now.format(formatter);
        roomDto.setCreatedOn(LocalDateTime.parse(formattedDateTime , formatter));
        Room entity = LTUtility.toEntity(roomDto, Room.class);
        Optional<Room> roomOptional = roomRepo.findByRoomId(roomDto.getRoomId());
        if (roomOptional.isEmpty()) {
            Room saved = roomRepo.save(entity);
            RoomDto roomNew = LTUtility.toDto(saved, RoomDto.class);
            log.info("saved data {}", saved);
            return SuccessResponse.builder()
                    .httpStatus(HttpStatus.CREATED.value())
                    .message(HttpStatus.CREATED.getReasonPhrase())
                    .data(roomNew)
                    .build();
        } else {
            throw new CustomException("Room Already Exists", HttpStatus.BAD_REQUEST);
        }
    }

    @Override
    public SuccessResponse deleteRoom(String roomId) {
        try {
            log.info(":: inside RoomServiceImpl : method deleteRoom : roomId : {} ", roomId);
            roomRepo.deleteByRoomId(roomId);
            log.info("deleted successfully");
            return SuccessResponse.builder()
                    .httpStatus(HttpStatus.OK.value())
                    .message(HttpStatus.OK.getReasonPhrase())
                    .data("DELETED SUCCESSFULLY").build();
        } catch (Exception e) {
            log.error("Error while deleting record : ", e);
            throw new CustomException(e.getLocalizedMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @Override
    public SuccessResponse getAllRooms() {
        try {
            log.info(":: inside RoomServiceImpl : method getAllRooms");
            List<RoomDto> allRoomDetails = roomRepo.findAll().stream().map(e -> LTUtility.toDto(e, RoomDto.class)).toList();
            log.info("fetched successfully : {}", allRoomDetails);
            return SuccessResponse.builder()
                    .httpStatus(HttpStatus.OK.value())
                    .message(HttpStatus.OK.getReasonPhrase())
                    .data(allRoomDetails)
                    .build();

        } catch (Exception e) {
            log.error("Error while getting record : ", e);
            throw new CustomException(e.getLocalizedMessage(), HttpStatus.INTERNAL_SERVER_ERROR);

        }
    }

    @Override
    public SuccessResponse getRoomByRoomId(String roomId) {

        log.info(":: inside RoomServiceImpl : method getRoomByRoomId : roomId : {} ", roomRepo);
        Room record = roomRepo.findByRoomId(roomId)
                .orElseThrow(() -> new CustomException("Room does not exist", HttpStatus.NOT_FOUND));
        log.info("fetched successfully : {}", record);
        RoomDto roomDto = LTUtility.toDto(record, RoomDto.class);
        return SuccessResponse.builder()
                .httpStatus(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(roomDto)
                .build();

    }

}
