<?php

namespace Database\Seeders;

use App\Models\Branch;
use Illuminate\Database\Seeder;

class BranchSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $branches = [
            [
                'name' => 'Sucursal Centro',
                'address' => 'Av. Principal 123, Centro, Mérida, Yucatán',
                'phone' => '(999) 123-4567',
            ],
            [
                'name' => 'Sucursal Norte',
                'address' => 'Calle 60 Norte 456, Col. Centro, Mérida, Yucatán',
                'phone' => '(999) 234-5678',
            ],
            [
                'name' => 'Sucursal Sur',
                'address' => 'Av. Itzáes 789, Col. García Ginerés, Mérida, Yucatán',
                'phone' => '(999) 345-6789',
            ],
            [
                'name' => 'Sucursal Oriente',
                'address' => 'Calle 50 321, Col. Del Carmen, Mérida, Yucatán',
                'phone' => '(999) 456-7890',
            ],
        ];

        foreach ($branches as $branchData) {
            Branch::create($branchData);
        }
    }
}