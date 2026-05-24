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
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->string('code');
            $table->enum('service_type', ['delivery', 'taxi'])->default('delivery');
            $table->foreignId('company_id')->constrained()->onDelete('cascade');
            $table->foreignId('customer_id')->constrained('clients')->onDelete('cascade');
            $table->foreignId('trip_id')->nullable()->constrained()->onDelete('set null');
            $table->enum('status', ['pending', 'assigned', 'driver_arrived', 'departed', 'completed', 'cancelled'])->default('pending');
            
            $table->decimal('distance', 10, 2)->nullable();
            $table->integer('estimated_duration')->nullable();
            $table->integer('actual_duration')->nullable();
            $table->json('pickup_road_data')->nullable();
            $table->json('dropoff_road_data')->nullable();
            
            // Delivery-specific fields
            $table->enum('item_size', ['XS', 'S', 'M', 'L', 'XL', 'XXL'])->nullable();
            $table->decimal('item_weight', 8, 2)->nullable();
            $table->enum('item_type', ['Document', 'Food', 'Clothing', 'Electronics', 'Furniture'])->nullable();
            $table->text('item_description')->nullable();
            $table->boolean('is_fragile')->default(false);
            $table->boolean('requires_signature')->default(false);
            $table->boolean('requires_photo')->default(false);
            
            // Taxi-specific fields
            $table->integer('passenger_count')->nullable();
            $table->json('passenger_names')->nullable();
            $table->json('special_requirements')->nullable();
            $table->integer('luggage_count')->nullable();
            
            // Pricing
            $table->decimal('estimated_price', 10, 2)->nullable();
            $table->decimal('final_price', 10, 2)->nullable();
            $table->json('price_breakdown')->nullable();
            
            // Payment
            $table->enum('payment_timing', ['prepaid', 'postpaid'])->default('postpaid');
            $table->enum('payment_status', ['unpaid', 'paid'])->default('unpaid');
            $table->enum('payment_method', ['cash', 'wallet'])->nullable();
            
            // Priority
            $table->enum('priority', ['normal', 'urgent', 'express'])->default('normal');
            
            // Notes
            $table->text('note')->nullable();
            $table->text('special_instructions')->nullable();
            
            // Rating
            $table->tinyInteger('rating')->nullable();
            $table->text('rating_comment')->nullable();
            $table->timestamp('rating_at')->nullable();
            
            // Cancellation
            $table->timestamp('cancelled_at')->nullable();
            $table->foreignId('cancelled_by_id')->nullable()->constrained('clients')->onDelete('set null');
            $table->enum('cancelled_by_type', ['customer', 'driver', 'admin', 'system'])->nullable();
            $table->text('cancelled_reason')->nullable();
            
            // Flags
            $table->boolean('is_active')->default(true);
            
            // Key timestamps
            $table->timestamp('assigned_at')->nullable();
            $table->timestamp('driver_arrived_at')->nullable();
            $table->timestamp('departed_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            
            $table->timestamps();
            
            // Composite unique constraints and indexes
            $table->unique(['company_id', 'code']);
            $table->index(['company_id', 'status']);
            $table->index('trip_id');
            $table->index('customer_id');
            $table->index('status');
            $table->index('service_type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
