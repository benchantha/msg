# Use official PHP 8.2 FPM image as base
FROM php:8.2-fpm

# Set working directory
WORKDIR /var/www/html

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git curl libpng-dev libonig-dev libxml2-dev \
    zip unzip gnupg libjpeg-dev libfreetype6-dev \
    supervisor default-mysql-client libzip-dev && apt-get clean && rm -rf /var/lib/apt/lists/*

# Install Node.js (for Vite)
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs

# Install PHP extensions required for Laravel
RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install pdo pdo_mysql mbstring exif pcntl bcmath gd zip

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Set PHP upload limits for large database files (up to 10GB)
RUN echo "upload_max_filesize=10G" >> /usr/local/etc/php/php.ini \
    && echo "post_max_size=10G" >> /usr/local/etc/php/php.ini \
    && echo "memory_limit=512M" >> /usr/local/etc/php/php.ini \
    && echo "max_execution_time=7200" >> /usr/local/etc/php/php.ini \
    && echo "max_input_time=7200" >> /usr/local/etc/php/php.ini

# Copy application source code
COPY . /var/www/html

# Set correct permissions for Laravel storage and cache
RUN mkdir -p /var/www/html/storage/logs && \
    chown -R www-data:www-data /var/www/html && \
    chmod -R 775 /var/www/html/storage && \
    chmod -R 775 /var/www/html/bootstrap/cache

# Copy Supervisor configuration
COPY docker/supervisor.d /etc/supervisor/conf.d/

# Copy entrypoint script
COPY docker/script.sh /script.sh
RUN chmod +x /script.sh

# Expose PHP-FPM port
EXPOSE 9000

# Set entrypoint
ENTRYPOINT ["/script.sh"]
