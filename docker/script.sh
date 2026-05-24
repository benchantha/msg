#!/bin/sh

echo "Setting permissions..."
chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache
chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

echo "Installing dependencies..."
composer install --no-dev --optimize-autoloader
npm install
npm run build

# Ensure .env exists (copy from example if missing)
if [ ! -f .env ]; then
    echo "Creating .env from .env.example..."
    cp .env.example .env
fi

# Generate APP_KEY if not set (requires vendor/ to exist)
if [ -z "$APP_KEY" ] || [ "$APP_KEY" = "base64:" ]; then
    echo "Generating application key..."
    php artisan key:generate --force
fi

echo "Running Laravel optimizations..."
php artisan optimize
php artisan migrate --force

echo "Starting Supervisor..."
exec supervisord -c /etc/supervisor/conf.d/laravel.conf
