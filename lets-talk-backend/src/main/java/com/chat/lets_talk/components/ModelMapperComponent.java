package com.chat.lets_talk.components;

import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;

@Component
public class ModelMapperComponent {

    @Bean
    public ModelMapper getModelMapper() {
        return new ModelMapper();
    }

}
