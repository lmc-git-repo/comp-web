<?php
// backend/app/Models/Department.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Department extends Model
{
    use HasFactory;

    // --- CRITICAL CHANGE: Disable automatic timestamps ---
    public $timestamps = false; 
    
    protected $fillable = [
        'dept_list',
    ];
}