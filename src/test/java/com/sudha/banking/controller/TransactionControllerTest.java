package com.sudha.banking.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sudha.banking.dto.TransactionDto;
import com.sudha.banking.dto.TransferRequestDto;
import com.sudha.banking.entity.TransactionStatus;
import com.sudha.banking.service.TransactionService;
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

@WebMvcTest(TransactionController.class)
@AutoConfigureMockMvc(addFilters = false)
class TransactionControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private TransactionService transactionService;

    private ObjectMapper objectMapper = new ObjectMapper().registerModule(new JavaTimeModule());

    @Test
    @WithMockUser
    void shouldTransferFunds() throws Exception {
        TransferRequestDto request = TransferRequestDto.builder()
                .sourceAccountId(1L)
                .destinationAccountId(2L)
                .amount(new BigDecimal("50.00"))
                .build();

        TransactionDto response = TransactionDto.builder()
                .id(1L)
                .amount(new BigDecimal("50.00"))
                .status(TransactionStatus.COMPLETED)
                .build();

        when(transactionService.transferFunds(any(TransferRequestDto.class))).thenReturn(response);

        mockMvc.perform(post("/api/v1/transactions/transfer")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.status").value("COMPLETED"));
    }

    @Test
    @WithMockUser
    void shouldGetTransactions() throws Exception {
        TransactionDto response = TransactionDto.builder().id(1L).amount(new BigDecimal("10")).build();

        when(transactionService.getTransactionsByAccountId(1L)).thenReturn(List.of(response));

        mockMvc.perform(get("/api/v1/transactions/account/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1L));
    }
}
