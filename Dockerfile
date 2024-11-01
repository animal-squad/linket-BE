# 1. 공식 Node.js 이미지를 기반으로 사용 (필요에 따라 버전 조정)
FROM node:18-alpine

# 2. pnpm을 전역으로 설치
RUN npm install -g pnpm

# 3. 애플리케이션 작업 디렉토리 설정
WORKDIR /app

# 4. 패키지 파일들을 먼저 복사하여 의존성 설치 캐시 활용
COPY package.json pnpm-lock.yaml ./

# 5.1 의존성 설치
RUN pnpm install --frozen-lockfile

# 5.2 Prisma 스키마 복사 및 클라이언트 생성
COPY prisma ./prisma/

RUN npx prisma generate

# 6. 나머지 소스 코드 복사
COPY . .

# 7. 빌드가 필요한 경우 (예: TypeScript, 빌드 스크립트)
# RUN pnpm run build

# 8. 애플리케이션이 사용할 포트 노출 (필요에 따라 수정)
EXPOSE 3000

# 9. 애플리케이션 실행 명령어 설정
CMD ["pnpm", "start"]

