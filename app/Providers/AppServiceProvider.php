<?php

namespace App\Providers;

use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use App\Models\Post;
use App\Models\User;
use Illuminate\Support\Facades\Gate;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Gate::define('admin', fn(User $user) => $user->role === 1);
        Gate::define('pwd', fn(User $user) => $user->role === 0 && $user->is_validated !== 0);
        Gate::define('business', fn(User $user) => $user->role === 2 && $user->is_validated !== 3);
        Gate::define('pharmacy', fn(User $user) => $user->role === 3 && $user->is_validated !== 3);
        Vite::prefetch(concurrency: 3);
    }
}
