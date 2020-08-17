FROM openjdk:8-jre-alpine

RUN mkdir /webgoat7.1
WORKDIR /webgoat7.1

#Add application
ADD ./webgoat-container-7.1-exec.jar /webgoat7.1/webgoat-container-7.1-exec.jar

#Add Contrast
RUN mkdir /opt/contrast
RUN apk --no-cache add curl
RUN curl --fail --silent --location "https://repository.sonatype.org/service/local/artifact/maven/redirect?r=central-proxy&g=com.contrastsecurity&a=contrast-agent&v=LATEST" -o /opt/contrast/contrast.jar


#Enable Contrast
ENV JAVA_TOOL_OPTIONS='-javaagent:/opt/contrast/contrast.jar -Dcontrast.standalone.appname=Webgoat'

EXPOSE 8080
ENTRYPOINT ["java","-jar","/webgoat7.1/webgoat-container-7.1-exec.jar"]