<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateBnpcPurchasesTable extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('bnpc_purchases', function (Blueprint $table) {
            $table->id();
            $table->date('date_of_purchase');
            $table->decimal('total_amount', 12, 2);
            $table->decimal('remaining_balance', 12, 2);
            // Reference to bnpc_items table
            $table->foreignId('bnpc_item_id')
                  ->constrained('bnpc_items')
                  ->onDelete('cascade');
            $table->integer('quantity');
            // Who bought: user ID
            $table->foreignId('bought_by')
                  ->constrained('users')
                  ->onDelete('cascade');
            // Store or establishment as a user too
            $table->foreignId('store_id')
                  ->constrained('users')
                  ->onDelete('cascade');
            // path to uploaded signature image
            $table->string('signature_path')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bnpc_purchases');
    }
}
