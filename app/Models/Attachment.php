<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Attachment extends Model
{
    protected $fillable = [
        'announcement_id',
        'file_name',
        'file_path',
        'mime_type',
        'file_type',
        'file_size',
    ];

    protected $appends = ['url'];

    public function getUrlAttribute()
    {
        return Storage::disk('public')->url($this->file_path);
    }

    public function announcement()
    {
        return $this->belongsTo(Announcement::class);
    }
}