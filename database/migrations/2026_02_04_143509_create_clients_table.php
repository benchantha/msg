<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('clients', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->string('account_code')->unique();
            $table->foreignId('company_id')->nullable()->constrained()->onDelete('set null');
            $table->string('phone')->unique();
            $table
                ->enum('type', ['driver', 'customer', 'staff'])
                ->default('customer')
                ->comment('driver: Driver, customer: (Passenger, Customer)');
            $table->string('password');
            $table->string('first_name');
            $table->string('last_name')->nullable();
            $table->enum('gender', ['male', 'female', 'other'])->nullable();
            $table->date('dob')->nullable();
            $table->string('place_of_birth')->nullable();
            $table->string('id_number')->nullable();
            $table->string('phone_1')->nullable();
            $table->string('phone_2')->nullable();
            $table->string('phone_3')->nullable();
            $table->string('phone_4')->nullable();
            $table->text('address')->nullable();
            $table->string('avatar_url')->nullable();
            $table->boolean('is_active')->default(true);
            $table->enum('status', ['pending', 'approved'])->default('pending');
            $table->enum('work_status', ['offline', 'online'])->nullable();
            $table->integer('rank')->default(0);
            $table->boolean('is_fixed_otp')->default(false);
            $table->string('otp')->nullable();
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();
            $table->string('location_name')->nullable();
            $table->decimal('rotation', 5, 2)->nullable()->comment('Rotation in degrees');
            $table->string('nick_name')->nullable();
            $table->timestamps();
            $table->softDeletes();
            
            // Indexes
            $table->index(['company_id', 'type']);
            $table->index('status');
            $table->index('work_status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('clients');
    }
};
