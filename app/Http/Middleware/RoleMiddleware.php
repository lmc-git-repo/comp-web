<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @param  mixed ...$roles
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        $user = $request->user();

        // If not logged in → Unauthorized
        if (!$user) {
            return response()->json([
                'message' => 'Unauthorized'
            ], 401);
        }

        // If logged in but does NOT have allowed role
        if (!in_array($user->role, $roles)) {
            return response()->json([
                'message' => 'Forbidden: insufficient permissions'
            ], 403);
        }

        return $next($request);
    }
}