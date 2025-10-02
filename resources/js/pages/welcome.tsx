import ProfileCarousel from '@/components/ui/profileCarousel';
import ServicesSection from '@/components/ui/servicesSection';
import ThemeToggle from '@/components/ui/themeToggle';
import { profiles } from '@/data/profiles';
import { dashboard, login } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { LayoutGrid, User } from 'lucide-react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Bienvenido">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
                    rel="stylesheet"
                />
            </Head>
            <div className="flex min-h-screen flex-col items-center bg-gradient-to-br from-[#FDFDFC] via-blue-50 to-indigo-100 p-6 text-[#1b1b18] lg:justify-center lg:p-8 dark:from-[#0a0a0a] dark:via-gray-900 dark:to-blue-900">
                {/* Header mejorado con logo y navegación */}
                <header className="mb-8 w-full max-w-[335px] text-sm not-has-[nav]:hidden lg:max-w-6xl">
                    <nav className="flex items-center justify-between">
                        {/* Logo y nombre de la empresa */}
                        <div className="animate-fade-in flex items-center gap-3">
                            <div className="flex items-center justify-center">
                                <img
                                    src="https://github.com/shadcn.png"
                                    className="h-15 w-15 rounded-full border-3 border-blue-500"
                                    alt="Logo"
                                />
                            </div>
                            <div>
                                <h2 className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-lg font-bold text-transparent">
                                    Desarrollo Digital
                                </h2>
                            </div>
                        </div>

                        {/* Botones de navegación con efectos */}
                        <div className="flex items-center gap-3">
                            {/* Botón de tema */}
                            <ThemeToggle />
                            
                            {auth.user ? (
                                <Link
                                    href={dashboard()}
                                    className="group relative inline-block rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-2.5 text-sm font-medium text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-blue-600 hover:to-indigo-700 hover:shadow-xl"
                                >
                                    <span className="relative z-10 flex items-center gap-2">
                                        <LayoutGrid className="w-4 h-4" /> Dashboard
                                    </span>
                                    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-700 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                                </Link>
                            ) : (
                                <Link
                                    href={login()}
                                    className="group relative inline-block rounded-lg border-2 border-blue-500 px-6 py-2.5 text-sm font-medium text-blue-600 transition-all duration-300 hover:scale-105 hover:bg-blue-500 hover:text-white hover:shadow-lg dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-500 dark:hover:text-white"
                                >
                                    <span className="relative z-10 flex items-center gap-2">
                                        <User className="w-4 h-4" /> Iniciar Sesión
                                    </span>
                                </Link>
                            )}
                        </div>
                    </nav>
                </header>
                <div className="flex w-full items-center justify-center opacity-100 transition-opacity duration-750 lg:grow starting:opacity-0">
                    <main className="flex flex-col items-center justify-center gap-8">
                        {/* Sección Hero con animaciones */}
                        <div className="animate-slide-up flex flex-col items-center justify-center gap-4 text-center">
                            <div className="relative">
                                <h1 className="animate-gradient bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-4xl font-bold text-transparent md:text-5xl">
                                    Conoce a nuestros desarrolladores
                                </h1>
                                <div className="absolute -inset-1 animate-pulse rounded-lg bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 opacity-30 blur"></div>
                            </div>
                            <p className="max-w-2xl text-lg leading-relaxed text-gray-700 dark:text-gray-300">
                                Somos un equipo de desarrolladores apasionados
                                que nos dedicamos a crear{' '}
                                <span className="font-semibold text-blue-600">
                                    soluciones digitales innovadoras
                                </span>{' '}
                                para nuestros clientes.
                            </p>
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                <div className="h-2 w-2 animate-pulse rounded-full bg-green-500"></div>
                                <span>Disponibles para nuevos proyectos</span>
                            </div>
                        </div>

                        {/* Carrusel con efectos */}
                        <div className="animate-fade-in-delayed">
                            <ProfileCarousel profiles={profiles} />
                        </div>
                    </main>
                </div>
                
                {/* Sección de Servicios */}
                <div className="w-full">
                    <ServicesSection />
                </div>
                
                <div className="hidden h-14.5 lg:block"></div>
            </div>
        </>
    );
}
