<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('subscriptions', function (Blueprint $table) {
            $table->id();

            // Link to the users table
            $table->foreignId('user_id')->constrained()->onDelete('cascade');

            // Payment tracking
            $table->string('payment_id')->unique(); // PayMongo payment/link ID
            $table->integer('amount'); // In centavos (e.g., 19900 for ₱199.00)

            // Subscription duration type
            $table->enum('duration', ['monthly', 'semiannual', 'annual']);

            // Subscription period
            $table->dateTime('starts_at');
            $table->dateTime('ends_at');

            // Refund tracking
            $table->boolean('refunded')->default(false);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('subscriptions');
    }
};
