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
        Schema::create('vehicle_types', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->string('code');
            $table->foreignId('company_id')->constrained()->onDelete('cascade');
            $table->string('title');
            $table->string('title_1')->nullable();
            $table->string('title_2')->nullable();
            $table->string('picture_url')->nullable();
            $table->integer('order')->default(0);
            $table->enum('capacity_unit', ['ton', 'seat'])->default('seat');
            $table->decimal('capacity', 10, 2)->default(1);
            $table->timestamps();
            
            // Indexes
            $table->index(['company_id', 'code']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vehicle_types');
    }
};
