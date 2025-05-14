<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('admin_controls', function (Blueprint $table) {
            $table->id();
            $table->unsignedInteger('purchaseLimit');
            $table->unsignedInteger('cardExpiration');
            $table->unsignedInteger('BNPCdiscount'); // New field for BNPC discount (e.g. 5%)
            $table->timestamps();
        });

        // Insert initial data into the table
        DB::table('admin_controls')->insert([
            'purchaseLimit'  => 2500,
            'cardExpiration' => 5,
            'BNPCdiscount'   => 5, // Initial value
            'created_at'     => now(),
            'updated_at'     => now(),
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('admin_controls');
    }
};
