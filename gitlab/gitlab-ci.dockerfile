FROM risingstack/alpine:3.4-v4.4.4-3.6.1
RUN npm i -g npm@3

COPY .npmrc .npmrc
COPY package.json package.json
RUN npm --production=false install

# Add your source files
COPY . .