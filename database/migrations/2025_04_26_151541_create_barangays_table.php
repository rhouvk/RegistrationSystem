<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

class CreateBarangaysTable extends Migration
{
    public function up(): void
    {
        Schema::create('barangays', function (Blueprint $table) {
            $table->id();
            $table->foreignId('municipality_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('admin_district')->nullable();
            $table->timestamps();
        });

                // Barangays grouped by administrative district
        $districts = [
            'Poblacion' => [
                '1-A', '2-A', '3-A', '4-A', '5-A', '6-A', '7-A', '8-A', '9-A', '10-A',
                '11-B', '12-B', '13-B', '14-B', '15-B', '16-B', '17-B', '18-B', '19-B', '20-B',
                '21-C', '22-C', '23-C', '24-C', '25-C', '26-C', '27-C', '28-C', '29-C', '30-C',
                '31-D', '32-D', '33-D', '34-D', '35-D', '36-D', '37-D', '38-D', '39-D', '40-D'
            ],
            'Talomo' => [
                'Bago Aplaya', 'Bago Gallera', 'Baliok', 'Bucana', 'Catalunan Grande', 'Catalunan Pequeño',
                'Dumoy', 'Langub', 'Ma-a', 'Magtuod', 'Matina Aplaya', 'Matina Crossing', 'Matina Pangi', 'Talomo Proper'
            ],
            'Agdao' => [
                'Agdao Proper', 'Centro (San Juan)', 'Gov. Paciano Bangoy', 'Gov. Vicente Duterte',
                'Kap. Tomas Monteverde, Sr.', 'Lapu-Lapu', 'Leon Garcia', 'Rafael Castillo',
                'San Antonio', 'Ubalde', 'Wilfredo Aquino'
            ],
            'Buhangin' => [
                'Acacia', 'Alfonso Angliongto Sr.', 'Buhangin Proper', 'Cabantian', 'Callawa', 'Communal',
                'Indangan', 'Mandug', 'Pampanga', 'Sasa', 'Tigatto', 'Vicente Hizon Sr.', 'Waan'
            ],
            'Bunawan' => [
                'Alejandra Navarro (Lasang)', 'Bunawan Proper', 'Gatungan', 'Ilang', 'Mahayag',
                'Mudiang', 'Panacan', 'San Isidro (Licanan)', 'Tibungco'
            ],
            'Paquibato' => [
                'Colosas', 'Fatima (Benowang)', 'Lumiad', 'Mabuhay', 'Malabog', 'Mapula',
                'Panalum', 'Pandaitan', 'Paquibato Proper', 'Paradise Embak', 'Salapawan', 'Sumimao', 'Tapak'
            ],
            'Baguio' => [
                'Baguio Proper', 'Cadalian', 'Carmen', 'Gumalang', 'Malagos', 'Tambobong',
                'Tawan-Tawan', 'Wines'
            ],
            'Calinan' => [
                'Biao Joaquin', 'Calinan Proper', 'Cawayan', 'Dacudao', 'Dalagdag', 'Dominga',
                'Inayangan', 'Lacson', 'Lamanan', 'Lampianao', 'Megkawayan', 'Pangyan',
                'Riverside', 'Saloy', 'Sirib', 'Subasta', 'Talomo River', 'Tamayong', 'Wangan'
            ],
            'Marilog' => [
                'Baganihan', 'Bantol', 'Buda', 'Dalag', 'Datu Salumay', 'Gumitan',
                'Magsaysay', 'Malamba', 'Marilog Proper', 'Salaysay', 'Suawan (Tuli)', 'Tamugan'
            ],
            'Toril' => [
                'Alambre', 'Atan-Awe', 'Bangkas Heights', 'Baracatan', 'Bato', 'Bayabas', 'Binugao',
                'Camansi', 'Catigan', 'Crossing Bayabas', 'Daliao', 'Daliaon Plantation', 'Eden',
                'Kilate', 'Lizada', 'Lubogan', 'Marapangi', 'Mulig', 'Sibulan', 'Sirawan',
                'Tagluno', 'Tagurano', 'Tibuloy', 'Toril Proper', 'Tungkalan'
            ],
            'Tugbok' => [
                'Angalan', 'Bago Oshiro', 'Balenggaeng', 'Biao Escuela', 'Biao Guinga',
                'Los Amigos', 'Manambulan', 'Manuel Guianga', 'Matina Biao', 'Mintal',
                'New Carmen', 'New Valencia', 'Santo Niño', 'Tacunan', 'Tagakpan', 'Talandang',
                'Tugbok Proper', 'Ula'
            ]
        ];

        foreach ($districts as $district => $barangays) {
            foreach ($barangays as $barangay) {
                DB::table('barangays')->insert([
                    'municipality_id' => 1, // Davao City
                    'name' => $barangay,
                    'admin_district' => $district,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('barangays');
    }
}
