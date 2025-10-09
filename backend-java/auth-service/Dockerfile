# --------------------
# Build stage
# --------------------
FROM maven:3.9.2-eclipse-temurin-17 AS build
WORKDIR /app

# Copy Maven wrapper và file cấu hình
COPY mvnw ./
COPY .mvn .mvn
COPY pom.xml ./

# Tải dependency trước để cache
RUN ./mvnw dependency:go-offline -B

# Copy toàn bộ source
COPY src ./src

# Build project
RUN ./mvnw package -DskipTests -B

# --------------------
# Run stage
# --------------------
FROM eclipse-temurin:17-jdk
WORKDIR /app

# Copy jar từ stage build
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]