<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        // 1. VALIDATION: We only require the input fields to be strings, 
        // not necessarily valid email formats, as the user might input a username.
        $request->validate([
            'email' => 'required|string', 
            'password' => 'required|string',
        ]);

        // Retrieve the login input (which comes as 'email' from the frontend)
        $login = $request->input('email');
        
        // 2. Determine the field type based on input format
        // Check if the input value looks like an email address
        $fieldType = filter_var($login, FILTER_VALIDATE_EMAIL) ? 'email' : 'name'; 
        // Your database image shows the username is stored in the 'name' column.

        // 3. Prepare the credentials array for Auth::attempt()
        $credentials = [
            $fieldType => $login,
            'password' => $request->input('password')
        ];
        
        // 4. Attempt to authenticate the user
        if (Auth::attempt($credentials)) {
            // Success: Generate and return token (Assuming Sanctum)
            $user = Auth::user(); 
            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'message' => 'Login successful',
                'user' => $user,
                'access_token' => $token,
                'token_type' => 'Bearer',
            ], 200);
        }

        // 5. Failure: Throw an exception with a generic error message
        throw ValidationException::withMessages([
            'email' => ['Invalid username or password.'],
        ]);
    }
}