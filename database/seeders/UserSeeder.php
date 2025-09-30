<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

use App\Models\User;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::insert([
            [
                'email' => 'superadmin@virsato.com',
                'name' => 'Virsato',
                'password' => Hash::make('12344321'),
                'email_verified_at' => now(),
                'may_be_visible' => false,
                'is_super_admin' => true,
                'uid' => User::generateUID(),
            ],
            [
                'email' => 'admin@admin.com',
                'name' => 'Administrador',
                'password' => Hash::make('contraseña'),
                'email_verified_at' => now(),
                'may_be_visible' => true,
                'is_super_admin' => true,
                'uid' => User::generateUID(),
            ]
        ]);
    }
}
