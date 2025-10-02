<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('title')</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'open-sans', sans-serif;
            color: #333;
            line-height: 1.6;
            padding: 20px;
        }

        .no-data {
            background-color: #ffe5e5;
            padding: 15px;
            margin-top: 20px;
            border-left: 5px solid #dc3545;
            border-radius: 5px;
        }

        .footer {
            text-align: center;
            padding: 2rem;
            margin-top: 2rem;
            color: var(--secondary-color);
            border-top: 1px solid var(--border-color);
            font-size: 0.9em;
        }

        .text-center {
            text-align: center;
        }

        /* Estilos personalizados para la empresa */
        .b {
            border: 1px solid #000;
        }

        .shop-info {
            display: block;
            padding: 3px;
            font-size: 12px;
        }

        .table {
            width: 100%;
            border-collapse: collapse;
            font-size: 0.8em;
        }

        .th,
        .td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }

        .th {
            background-color: #f2f2f2;
        }

        .fecha {
            font-size: 0.8em;
            margin-bottom: 2rem;
            background: #fcec0b;
            padding: 0.5rem;
            border-radius: 5px;
            width: 30%;
        }

        .status-active {
            color: rgba(25, 135, 84, 1);
            background-color: rgba(41, 204, 57, 0.15);
            border-radius: 50rem;
            text-transform: uppercase;
            padding: 0.3rem .7rem 0.3rem .7rem;
        }

        .status-inactive {
            color: rgba(220, 53, 69, 1);
            background-color: rgba(220, 53, 69, 0.15);
            border-radius: 50rem;
            text-transform: uppercase;
            padding: 0.3rem .7rem 0.3rem .7rem;
        }

        .bxs-circle:before {
            content: "\ec9b";
        }

        .me-1 {
            margin-right: .25rem !important;
        }

        .text-lowercase {
            text-transform: lowercase;
        }

        .text-uppercase {
            text-transform: uppercase;
        }

        .text-capitalize {
            text-transform: capitalize;
        }

        .fw-bold {
            font-weight: bold;
        }

        .fs-7 {
            font-size: 0.5rem;
        }

        .fs-6 {
            font-size: 1rem;
        }

        .fs-5 {
            font-size: 1.5rem;
        }

        .fs-4 {
            font-size: 2rem;
        }

        .fs-3 {
            font-size: 2.5rem;
        }

        .fs-2 {
            font-size: 3rem;
        }

        .fs-1 {
            font-size: 3.5rem;
        }

        .text-primary {
            color: #007bff;
        }

        .text-secondary {
            color: #6c757d;
        }

        .text-success {
            color: #28a745;
        }

        .text-danger {
            color: #dc3545;
        }

        .text-warning {
            color: #ffc107;
        }

        .text-info {
            color: #17a2b8;
        }

        .text-light {
            color: #f8f9fa;
        }
    </style>
</head>

<body>

    <table width="100%" style="border-bottom: 1px solid #b6b6b6; margin-bottom: 10px;">
        <tr>
            <td width="25%">
                <img class="logo-icon" src="{{ $system_logo }}" style="border-radius: 5px" width="60px">
            </td>
            <td width="50%" class="text-center">
                <h1>{{ $system_name ?? config('app.name', 'Sistema') }}</h1>
                @if ($system_slogan)
                    <p>{{ $system_slogan }}</p>
                @endif
            </td>
            <td width="25%">
                @if ($system_address)
                    <span class="shop-info"><b>Dirección:</b> {{ $system_address }}</span>
                @endif
                @if ($system_phone)
                    <span class="shop-info"><b>Tel:</b> {{ $system_phone }}</span>
                @endif
                @if ($system_email)
                    <span class="shop-info"><b>Email:</b> {{ $system_email }}</span>
                @endif
                @if ($system_web_site)
                    <span class="shop-info"><b>Web:</b> {{ $system_web_site }}</span>
                @endif
            </td>
        </tr>
    </table>

    <div class="container">

        <main class="main-content">
            @yield('content')
        </main>

        <footer class="footer">
            <p>&copy; {{ now()->year }} {{ $system_name ?? config('app.name', 'Sistema') }}. Todos los derechos reservados.</p>
        </footer>
    </div>

</body>

</html>