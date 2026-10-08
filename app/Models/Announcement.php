<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Announcement extends Model
{
    protected $fillable = [
        'title',
        'content',
        'title_ja',
        'content_ja',
        'posted_at',
        'category'
    ];

    protected $casts = [
        'posted_at' => 'datetime',
    ];

    public function attachments()
    {
        return $this->hasMany(Attachment::class);
    }
}