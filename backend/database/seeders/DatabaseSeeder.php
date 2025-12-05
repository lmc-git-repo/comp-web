<?php

namespace Database\Seeders;

use App\Models\Department; // <-- ADD THIS LINE
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash; 


class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Create Initial Users
        
        // Clear existing users to avoid duplicates if rerunning
        User::truncate(); 
        
        // Super Admin User
        User::create([
            'name' => 'liezel',
            'email' => 'larracasliezel31@gmail.com',
            'password' => Hash::make('lmcpc_092'),
            'role' => 'super admin',
            'email_verified_at' => now(),
        ]);

        // Admin User 1
        User::create([
            'name' => 'jonas',
            'email' => 'j.tubaying@lagunametts.com',
            'password' => Hash::make('lmcpc_093'),
            'role' => 'super admin',
            'email_verified_at' => now(),
        ]);

        // Admin User 2
        User::create([
            'name' => 'ronald',
            'email' => 'r.pasion@lagunametts.com',
            'password' => Hash::make('lmcpc_011'),
            'role' => 'super admin',
            'email_verified_at' => now(),
        ]);

        // 2. Seed Departments
        
        // Clear existing departments
        Department::truncate(); 
        
        $departments = [
            'Admin', 'HR', 'IT', 'Accounting', 'Purchasing', 'COOP', 'GA', 'GA/Nurse', 
            'Safety', 'Finance', 'Guard House', 'Sales', 'Facilities', 'IMS', 'CMM', 
            'QC', 'Assembly', 'Die Casting', 'Die Mold', 'Die Casting Engineering', 
            'PPC', 'Machining', 'Machine Engineering', 'Deburring', 'New Project', 
            'MRO Warehouse', 'N/A', 'Learning and Development'
        ];

        // Assuming the 'liezel' user (ID 1) is created first and will be the creator.
        $liezelId = User::where('email', 'larracasliezel31@gmail.com')->first()->id ?? 1;

        // Insert each department into the departments table
        foreach ($departments as $dept) {
            Department::create([
                'dept_list' => $dept,
            ]);
        }
    }
}