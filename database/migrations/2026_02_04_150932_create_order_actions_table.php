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
        Schema::create('order_actions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->onDelete('cascade');
            $table->foreignId('trip_id')->nullable()->constrained()->onDelete('cascade');
            
            $table->enum('action_type', [
                'driver_assigned',
                'driver_arrived',
                'departed',
                'completed',
                'cancelled',
                'location_update',
                'payment_completed',
                'customer_rated'
            ]);
            
            $table->enum('from_status', ['pending', 'assigned', 'driver_arrived', 'departed', 'completed', 'cancelled'])->nullable();
            $table->enum('to_status', ['pending', 'assigned', 'driver_arrived', 'departed', 'completed', 'cancelled'])->nullable();
            
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();
            $table->text('address')->nullable();
            $table->decimal('accuracy', 8, 2)->nullable();
            
            $table->string('photo_url')->nullable();
            $table->string('signature_url')->nullable();
            $table->string('signature_name')->nullable();
            
            $table->json('metadata')->nullable();
            $table->text('notes')->nullable();
            
            $table->foreignId('actor_id')->nullable()->constrained('clients')->onDelete('set null');
            $table->enum('actor_type', ['driver', 'customer', 'admin', 'system'])->nullable();
            
            $table->timestamps();
            
            // Indexes
            $table->index(['order_id', 'action_type']);
            $table->index('trip_id');
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order_actions');
    }
};
