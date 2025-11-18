# Hướng dẫn xem Logs của Scholarship Service

## 1. Xem logs trong Docker (Khuyến nghị)

### Cách 1: Xem logs real-time (theo dõi liên tục)
```bash
docker logs -f scholarship-service-test
```

### Cách 2: Xem logs với giới hạn số dòng
```bash
# Xem 100 dòng cuối cùng
docker logs --tail 100 scholarship-service-test

# Xem 200 dòng cuối cùng
docker logs --tail 200 scholarship-service-test
```

### Cách 3: Xem logs với timestamp
```bash
docker logs -f --timestamps scholarship-service-test
```

### Cách 4: Xem logs từ thời điểm cụ thể
```bash
# Xem logs từ 10 phút trước
docker logs --since 10m scholarship-service-test

# Xem logs từ 1 giờ trước
docker logs --since 1h scholarship-service-test
```

## 2. Xem logs qua Docker Compose

Nếu bạn dùng `docker-compose`:

```bash
# Xem logs của tất cả services
docker-compose logs

# Xem logs của scholarship-service
docker-compose logs scholarship-service

# Xem logs real-time
docker-compose logs -f scholarship-service

# Xem logs với tail
docker-compose logs --tail=100 scholarship-service
```

## 3. Tìm kiếm trong logs

### Tìm kiếm JWT-related logs
```bash
docker logs scholarship-service-test 2>&1 | grep -i "jwt"
```

### Tìm kiếm authentication logs
```bash
docker logs scholarship-service-test 2>&1 | grep -i "authentication"
```

### Tìm kiếm error logs
```bash
docker logs scholarship-service-test 2>&1 | grep -i "error"
```

### Tìm kiếm logs của một request cụ thể
```bash
# Tìm logs có chứa "opportunities"
docker logs scholarship-service-test 2>&1 | grep -i "opportunities"
```

## 4. Xem logs trong file (nếu có cấu hình file logging)

Nếu service được cấu hình ghi logs vào file, bạn có thể:

```bash
# Vào trong container
docker exec -it scholarship-service-test bash

# Xem logs (nếu có)
cat /var/log/scholarship-service.log
# hoặc
tail -f /var/log/scholarship-service.log
```

## 5. Các log messages quan trọng cần tìm

Sau khi thêm logging, bạn sẽ thấy các messages sau:

### Khi request đến:
- `JWT Filter - URI: /api/opportunities, Header 'Authorization': present`
- `JWT Filter - Bearer token length: XXX`
- `JWT Filter - Extracted JWT: eyJhbGciOiJIUzI1NiJ9...`

### Khi validate token:
- `JWT Token validated successfully. Subject: employer@example.com, Expiration: ...`
- Hoặc `Invalid JWT signature: ...` (nếu có lỗi)

### Khi parse authentication:
- `JWT Token - Subject: employer@example.com, Roles claim: ROLE_EMPLOYER`
- `JWT Token - Roles string: 'ROLE_EMPLOYER'`
- `JWT Token - Creating authority: 'ROLE_EMPLOYER'`
- `JWT Filter - Authentication successful for user: employer@example.com, authorities: [ROLE_EMPLOYER]`

### Khi có lỗi:
- `JWT Filter - Token validation failed for URI: /api/opportunities`
- `JWT Filter - Error getting authentication from token: ...`

## 6. Tips để debug

1. **Xem logs real-time khi test:**
   ```bash
   # Terminal 1: Xem logs
   docker logs -f scholarship-service-test
   
   # Terminal 2: Test API từ browser hoặc Postman
   ```

2. **Filter logs theo level:**
   ```bash
   # Chỉ xem ERROR và WARN
   docker logs scholarship-service-test 2>&1 | grep -E "(ERROR|WARN)"
   ```

3. **Xem logs của nhiều services cùng lúc:**
   ```bash
   docker-compose logs -f scholarship-service auth-service nginx-gateway
   ```

## 7. Kiểm tra container name

Nếu không biết tên container, dùng lệnh:
```bash
docker ps | grep scholarship
```

Hoặc:
```bash
docker-compose ps
```





