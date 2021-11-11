FROM openjdk:8-jre-alpine

RUN mkdir /webgoat7.1
WORKDIR /webgoat7.1

#Add application
ADD ./webgoat-container-7.1-exec.jar /webgoat7.1/webgoat-container-7.1-exec.jar

#Add Contrast
ADD https://repository.sonatype.org/service/local/artifact/maven/redirect?r=central-proxy&g=com.contrastsecurity&a=contrast-agent&v=LATEST /opt/contrast/contrast.jar

#Enable Contrast
ENV JAVA_TOOL_OPTIONS='-javaagent:/opt/contrast/contrast.jar'

EXPOSE 8080
ENTRYPOINT ["java","-jar","/webgoat7.1/webgoat-container-7.1-exec.jar"]