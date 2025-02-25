# Usa la imagen oficial de Node.js como base
FROM node:22-alpine AS builder

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia el package.json y package-lock.json (si existe)
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto del código de la aplicación
COPY . .

# Construye la aplicación
RUN npm run build

# Crea una nueva imagen más ligera para servir la app
FROM node:22-alpine AS runner

# Establece el directorio de trabajo en el contenedor
WORKDIR /app

# Copia solo los archivos necesarios desde la imagen anterior
COPY --from=builder /app/.next .next
COPY --from=builder /app/public public
COPY --from=builder /app/package*.json ./

# Instala solo las dependencias de producción
RUN npm install --omit=dev

# Expone el puerto en el que Next.js servirá la aplicación
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["npm", "run", "start"]
