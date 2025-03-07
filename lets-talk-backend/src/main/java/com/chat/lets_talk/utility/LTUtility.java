package com.chat.lets_talk.utility;


import org.modelmapper.ModelMapper;


public class LTUtility {
    private static final ModelMapper modelMapper = new ModelMapper();

    public static <U, V> V toDto(U entity, Class<V> dto) {
        return modelMapper.map(entity, dto);
    }

    public static <U, V> V toEntity(U dto, Class<V> entity) {
        return modelMapper.map(dto, entity);
    }

}
