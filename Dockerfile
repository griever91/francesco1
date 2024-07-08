# Usa l'immagine ufficiale di Node.js come base
FROM node:14

# Crea e imposta la directory di lavoro
WORKDIR /usr/src/app

# Copia i file package.json e package-lock.json
COPY package*.json ./

# Installa le dipendenze del progetto
RUN npm install

# Copia il resto dei file del progetto
COPY . .

# Esponi la porta 5000
EXPOSE 5000

# Comando per avviare l'applicazione
CMD ["npm", "start"]
