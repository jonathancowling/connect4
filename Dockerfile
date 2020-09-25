FROM node:lts-alpine

RUN adduser --system app && \
    addgroup --system app && \
    addgroup app app && \
    mkdir /app && \
    chown app:app /app 

WORKDIR /app

COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json

RUN npm install --production

COPY *.js /app/
COPY static /app/static

ENV NUM_ROWS 7
ENV NUM_COLS 7
ENV PORT 3000
ENV SESSION_SECRET secret

EXPOSE 3000

ENTRYPOINT [ "npm" ]
CMD [ "run", "start" ]
