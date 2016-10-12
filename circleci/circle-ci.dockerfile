FROM softwaregroup/ut-docker:latest
COPY .npmrc .npmrc
COPY package.json package.json
RUN npm update
COPY . .
CMD ["npm", "start"]
