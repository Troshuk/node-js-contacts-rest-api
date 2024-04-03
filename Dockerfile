FROM node:18-alpine

WORKDIR /usr/src/app

# This is used when we use the docker's volume
# optimize the performance by first installing packages and only after copying all the project files
# COPY ./package*.json ./
# RUN npm install
# COPY ./ ./

# This is used when we use the local code as a volume
ENTRYPOINT ["sh", "-c", "npm install && exec \"$@\"", "--"]

EXPOSE ${PORT} ${DB_PORT}

CMD ["npm", "run", "dev"]