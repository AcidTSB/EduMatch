package com.edumatch.getway.service;

import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.StreamUtils;
import org.springframework.web.client.RestTemplate;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.net.URI;
import java.util.Enumeration;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProxyService {

    private final RestTemplate restTemplate = new RestTemplate();

    /**
     * Forward request tới targetUri (bao gồm path + query).
     * Trả về ResponseEntity<byte[]> để giữ nguyên body binary/text.
     */
    public ResponseEntity<byte[]> forward(String targetUri, HttpServletRequest clientRequest) throws IOException {
        HttpMethod method;
        try {
            method = HttpMethod.valueOf(clientRequest.getMethod());
        } catch (IllegalArgumentException e) {
            method = HttpMethod.GET;
        }


        // copy headers
        HttpHeaders headers = new HttpHeaders();
        Enumeration<String> headerNames = clientRequest.getHeaderNames();
        while (headerNames != null && headerNames.hasMoreElements()) {
            String name = headerNames.nextElement();
            Enumeration<String> values = clientRequest.getHeaders(name);
            while (values.hasMoreElements()) {
                headers.add(name, values.nextElement());
            }
        }

        byte[] body = new byte[0];
        if (clientRequest.getContentLength() > 0 || clientRequest.getInputStream() != null) {
            body = StreamUtils.copyToByteArray(clientRequest.getInputStream());
        }

        HttpEntity<byte[]> httpEntity = new HttpEntity<>(body, headers);

        ResponseEntity<byte[]> resp = restTemplate.exchange(
                URI.create(targetUri),
                method,
                httpEntity,
                byte[].class
        );

        // build response with status, headers, body
        HttpHeaders respHeaders = new HttpHeaders();
        // copy response headers (some headers like Transfer-Encoding nên cân nhắc)
        for (String h : resp.getHeaders().keySet()) {
            List<String> vs = resp.getHeaders().get(h);
            if (vs != null) {
                for (String v : vs) respHeaders.add(h, v);
            }
        }

        return new ResponseEntity<>(resp.getBody(), respHeaders, resp.getStatusCode());
    }
}