FROM risingstack/alpine:3.4-v4.4.4-3.6.1
RUN npm i -g npm@3
RUN cd $(npm root -g)/npm \
 && npm install fs-extra \
 && sed -i -e s/graceful-fs/fs-extra/ -e s/fs\.rename/fs.move/ ./lib/utils/rename.js

COPY .npmrc .npmrc
COPY prefetch.json package.json
RUN npm --production=false install

COPY package.json package.json
RUN npm --production=false update

# Add your source files
COPY . .