<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class UserAndPWDUserSeeder extends Seeder
{
    public function run(): void
    {
        $regionId = DB::table('regions')->value('id');
        $provinceId = DB::table('provinces')->value('id');
        $municipalityId = DB::table('municipalities')->value('id');

        $educationLevels = ['None', 'Elementary', 'High School', 'Vocational', 'College', 'Post Graduate'];
        $employmentStatuses = ['Employed', 'Unemployed', 'Self-employed'];
        $employmentTypes = ['Full-Time', 'Part-Time', 'Contractual'];
        $employmentCategories = ['Private', 'Government', 'Self-employed'];
        $occupations = ['Laborer', 'Office Worker', 'Professional', 'Service Worker', 'Skilled Worker'];
        $civilStatuses = ['Single', 'Married', 'Widowed', 'Separated'];

        for ($i = 1; $i <= 300; $i++) {
            // Create a user
            $userId = DB::table('users')->insertGetId([
                'name'       => "PWD User $i",
                'email'      => "pwduser$i@gmail.com",
                'phone'      => '0912' . str_pad($i, 7, '0', STR_PAD_LEFT),
                'role'       => 0,
                'password'   => Hash::make('admin1234'),
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // Generate random dates
            $dateApplied = Carbon::now()->subYears(rand(0, 7))->subMonths(rand(0, 11))->subDays(rand(0, 30));
            $dob = Carbon::now()->subYears(rand(18, 70))->toDateString();

            // Generate random names
            $firstName = "First" . $i;
            $middleName = "Middle" . $i;
            $lastName = "Last" . $i;
            $fatherFirstName = "Father" . $i;
            $fatherMiddleName = "FatherMiddle" . $i;
            $fatherLastName = "FatherLast" . $i;
            $motherFirstName = "Mother" . $i;
            $motherMiddleName = "MotherMiddle" . $i;
            $motherLastName = "MotherLast" . $i;

            DB::table('pwd_users')->insert([
                'user_id' => $userId,
                'pwdNumber' => sprintf(
                    "%02d-%04d-%03d-%07d",
                    $regionId,
                    $provinceId * 100 + $municipalityId,
                    rand(1, 182),
                    $i
                ),
                'dateApplied' => $dateApplied->toDateString(),
                'first_name' => $firstName,
                'middle_name' => $middleName,
                'last_name' => $lastName,
                'suffix' => rand(0, 1) ? ['Jr.', 'Sr.', 'III', 'IV'][rand(0, 3)] : null,
                'dob' => $dob,
                'sex' => ['Male', 'Female'][rand(0, 1)],
                'civilStatus' => $civilStatuses[rand(0, count($civilStatuses) - 1)],
                'disability_type_id' => rand(1, 10),
                'disability_cause_id' => rand(11, 18),
                'house' => rand(1, 999) . " Example St.",
                'barangay_id' => rand(1, 182),
                'municipality_id' => $municipalityId,
                'province_id' => $provinceId,
                'region_id' => $regionId,
                'landline' => rand(0, 1) ? '082-' . str_pad(rand(1, 9999999), 7, '0', STR_PAD_LEFT) : null,
                'education' => $educationLevels[rand(0, count($educationLevels) - 1)],
                'employmentStatus' => $employmentStatuses[rand(0, count($employmentStatuses) - 1)],
                'employmentCategory' => $employmentCategories[rand(0, count($employmentCategories) - 1)],
                'employmentType' => $employmentTypes[rand(0, count($employmentTypes) - 1)],
                'occupation' => $occupations[rand(0, count($occupations) - 1)],
                'occupationOther' => rand(0, 1) ? "Other Occupation $i" : null,
                'organizationAffiliated' => rand(0, 1) ? "PWD Organization $i" : null,
                'organizationContact' => rand(0, 1) ? "0912" . str_pad(rand(1, 9999999), 7, '0', STR_PAD_LEFT) : null,
                'organizationAddress' => rand(0, 1) ? "Organization Address $i" : null,
                'organizationTel' => rand(0, 1) ? "082-" . str_pad(rand(1, 9999999), 7, '0', STR_PAD_LEFT) : null,
                'sssNo' => rand(0, 1) ? str_pad(rand(1, 99), 2, '0', STR_PAD_LEFT) . '-' . str_pad(rand(1, 9999999), 7, '0', STR_PAD_LEFT) . '-' . str_pad(rand(1, 9), 1, '0', STR_PAD_LEFT) : null,
                'gsisNo' => rand(0, 1) ? str_pad(rand(1, 9999999), 7, '0', STR_PAD_LEFT) : null,
                'pagIbigNo' => rand(0, 1) ? str_pad(rand(1, 9999), 4, '0', STR_PAD_LEFT) . '-' . str_pad(rand(1, 9999), 4, '0', STR_PAD_LEFT) . '-' . str_pad(rand(1, 9999), 4, '0', STR_PAD_LEFT) : null,
                'psnNo' => rand(0, 1) ? str_pad(rand(1, 9999999), 7, '0', STR_PAD_LEFT) : null,
                'philhealthNo' => rand(0, 1) ? str_pad(rand(1, 999999999999), 12, '0', STR_PAD_LEFT) : null,
                'father_first_name' => $fatherFirstName,
                'father_middle_name' => $fatherMiddleName,
                'father_last_name' => $fatherLastName,
                'mother_first_name' => $motherFirstName,
                'mother_middle_name' => $motherMiddleName,
                'mother_last_name' => $motherLastName,
                'guardian_first_name' => rand(0, 1) ? "Guardian" . $i : null,
                'guardian_middle_name' => rand(0, 1) ? "GuardianMiddle" . $i : null,
                'guardian_last_name' => rand(0, 1) ? "GuardianLast" . $i : null,
                'accomplishedBy' => ['applicant', 'guardian', 'representative'][rand(0, 2)],
                'accomplished_by_first_name' => "Accomplished" . $i,
                'accomplished_by_middle_name' => "AccomplishedMiddle" . $i,
                'accomplished_by_last_name' => "AccomplishedLast" . $i,
                'certifying_physician_first_name' => "Dr. Physician" . $i,
                'certifying_physician_middle_name' => "PhysicianMiddle" . $i,
                'certifying_physician_last_name' => "PhysicianLast" . $i,
                'physician_license_no' => "MD-" . str_pad(rand(1, 999999), 6, '0', STR_PAD_LEFT),
                'processing_officer_first_name' => "Processing" . $i,
                'processing_officer_middle_name' => "ProcessingMiddle" . $i,
                'processing_officer_last_name' => "ProcessingLast" . $i,
                'approving_officer_first_name' => "Approving" . $i,
                'approving_officer_middle_name' => "ApprovingMiddle" . $i,
                'approving_officer_last_name' => "ApprovingLast" . $i,
                'encoder_first_name' => "Encoder" . $i,
                'encoder_middle_name' => "EncoderMiddle" . $i,
                'encoder_last_name' => "EncoderLast" . $i,
                'reportingUnit' => "PWD Services Unit " . $i,
                'controlNo' => "CTRL-2025-" . str_pad($i, 3, '0', STR_PAD_LEFT),
                'photo' => null,
                'signature' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
