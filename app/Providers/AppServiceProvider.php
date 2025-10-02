<?php

namespace App\Providers;

use Illuminate\Support\Facades\Schema;
use Illuminate\Support\ServiceProvider;

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
        Schema::defaultStringLength(191);

        view()->composer('*', function ($view) {
            $view->with([
                'system_logo' => public_path('/logo.jpg'),
                'system_name' => 'Lonas del sureste',
                'system_slogan' => '',
                'system_web_site' => 'https://lonasdelsureste.com',
                'system_phone' => '1234567890',
                'system_email' => 'L2H3R@example.com',
                'system_address' => 'Calle Principal, Ciudad, Estado, Pais',
            ]);
        });
    }
}
