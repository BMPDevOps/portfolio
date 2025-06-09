# 베이스 이미지 사용
FROM nginx:alpine

# 웹 콘텐츠 복사
COPY . /usr/share/nginx/html

# Nginx가 임시 파일 및 PID 파일을 쓸 수 있도록 디렉토리 권한 변경
# /var/cache/nginx는 임시 캐시 파일, /var/run/nginx.pid는 프로세스 ID 파일에 필요
RUN chown -R nginx:nginx /var/cache/nginx /var/run && \
    chmod -R 755 /var/cache/nginx /var/run

# 80번 포트 노출
EXPOSE 80

# Nginx 사용자(non-root)로 전환
USER nginx

# 컨테이너 실행 명령어
CMD ["nginx", "-g", "daemon off;"]