<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB; // ← Important! So you can insert

class CreateDisabilityListsTable extends Migration
{
    public function up(): void
    {
        Schema::create('disability_lists', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->enum('category', ['Type', 'Cause']);
            $table->timestamps();
        });

        // Insert default Types
        DB::table('disability_lists')->insert([
            ['name' => 'Deaf or Hard of Hearing', 'category' => 'Type', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Intellectual Disability', 'category' => 'Type', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Learning Disability', 'category' => 'Type', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Mental Disability', 'category' => 'Type', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Physical Disability', 'category' => 'Type', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Psychosocial Disability', 'category' => 'Type', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Speech and Language Impairment', 'category' => 'Type', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Visual Disability', 'category' => 'Type', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Cancer', 'category' => 'Type', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Rare Disease', 'category' => 'Type', 'created_at' => now(), 'updated_at' => now()],
        ]);

        // Insert default Causes
        DB::table('disability_lists')->insert([
            ['name' => 'Congenital / Inborn', 'category' => 'Cause', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Acquired', 'category' => 'Cause', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Autism', 'category' => 'Cause', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'ADHD', 'category' => 'Cause', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Cerebral Palsy', 'category' => 'Cause', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Down Syndrome', 'category' => 'Cause', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Chronic Illness', 'category' => 'Cause', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Injury', 'category' => 'Cause', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('disability_lists');
    }
}
