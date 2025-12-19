<?php

namespace App\Http\Controllers;

use App\Models\Announcement;
use App\Models\Attachment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class AnnouncementController extends Controller
{
    // ===============================
    // LIST ALL ANNOUNCEMENTS
    // ===============================
    public function index()
    {
        $posts = Announcement::with('attachments')
            ->orderByDesc('posted_at')
            ->orderByDesc('created_at')
            ->get();

        foreach ($posts as $post) {
            foreach ($post->attachments as $file) {
                $file->url = Storage::disk('public')->url($file->file_path);
            }
        }

        return response()->json($posts);
    }

    // ===============================
    // SHOW ANNOUNCEMENT
    // ===============================
    public function show($id)
    {
        $post = Announcement::with('attachments')->find($id);

        if (!$post) {
            return response()->json(['message' => 'Announcement not found'], 404);
        }

        foreach ($post->attachments as $file) {
            $file->url = Storage::disk('public')->url($file->file_path);
        }

        return response()->json($post);
    }

        // ===============================
        // CREATE ANNOUNCEMENT
        // ===============================
        public function store(Request $request)
    {
        $validated = $request->validate([
            'title'   => 'required|string|max:255',
            'content' => 'required|string',

            // ✅ FIX: DO NOT force array on multipart uploads
            'attachments.*' => 'file|mimes:jpg,jpeg,png,pdf|max:10240',
        ]);

        $announcement = Announcement::create([
            'title'     => $validated['title'],
            'content'   => $validated['content'],
            'posted_at' => now(),
        ]);

        if ($request->hasFile('attachments')) {
            foreach ($request->file('attachments') as $file) {
                $path = $file->store('news_attachments', 'public');

                Attachment::create([
                    'announcement_id' => $announcement->id,
                    'file_name'       => $file->getClientOriginalName(),
                    'file_path'       => $path,
                    'mime_type'       => $file->getMimeType(),
                    'file_type'       => $file->extension(),
                    'file_size'       => $file->getSize(),
                ]);
            }
        }

        $announcement->load('attachments');

        foreach ($announcement->attachments as $file) {
            $file->url = Storage::disk('public')->url($file->file_path);
        }

        return response()->json([
            'message' => 'Announcement created successfully',
            'data' => $announcement,
        ], 201);
    }


    // ===============================
    // UPDATE ANNOUNCEMENT
    // ===============================
    public function update(Request $request, $id)
    {
        $announcement = Announcement::findOrFail($id);

        $request->validate([
            'title' => 'required|string',
            'content' => 'required|string',
            'attachments' => 'nullable|array',
            'attachments.*' => 'file|mimes:jpg,jpeg,png,pdf|max:51200',
        ]);

        $announcement->update([
            'title'   => $request->title,
            'content' => $request->content,
        ]);

        if ($request->filled('deleted_attachments')) {
            $ids = $request->input('deleted_attachments', []);
            $attachments = Attachment::whereIn('id', $ids)->get();

            foreach ($attachments as $att) {
                Storage::disk('public')->delete($att->file_path);
                $att->delete();
            }
        }

        if ($request->hasFile('attachments')) {
            foreach ($request->file('attachments') as $file) {
                $path = $file->store('news_attachments', 'public');

                Attachment::create([
                    'announcement_id' => $announcement->id,
                    'file_name'       => $file->getClientOriginalName(),
                    'file_path'       => $path,
                    'mime_type'       => $file->getMimeType(),
                    'file_type'       => $file->extension(),
                    'file_size'       => $file->getSize(),
                ]);
            }
        }

        $announcement->load('attachments');

        foreach ($announcement->attachments as $file) {
            $file->url = Storage::disk('public')->url($file->file_path);
        }

        return response()->json($announcement);
    }

    // ===============================
    // DELETE ANNOUNCEMENT
    // ===============================
    public function destroy($id)
    {
        $announcement = Announcement::findOrFail($id);

        foreach ($announcement->attachments as $att) {
            Storage::disk('public')->delete($att->file_path);
        }

        $announcement->delete();

        return response()->json(['message' => 'Announcement deleted']);
    }
}