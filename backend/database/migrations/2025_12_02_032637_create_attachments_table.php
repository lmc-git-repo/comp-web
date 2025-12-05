<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('attachments', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('announcement_id');
            $table->string('file_name');
            $table->string('file_path');   // storage path
            $table->string('mime_type');
            $table->string('file_type')->nullable(); // extension (png, pdf, etc.)
            $table->integer('file_size')->nullable();
            $table->timestamps();

            $table->foreign('announcement_id')
                  ->references('id')->on('announcements')
                  ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('attachments');
    }
};