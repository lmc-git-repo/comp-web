<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

/*
|--------------------------------------------------------------------------
| API ROUTES
|--------------------------------------------------------------------------
| React Login POST request handled here.
*/
Route::prefix('api')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
});


/*
|--------------------------------------------------------------------------
| WEB ROUTES (REACT SPA)
|--------------------------------------------------------------------------
| The React app handles all routing via React Router.
| Laravel only needs to return the SPA view for any path.
*/

// Single-page app entry:
Route::view('/', 'app');

// Catch-all for ALL other frontend routes (admin/users, news/*, etc.)
Route::view('/{any}', 'app')->where('any', '.*');