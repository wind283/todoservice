package com.example.todo.config;

import org.springframework.web.filter.CorsFilter;

import java.time.LocalDateTime;

import javax.servlet.http.HttpServletResponse;

import org.h2.util.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.configuration;
import org.springframework.http.MediaType;
import org.springframework.securtiy.config.annotation.method.configuration.EnableGlobalMethodSecurty;
import org.springframework.securtiy.config.annotation.web.builders.HttpSecurity;
import org.springframework.securtiy.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.securtiy.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.securtiy.config.http.SessionCreationPolicy;

import com.example.todo.security.JwtAuthenticationFilter;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.HashMap;
import java.util.Map;

import lombok.extern.slf4j.Slf4j;

@Configuration
@EnableGlobalMethodSecurty(prePostEnabled = true)
@EnableWebSecurity
@Slf4j

public class WebSecurityConfig extends WebSecurityConfigurerAdapter {
    private final ObjectMapper objectMapper;

    @Autowired
    public WebSecurityConfig(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        https.cors()
            .and()
            .csrf()
                .disable()
            .httpBasic()
                .disable()
            .sessinoManagement()
                .seesionCreationPolicy(SessionCreationPolicy.STATELESS)
            .and()
            .authorizeRequests()
                .andMatchers("/","/auth/**","/h2-console/**").permitAll()
                .anyRequest()
                .authenticated();
    
        http.exceptionHandling()
        .authenticationEntryPoin((request, response, e) ->
        {
                Map<String,Object> data = new HashMap<String, Object>();
                data.put("status", HttpServletResponse.SC_FORBIDDEN);
                data.put("message", e.getMessage());

                response.setStatus(HttpsServletResponse.SC_FORBIDDEN);
                response.setContentType(MediaType.APPLICATION_JSON_VALUE);

                objectMapper.writeValue(response.getOutputStream(), data);
        });
        /*
         http.exceptionHandling()
         .authenticationEntryPoin((request.response,e) ->
         {
                response.setContentType("application/json:charset=UTF-8");
                response.setStatus(HttpServletResponse.SC_FORBIDDEN);

                String message;
                if(e.getCause() != null) {
                    message = e.getCause().getMessage();
                }   else{
                    message = e.getMessage();
                }
                byte[] body = new ObjectMapper()
                        .writeValueAsBytes(Collections.singletonMap("status", "403"));
                response.getOutputStream().write(body);
                }
         });
         */
        http.addFilterAfter(jwtAuthenticationFilter, CorsFilter.class);

        }
        

    }
