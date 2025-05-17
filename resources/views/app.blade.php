<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">

    <title inertia>{{ config('app.name', 'PWDNATO') }}</title>

    <!-- CSRF Token -->
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <!-- Theme Color for PWA -->
    <meta name="theme-color" content="#0093AF">

    <!-- Manifest and PWA Icons -->
    <link rel="manifest" href="/manifest.json">
    <link rel="apple-touch-icon" href="/images/icons/icon-192x192.png" sizes="192x192">
    <link rel="icon" type="image/png" href="/images/icons/icon-192x192.png">

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

    <!-- Scripts -->
    @routes
    @viteReactRefresh
    @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
    @inertiaHead
</head>

    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
