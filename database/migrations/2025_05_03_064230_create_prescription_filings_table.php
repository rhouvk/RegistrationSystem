<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('prescription_fillings', function (Blueprint $table) {
            $table->id();

            $table->foreignId('prescription_id')->constrained('prescriptions')->onDelete('cascade');

            $table->foreignId('drugstore_id')->constrained('users')->onDelete('cascade');
            $table->string('pharmacist_name');

            $table->unsignedTinyInteger('filling_status')->default(1); // 1 = First Filling
            $table->integer('filling_amount')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('prescription_fillings');
    }
};
