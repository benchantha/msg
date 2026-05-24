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
        Schema::create('trips', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->string('code');
            $table->foreignId('company_id')->constrained()->onDelete('cascade');
            $table->foreignId('driver_id')->nullable()->constrained('clients')->onDelete('set null');
            $table->foreignId('vehicle_type_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('driver_vehicle_id')->nullable()->constrained('driver_vehicles')->onDelete('set null');
            $table->enum('status', ['pending', 'active', 'completed', 'cancelled'])->default('pending');
            
            $table->decimal('distance', 10, 2)->nullable();
            $table->integer('estimated_duration')->nullable();
            $table->integer('duration')->nullable();
            
            $table->decimal('total_earnings', 10, 2)->default(0);
            $table->json('road_data')->nullable();
            $table->timestamp('started_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamp('cancelled_at')->nullable();
            
            $table->foreignId('cancelled_by_id')->nullable()->constrained('clients')->onDelete('set null');
            $table->enum('cancelled_by_type', ['customer', 'driver', 'admin', 'system'])->nullable();
            $table->text('cancelled_reason')->nullable();
            
            $table->decimal('average_rating', 3, 2)->nullable();
            $table->integer('total_ratings')->default(0);
            
            $table->timestamps();
            
            // Composite unique constraints and indexes
            $table->unique(['company_id', 'code']);
            $table->index(['company_id', 'status']);
            $table->index('driver_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('trips');
    }
};
