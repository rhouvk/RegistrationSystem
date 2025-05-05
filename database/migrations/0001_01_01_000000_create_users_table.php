<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Create the "users" table
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique()->nullable();
            $table->string('phone')->unique()->nullable();
            $table->unsignedTinyInteger('role')->default(0); // 0: PWD, 1: Admin, 2: Business, 3: Pharmacy
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->rememberToken();
            $table->timestamps();
        });

        // Insert default users
        DB::table('users')->insert([
            [
                'name'       => 'Admin',
                'email'      => 'admin@gmail.com',
                'phone'      => '09197955234',
                'role'       => 1, // Admin
                'password'   => Hash::make('admin1234'),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name'       => 'Felcris',
                'email'      => 'felcris@gmail.com',
                'phone'      => '09147955234',
                'role'       => 2, // Business
                'password'   => Hash::make('admin1234'),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name'       => 'Watsons',
                'email'      => 'watsons@gmail.com',
                'phone'      => '09194945234',
                'role'       => 3, // Pharmacy
                'password'   => Hash::make('admin1234'),
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);

        // Create the password_reset_tokens table
        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        // Create the sessions table
        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Drop child tables before parent to avoid foreign key issues
        Schema::dropIfExists('sessions');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('users');
    }
};
