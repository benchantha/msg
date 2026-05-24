<?php

namespace Database\Seeders;

use App\Constants\UserLevel;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's users.
     */
    public function run(): void
    {
        // Seed a few default users for logging in.
        // Password for all seeded users: 123

        // Super user (full access across companies)
        User::factory()->create([
            'uuid' => '123e4567-e89b-12d3-a456-426614174000',
            'name' => 'Developer',
            'email' => 'developer@direxgo.com',
            'password' => Hash::make('123'),
            'level' => UserLevel::DEVELOPER,
        ]);

        // Company admin
        User::factory()->create([
            'uuid' => '123e4567-e89b-12d3-a456-426614174001',
            'name' => 'Admin',
            'email' => 'admin@direxgo.com',
            'password' => Hash::make('123'),
            'level' => UserLevel::ADMIN,
        ]);

        // Normal user
        User::factory()->create([
            'uuid' => '123e4567-e89b-12d3-a456-426614174002',
            'name' => 'User',
            'email' => 'user@direxgo.com',
            'password' => Hash::make('123'),
            'level' => UserLevel::NORMAL,
        ]);
    }
}

