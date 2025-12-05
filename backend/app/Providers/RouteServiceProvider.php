<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Route;

class RouteServiceProvider extends ServiceProvider
{
    /**
     * The path to your application's "home" route.
     */
    public const HOME = '/home';

    /**
     * Boot the route service provider.
     */
    public function boot(): void
    {
        $this->configureRateLimiting();

        $this->routes(function () {

            // 🔵 API ROUTES (stateless)
            Route::prefix('api')
                ->middleware('api')
                ->group(base_path('routes/api.php'));

            // 🔵 WEB ROUTES (session, csrf)
            Route::middleware('web')
                ->group(base_path('routes/web.php'));

        });
    }

    /**
     * Configure your API rate limits.
     */
    protected function configureRateLimiting()
    {
        RateLimiter::for('api', function (Request $request) {
            return Limit::perMinute(60)->by(
                $request->user()?->id ?: $request->ip()
            );
        });
    }
}