git reset --hard 
git pull origin master
composer install --optimize-autoloader 
php artisan migrate:fresh --seed
php artisan optimize
php artisan config:cache
npm run prod
