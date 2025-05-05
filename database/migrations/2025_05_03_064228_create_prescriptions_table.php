<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('prescriptions', function (Blueprint $table) {
            $table->id();

            $table->foreignId('buyer_id')->constrained('users')->onDelete('cascade');

            $table->string('medicine_purchase');
            $table->integer('quantity_prescribed');
            $table->date('date');

            $table->string('physician_name');
            $table->string('physician_address');
            $table->string('physician_ptr_no');

            $table->foreignId('created_by')->constrained('users')->onDelete('cascade');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('prescriptions');
    }
};
