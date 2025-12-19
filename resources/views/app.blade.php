<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Laguna Metts Corporation</title>

    {{-- Favicon --}}
    <link rel="icon" type="image/png" href="/images/LMC-Logo-Wht.png">
    <link rel="shortcut icon" type="image/png" href="/images/LMC-Logo-Wht.png">

    {{-- Vite React --}}
    @viteReactRefresh
    @vite([
        'resources/js/app.jsx',
        'resources/css/global.css'
    ])
</head>

<body>
    <div id="app"></div>
</body>
</html>