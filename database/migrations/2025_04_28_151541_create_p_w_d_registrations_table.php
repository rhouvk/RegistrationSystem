<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('pwd_users', function (Blueprint $table) {
            $table->id();
    
            $table->foreignId('user_id')->unique()->constrained('users')->onDelete('cascade');
    
            $table->string('pwdNumber')->unique();
            $table->date('dateApplied');
            $table->date('dob');
            $table->string('sex');
            $table->string('civilStatus');
    
            // Define as unsignedBigInteger only
            $table->unsignedBigInteger('disability_type_id');
            $table->unsignedBigInteger('disability_cause_id');
    
            $table->string('house')->nullable();
            $table->foreignId('barangay_id')->constrained('barangays')->onDelete('restrict');
            $table->foreignId('municipality_id')->constrained('municipalities')->onDelete('restrict');
            $table->foreignId('province_id')->constrained('provinces')->onDelete('restrict');
            $table->foreignId('region_id')->constrained('regions')->onDelete('restrict');
    
            $table->string('landline')->nullable();
            $table->string('education');
            $table->string('employmentStatus');
            $table->string('employmentCategory')->nullable();
            $table->string('employmentType')->nullable();
            $table->string('occupation')->nullable();
            $table->string('occupationOther')->nullable();
            $table->string('organizationAffiliated')->nullable();
            $table->string('organizationContact')->nullable();
            $table->string('organizationAddress')->nullable();
            $table->string('organizationTel')->nullable();
            $table->string('sssNo')->nullable();
            $table->string('gsisNo')->nullable();
            $table->string('pagIbigNo')->nullable();
            $table->string('psnNo')->nullable();
            $table->string('philhealthNo')->nullable();
            $table->string('fatherName')->nullable();
            $table->string('motherName')->nullable();
            $table->string('guardianName')->nullable();
            $table->string('accomplishedBy');
            $table->string('certifyingPhysician')->nullable();
            $table->string('encoder');
            $table->string('processingOfficer');
            $table->string('approvingOfficer');
            $table->string('reportingUnit');
            $table->string('controlNo');
    
            $table->string('photo')->nullable();
            $table->string('signature')->nullable();
    
            $table->timestamps();
        });
    
        // 🔁 Define foreign keys *after* table creation
        Schema::table('pwd_users', function (Blueprint $table) {
            $table->foreign('disability_type_id')
                  ->references('id')->on('disability_lists')
                  ->onDelete('restrict');
    
            $table->foreign('disability_cause_id')
                  ->references('id')->on('disability_lists')
                  ->onDelete('restrict');
        });
    
    
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pwd_users');
    }
};
