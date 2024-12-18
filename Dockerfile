# 1. 공식 Node.js 이미지를 기반으로 사용 (필요에 따라 버전 조정)
FROM node:18-alpine

# 2. OpenSSL 추가
RUN apk add --no-cache openssl

# 3. pnpm을 전역으로 설치
RUN npm install -g pnpm

# 4. tzdata 패키지 설치 및 타임존 설정 추가
RUN apk add --no-cache tzdata 

# 타임존을 Asia/Seoul로 설정
ENV TZ=Asia/Seoul
RUN cp /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# (선택 사항) 이미지 크기 최적화를 위해 tzdata 제거
RUN apk del tzdata

# 5. 애플리케이션 작업 디렉토리 설정
WORKDIR /app

# 6. 패키지 파일들을 먼저 복사하여 의존성 설치 캐시 활용
COPY package.json pnpm-lock.yaml ./

# 7.1 의존성 설치
RUN pnpm install --frozen-lockfile

# 7.2 Prisma 스키마 복사 및 클라이언트 생성
COPY prisma ./prisma/

RUN npx prisma generate

# 8. 나머지 소스 코드 복사
COPY . .

# 9. 빌드가 필요한 경우 (예: TypeScript, 빌드 스크립트)
RUN pnpm run build

# 10. 애플리케이션이 사용할 포트 노출 (필요에 따라 수정)
EXPOSE 3000

# 11. NODE_OPTIONS 환경 변수 설정
ENV NODE_OPTIONS=--openssl-legacy-provider

# 12. 애플리케이션 실행 명령어 설정
CMD ["pnpm", "start"]

