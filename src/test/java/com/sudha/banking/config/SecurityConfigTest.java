package com.sudha.banking.config;

import com.sudha.banking.controller.CustomerController;
import com.sudha.banking.service.CustomerService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.httpBasic;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.options;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.springframework.context.annotation.Import;

@WebMvcTest(CustomerController.class)
@Import(SecurityConfig.class)
public class SecurityConfigTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private CustomerService customerService;

    @Test
    void shouldDenyUnauthenticatedAccess() throws Exception {
        mockMvc.perform(get("/api/v1/customers/1"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void shouldAllowAuthenticatedAccess() throws Exception {
        mockMvc.perform(get("/api/v1/customers/1")
                .with(httpBasic("admin", "password")))
                .andExpect(status().isOk());
    }

    @Test
    void shouldDenyInvalidCredentials() throws Exception {
        mockMvc.perform(get("/api/v1/customers/1")
                .with(httpBasic("admin", "wrongpassword")))
                .andExpect(status().isUnauthorized());

        mockMvc.perform(get("/api/v1/customers/1")
                .with(httpBasic("wronguser", "password")))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void shouldHandleCorsPreflight() throws Exception {
        mockMvc.perform(options("/api/v1/customers/1")
                .header("Origin", "http://localhost:5173")
                .header("Access-Control-Request-Method", "GET")
                .header("Access-Control-Request-Headers", "Authorization, Content-Type"))
                .andExpect(status().isOk())
                .andExpect(header().string("Access-Control-Allow-Origin", "http://localhost:5173"))
                .andExpect(header().string("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS"))
                .andExpect(header().string("Access-Control-Allow-Headers", "Authorization, Content-Type"))
                .andExpect(header().string("Access-Control-Allow-Credentials", "true"));
    }
}
