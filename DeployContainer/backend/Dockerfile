FROM eclipse-temurin:25-jdk

WORKDIR /app

# El .jar se copia desde backend-data/ (contexto de build = DeployContainer/)
COPY backend-data/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "/app/app.jar"]
