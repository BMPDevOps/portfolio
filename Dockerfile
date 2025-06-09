# 베이스 이미지 사용
FROM nginx:alpine

# 웹 콘텐츠 복사
COPY . /usr/share/nginx/html

# OKD/OpenShift 호환성을 위한 권한 설정
# 1. 디렉토리의 '그룹'을 root(GID 0)로 변경
# 2. '그룹'에 쓰기 권한(w)을 부여
RUN chgrp -R 0 /var/cache/nginx /var/run && \
    chmod -R g+w /var/cache/nginx /var/run

# 80번 포트 노출
EXPOSE 80

# USER nginx는 명시하지 않아도 무방 (OKD가 어차피 무시함)

# 컨테이너 실행 명령어
CMD ["nginx", "-g", "daemon off;"]