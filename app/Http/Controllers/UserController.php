<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    // --------------------------
    // RETURN ALL USERS AS ARRAY
    // --------------------------
    public function index()
    {
        return User::orderBy('id', 'desc')->get();
    }

    // --------------------------
    // CREATE USER
    // --------------------------
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'email' => 'required|string|unique:users,email',
            'password' => 'required|string|min:6',
            'role' => 'required|string'
        ]);

        $validated['password'] = Hash::make($validated['password']);

        return User::create($validated);
    }

    // --------------------------
    // SHOW SINGLE USER
    // --------------------------
    public function show($id)
    {
        return User::findOrFail($id);
    }

    // --------------------------
    // UPDATE USER
    // --------------------------
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string',
            'email' => "required|string|unique:users,email,$id",
            'role' => 'required|string',
        ]);

        if ($request->password) {
            $validated['password'] = Hash::make($request->password);
        }

        $user->update($validated);

        return $user;
    }

    // --------------------------
    // DELETE USER
    // --------------------------
    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $user->delete();

        return response()->json(['message' => 'User deleted']);
    }
}