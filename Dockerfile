FROM openjdk:8-alpine
COPY target/teosto-session-int-0.0.1-jar-with-dependencies.jar ./
EXPOSE 8080
CMD java -jar teosto-session-int-0.0.1-jar-with-dependencies.jar
