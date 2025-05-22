<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('bnpc_items', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('type'); // either "Basic Necessities" or "Prime Commodities"
            $table->timestamps();
        });

        // Seed the two categories
        $basic = [
            'All kinds and variants of rice (except imported)',
            'All kinds and variants of corn',
            'All kinds of locally produced bread (cakes and pastries not included)',
            'All locally produced fresh, dried, and canned fish, and other marine products (including live, chilled, frozen, packaged)',
            'All locally produced fresh pork, beef, and poultry meat (except premium grade)',
            'All fresh chicken and duck eggs',
            'Locally manufactured potable water in bottles and containers regardless of size',
            'Fresh and processed milk (excluding foods for special medical purposes)',
            'Locally produced fresh vegetables including root crops',
            'All kinds of fresh fruits',
            'Locally manufactured instant noodles',
            'Locally produced coffee (whole beans, ground beans, instant up to three main ingredients)',
            'All kinds of sugar (except artificial sweeteners)',
            'Cooking oil (coconut, palm, soybean, canola, vegetable)',
            'Iodized salt',
            'Locally manufactured laundry and detergent soap',
            'Locally produced firewood',
            'Locally manufactured charcoal',
            'All kinds of candles (except decorative and scented)',
            'Household LPG ≤11 kg',
            'Kerosene ≤2 liters per month',
        ];

        $prime = [
            'All kinds of flour',
            'All locally manufactured dried, processed and canned pork, beef, and poultry meat',
            'All kinds of locally manufactured dairy products not under Basic Necessities',
            'All kinds of onions and garlic',
            'Locally manufactured vinegar, patis, and soy sauce (except spiced)',
            'All kinds of toilet or bath soap',
            'Fertilizer',
            'Pesticides',
            'Herbicides',
            'Poultry, livestock, and fishery feeds',
            'Veterinary products',
            'Pad paper and school supplies',
            'Nipa shingle',
            'Sawali',
            'Cement, clinker, GI sheets',
            'Hollow blocks',
            'Plywood',
            'Plyboard',
            'Construction nails',
            'Batteries (single-use household)',
            'Electrical supplies and light bulbs',
            'Steel wires',
        ];

        $now = now();
        foreach ($basic as $item) {
            DB::table('bnpc_items')->insert([
                'name'       => $item,
                'type'       => 'Basic Necessities',
                'created_at' => $now,
                'updated_at' => $now,
            ]);
        }

        foreach ($prime as $item) {
            DB::table('bnpc_items')->insert([
                'name'       => $item,
                'type'       => 'Prime Commodities',
                'created_at' => $now,
                'updated_at' => $now,
            ]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bnpc_items');
    }
};
