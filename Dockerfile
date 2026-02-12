FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# Clear any potential TypeScript cache
RUN rm -rf node_modules/.tmp/*.tsbuildinfo
RUN npm run build

FROM node:22-alpine
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY server/package*.json ./server/
COPY server/index.js ./server/
RUN cd server && npm ci --omit=dev
EXPOSE 3001
ENV PORT=3001
CMD ["node", "server/index.js"]
