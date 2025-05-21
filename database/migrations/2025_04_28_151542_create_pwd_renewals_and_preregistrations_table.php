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
        Schema::create('pwd_renewals_and_preregistrations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('cascade');
    
            $table->integer('registration_type')->nullable()->comment('1 - Pre-registration, 2 - Renewal, 3 - Approved, 4 - Rejected');
            $table->string('pwdNumber')->nullable()->unique();
            $table->date('dateApplied')->nullable();
            $table->date('dob')->nullable();
            $table->string('sex')->nullable();
            $table->string('civilStatus')->nullable();
    
            // User's name fields
            $table->string('first_name')->nullable();
            $table->string('middle_name')->nullable();
            $table->string('last_name')->nullable();
            $table->string('suffix')->nullable();
    
            // Father's name fields
            $table->string('father_first_name')->nullable();
            $table->string('father_middle_name')->nullable();
            $table->string('father_last_name')->nullable();
    
            // Mother's name fields
            $table->string('mother_first_name')->nullable();
            $table->string('mother_middle_name')->nullable();
            $table->string('mother_last_name')->nullable();
    
            // Guardian's name fields
            $table->string('guardian_first_name')->nullable();
            $table->string('guardian_middle_name')->nullable();
            $table->string('guardian_last_name')->nullable();
    
            // Accomplished by name fields
            $table->string('accomplished_by_first_name')->nullable();
            $table->string('accomplished_by_middle_name')->nullable();
            $table->string('accomplished_by_last_name')->nullable();
    
            // Certifying physician name fields
            $table->string('certifying_physician_first_name')->nullable();
            $table->string('certifying_physician_middle_name')->nullable();
            $table->string('certifying_physician_last_name')->nullable();
            $table->string('physician_license_no')->nullable();
    
            // Processing officer name fields
            $table->string('processing_officer_first_name')->nullable();
            $table->string('processing_officer_middle_name')->nullable();
            $table->string('processing_officer_last_name')->nullable();
    
            // Approving officer name fields
            $table->string('approving_officer_first_name')->nullable();
            $table->string('approving_officer_middle_name')->nullable();
            $table->string('approving_officer_last_name')->nullable();
    
            // Encoder name fields
            $table->string('encoder_first_name')->nullable();
            $table->string('encoder_middle_name')->nullable();
            $table->string('encoder_last_name')->nullable();
    
            // Define as unsignedBigInteger only
            $table->unsignedBigInteger('disability_type_id')->nullable();
            $table->unsignedBigInteger('disability_cause_id')->nullable();
    
            $table->string('house')->nullable();
            $table->foreignId('barangay_id')->nullable()->constrained('barangays')->onDelete('restrict');
            $table->foreignId('municipality_id')->nullable()->constrained('municipalities')->onDelete('restrict');
            $table->foreignId('province_id')->nullable()->constrained('provinces')->onDelete('restrict');
            $table->foreignId('region_id')->nullable()->constrained('regions')->onDelete('restrict');
    
            $table->string('landline')->nullable();
            $table->string('education')->nullable();
            $table->string('employmentStatus')->nullable();
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
            $table->enum('accomplishedBy', ['applicant', 'guardian', 'representative'])->nullable();
            $table->string('reportingUnit')->nullable();
            $table->string('controlNo')->nullable(); 
    
            $table->string('photo')->nullable();
            $table->string('signature')->nullable();
    
            $table->timestamps();
        });
    
        // 🔁 Define foreign keys *after* table creation
        Schema::table('pwd_renewals_and_preregistrations', function (Blueprint $table) {
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
        Schema::dropIfExists('pwd_renewals_and_preregistrations');
    }
};
