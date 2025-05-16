<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class UserAndPwdUserSeeder extends Seeder
{
    public function run(): void
    {
        $regionId = DB::table('regions')->value('id');
        $provinceId = DB::table('provinces')->value('id');
        $municipalityId = DB::table('municipalities')->value('id');

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

            DB::table('pwd_users')->insert([
                'user_id'               => $userId,
                'pwdNumber'             => "PWD-2025-" . str_pad($i, 4, '0', STR_PAD_LEFT),
                'dateApplied' => Carbon::now()
                ->subYears(rand(0, 7))
                ->subMonths(rand(0, 11))
                ->subDays(rand(0, 30))
                ->toDateString(),

                'dob'                   => Carbon::now()->subYears(rand(18, 70))->toDateString(),
                'sex'                   => ['Male', 'Female'][rand(0, 1)],
                'civilStatus'           => ['Single', 'Married', 'Widowed', 'Separated'][rand(0, 3)],
                'disability_type_id'    => rand(1, 10),
                'disability_cause_id'   => rand(11, 18),
                'house'                 => "$i Example St.",
                'barangay_id'           => rand(1, 182),
                'municipality_id'       => $municipalityId,
                'province_id'           => $provinceId,
                'region_id'             => $regionId,
                'landline'              => null,
                'education'             => ['High School', 'College Graduate', 'Vocational'][rand(0, 2)],
                'employmentStatus'      => ['Employed', 'Unemployed'][rand(0, 1)],
                'employmentCategory'    => 'Private',
                'employmentType'        => ['Full-Time', 'Part-Time'][rand(0, 1)],
                'occupation'            => 'Laborer',
                'occupationOther'       => null,
                'organizationAffiliated'=> 'PWD Org',
                'organizationContact'   => '09121234567',
                'organizationAddress'   => 'Davao City',
                'organizationTel'       => '0821234567',
                'sssNo'                 => '34-1234567-8',
                'gsisNo'                => null,
                'pagIbigNo'             => '1234-5678-9101',
                'psnNo'                 => '2025012345',
                'philhealthNo'          => '123456789012',
                'fatherName'            => "Father $i",
                'motherName'            => "Mother $i",
                'guardianName'          => null,
                'accomplishedBy'        => 'Social Worker A',
                'certifyingPhysician'   => 'Dr. Smith',
                'physicianLicenseNo'    => '987654',
                'encoder'               => 'Encoder A',
                'processingOfficer'     => 'Officer A',
                'approvingOfficer'      => 'Officer B',
                'reportingUnit'         => 'PWD Services Unit',
                'controlNo'             => 'CTRL-2025-' . str_pad($i, 3, '0', STR_PAD_LEFT),
                'photo'                 => null,
                'signature'             => null,
                'created_at'            => now(),
                'updated_at'            => now(),
            ]);
        }
    }
}
