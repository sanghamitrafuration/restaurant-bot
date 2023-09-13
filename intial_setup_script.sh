cd /tmp/
sudo su -
wget https://bin.equinox.io/c/bNyj1mQVY4c/ngrok-v3-stable-linux-amd64.tgz && tar xzf ngrok-v3-stable-linux-amd64.tgz && sudo mv ngrok /bin/
ngrok config add-authtoken 2VFU8LcUIEld2IGOxgKeS8I0mKN_2ZKoduzJMo3UyViPSS3EU
cd /opt/
git clone https://github.com/sanghamitrafuration/restaurant-bot.git && cd restaurant-bot/