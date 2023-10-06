FROM openjdk:8-jre-alpine

RUN mkdir /webgoat7.1
WORKDIR /webgoat7.1

#Add application
ADD ./webgoat-container-7.1-exec.jar /webgoat7.1/webgoat-container-7.1-exec.jar

#Add Contrast
COPY --from=contrast/agent-java:5 /contrast/contrast-agent.jar /opt/contrast/contrast.jar

#Enable Contrast
ENV JAVA_TOOL_OPTIONS='-javaagent:/opt/contrast/contrast.jar'

EXPOSE 8080
ENTRYPOINT ["java","-jar","/webgoat7.1/webgoat-container-7.1-exec.jar"]