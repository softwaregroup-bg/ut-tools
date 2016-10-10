FROM risingstack/alpine:3.4-v6.3.0-3.6.2
COPY .npmrc .npmrc
COPY prefetch.json package.json
RUN npm install
COPY package.json package.json
RUN npm update
COPY . .
CMD ["npm", "run"]