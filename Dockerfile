FROM node:latest
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
COPY cert.pem /root/cert.pem
COPY key.pem /root/key.pem
EXPOSE 8443
CMD ["npm", "start"]