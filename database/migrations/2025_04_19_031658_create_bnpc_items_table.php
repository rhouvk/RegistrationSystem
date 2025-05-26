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
            $table->string('tag')->nullable();
            $table->string('type'); // either "Basic Necessities" or "Prime Commodities"
            $table->timestamps();
        });

        // Seed the two categories
        $basic = [
            ['name' => 'All kinds and variants of rice (except imported)', 'tag' => 'rice'],
            ['name' => 'All kinds and variants of corn', 'tag' => 'corn'],
            ['name' => 'All kinds of locally produced bread (cakes and pastries not included)', 'tag' => 'bread'],
            ['name' => 'All locally produced fresh, dried, and canned fish, and other marine products (including live, chilled, frozen, packaged)', 'tag' => 'fish'],
            ['name' => 'All locally produced fresh pork, beef, and poultry meat (except premium grade)', 'tag' => 'meat'],
            ['name' => 'All fresh chicken and duck eggs', 'tag' => 'eggs'],
            ['name' => 'Locally manufactured potable water in bottles and containers regardless of size', 'tag' => 'water'],
            ['name' => 'Fresh and processed milk (excluding foods for special medical purposes)', 'tag' => 'milk'],
            ['name' => 'Locally produced fresh vegetables including root crops', 'tag' => 'vegetables'],
            ['name' => 'All kinds of fresh fruits', 'tag' => 'fruits'],
            ['name' => 'Locally manufactured instant noodles', 'tag' => 'noodles'],
            ['name' => 'Locally produced coffee (whole beans, ground beans, instant up to three main ingredients)', 'tag' => 'coffee'],
            ['name' => 'All kinds of sugar (except artificial sweeteners)', 'tag' => 'sugar'],
            ['name' => 'Cooking oil (coconut, palm, soybean, canola, vegetable)', 'tag' => 'cookingoil'],
            ['name' => 'Iodized salt', 'tag' => 'salt'],
            ['name' => 'Locally manufactured laundry and detergent soap', 'tag' => 'soap'],
            ['name' => 'Locally produced firewood', 'tag' => 'firewood'],
            ['name' => 'Locally manufactured charcoal', 'tag' => 'charcoal'],
            ['name' => 'All kinds of candles (except decorative and scented)', 'tag' => 'candles'],
            ['name' => 'Household LPG ≤11 kg', 'tag' => 'lpg'],
            ['name' => 'Kerosene ≤2 liters per month', 'tag' => 'kerosene'],
        ];

        $prime = [
            ['name' => 'All kinds of flour', 'tag' => 'flour'],
            ['name' => 'All locally manufactured dried, processed and canned pork, beef, and poultry meat', 'tag' => 'processedmeat'],
            ['name' => 'All kinds of locally manufactured dairy products not under Basic Necessities', 'tag' => 'dairy'],
            ['name' => 'All kinds of onions and garlic', 'tag' => 'onionsgarlic'],
            ['name' => 'Locally manufactured vinegar, patis, and soy sauce (except spiced)', 'tag' => 'condiments'],
            ['name' => 'All kinds of toilet or bath soap', 'tag' => 'toiletsoap'],
            ['name' => 'Fertilizer', 'tag' => 'fertilizer'],
            ['name' => 'Pesticides', 'tag' => 'pesticides'],
            ['name' => 'Herbicides', 'tag' => 'herbicides'],
            ['name' => 'Poultry, livestock, and fishery feeds', 'tag' => 'feeds'],
            ['name' => 'Veterinary products', 'tag' => 'vetproducts'],
            ['name' => 'Pad paper and school supplies', 'tag' => 'schoolsupplies'],
            ['name' => 'Nipa shingle', 'tag' => 'nipashingle'],
            ['name' => 'Sawali', 'tag' => 'sawali'],
            ['name' => 'Cement, clinker, GI sheets', 'tag' => 'constructionmaterials'],
            ['name' => 'Hollow blocks', 'tag' => 'hollowblocks'],
            ['name' => 'Plywood', 'tag' => 'plywood'],
            ['name' => 'Plyboard', 'tag' => 'plyboard'],
            ['name' => 'Construction nails', 'tag' => 'nails'],
            ['name' => 'Batteries (single-use household)', 'tag' => 'batteries'],
            ['name' => 'Electrical supplies and light bulbs', 'tag' => 'electrical'],
            ['name' => 'Steel wires', 'tag' => 'steelwires'],
        ];

        $now = now();
        foreach ($basic as $item) {
            DB::table('bnpc_items')->insert([
                'name'       => $item['name'],
                'tag'        => $item['tag'],
                'type'       => 'Basic Necessities',
                'created_at' => $now,
                'updated_at' => $now,
            ]);
        }

        foreach ($prime as $item) {
            DB::table('bnpc_items')->insert([
                'name'       => $item['name'],
                'tag'        => $item['tag'],
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
