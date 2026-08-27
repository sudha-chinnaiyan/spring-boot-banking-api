package com.sudha.banking.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sudha.banking.dto.AccountCreateDto;
import com.sudha.banking.dto.AccountDto;
import com.sudha.banking.entity.AccountType;
import com.sudha.banking.service.AccountService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

@WebMvcTest(AccountController.class)
@AutoConfigureMockMvc(addFilters = false)
class AccountControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private AccountService accountService;

    private ObjectMapper objectMapper = new ObjectMapper().registerModule(new JavaTimeModule());

    @Test
    @WithMockUser
    void shouldCreateAccount() throws Exception {
        AccountCreateDto request = AccountCreateDto.builder()
                .customerId(1L)
                .accountType(AccountType.SAVINGS)
                .initialDeposit(new BigDecimal("100.00"))
                .build();

        AccountDto response = AccountDto.builder()
                .id(1L)
                .customerId(1L)
                .accountNumber("ACCT-123")
                .balance(new BigDecimal("100.00"))
                .build();

        when(accountService.createAccount(any(AccountCreateDto.class))).thenReturn(response);

        mockMvc.perform(post("/api/v1/accounts")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.accountNumber").value("ACCT-123"));
    }

    @Test
    @WithMockUser
    void shouldGetAccountsByCustomerId() throws Exception {
        AccountDto response = AccountDto.builder().id(1L).customerId(1L).build();

        when(accountService.getAccountsByCustomerId(1L)).thenReturn(List.of(response));

        mockMvc.perform(get("/api/v1/accounts/customer/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1L));
    }
}
