# Use a imagem oficial do Nginx como base
FROM nginx:alpine

# Copie os arquivos do front-end para o diretório padrão do Nginx
COPY . /usr/share/nginx/html

# Copie a configuração personalizada do Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponha a porta que o Nginx irá rodar
EXPOSE 80