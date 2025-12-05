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
    // LIST
    public function index()
    {
        $posts = Announcement::with('attachments')
            ->orderByDesc('posted_at')
            ->orderByDesc('created_at')
            ->get();

        // Inject URL for each attachment
        foreach ($posts as $post) {
            foreach ($post->attachments as $file) {
                $file->url = Storage::disk('public')->url($file->file_path);
            }
        }

        return response()->json($posts);
    }

    // SHOW
    public function show($id)
    {
        $post = Announcement::with('attachments')->find($id);

        if (!$post) {
            return response()->json(['message' => 'Announcement not found'], 404);
        }

        // Inject URL for each attachment
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
        $request->validate([
            'title' => 'required|string',
            'content' => 'required|string',
            'attachments.*' => 'file|max:10240',
        ]);

        $announcement = Announcement::create([
            'title'     => $request->title,
            'content'   => $request->content,
            'posted_at' => now(),
        ]);

        // -----------------------------
        // SAVE ATTACHMENTS PROPERLY
        // -----------------------------
        if ($request->hasFile('attachments')) {
            foreach ($request->file('attachments') as $file) {

                // Store physical file
                $path = $file->store('news_attachments', 'public');

                // Save DB record
                $attachment = Attachment::create([
                    'announcement_id' => $announcement->id,
                    'file_name'       => $file->getClientOriginalName(),
                    'file_path'       => $path,
                    'mime_type'       => $file->getMimeType(),
                    'file_type'       => $file->extension(),
                    'file_size'       => $file->getSize(),
                ]);

                // Append URL to response
                $attachment->url = Storage::disk('public')->url($path);
            }
        }

        // Load attachments with URL
        $announcement->load('attachments');
        foreach ($announcement->attachments as $file) {
            $file->url = Storage::disk('public')->url($file->file_path);
        }

        return response()->json($announcement, 201);
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
            'attachments.*' => 'file|max:10240',
        ]);

        $announcement->update([
            'title'   => $request->title,
            'content' => $request->content,
        ]);

        // -----------------------------
        // DELETE REMOVED ATTACHMENTS
        // -----------------------------
        if ($request->filled('deleted_attachments')) {
            $ids = $request->input('deleted_attachments', []);

            $attachments = Attachment::whereIn('id', $ids)->get();

            foreach ($attachments as $att) {
                Storage::disk('public')->delete($att->file_path); // remove physical file
                $att->delete(); // remove DB record
            }
        }

        // -----------------------------
        // SAVE NEW ATTACHMENTS
        // -----------------------------
        if ($request->hasFile('attachments')) {
            foreach ($request->file('attachments') as $file) {

                $path = $file->store('news_attachments', 'public');

                $attachment = Attachment::create([
                    'announcement_id' => $announcement->id,
                    'file_name'       => $file->getClientOriginalName(),
                    'file_path'       => $path,
                    'mime_type'       => $file->getMimeType(),
                    'file_type'       => $file->extension(),
                    'file_size'       => $file->getSize(),
                ]);

                $attachment->url = Storage::disk('public')->url($path);
            }
        }

        // Load attachments with URL
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

        // Delete all physical files
        foreach ($announcement->attachments as $att) {
            Storage::disk('public')->delete($att->file_path);
        }

        // Delete announcement + attachments via FK cascade
        $announcement->delete();

        return response()->json(['message' => 'Announcement deleted']);
    }
}