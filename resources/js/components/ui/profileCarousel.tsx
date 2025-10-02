import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";
import { Button } from "./button";
import CardProfile from "./cardProfile";
import { ProfileData } from "../../data/profiles";

interface CarouselProps {
    profiles: ProfileData[];
}

export default function ProfileCarousel({ profiles }: CarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => 
            prevIndex === profiles.length - 1 ? 0 : prevIndex + 1
        );
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) => 
            prevIndex === 0 ? profiles.length - 1 : prevIndex - 1
        );
    };

    const goToSlide = (index: number) => {
        setCurrentIndex(index);
    };

    const togglePlayPause = () => {
        setIsPlaying(!isPlaying);
    };

    // Auto-play effect
    useEffect(() => {
        if (!isPlaying) return;

        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => 
                prevIndex === profiles.length - 1 ? 0 : prevIndex + 1
            );
        }, 4000); // Cambia cada 4 segundos

        return () => clearInterval(interval);
    }, [isPlaying, profiles.length]);

    return (
        <div className="relative w-full max-w-md mx-auto">
            {/* Carrusel Container - Solo muestra un perfil */}
            <div className="relative overflow-hidden rounded-lg">
                <div 
                    className="flex transition-transform duration-500 ease-in-out"
                    style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                >
                    {profiles.map((profile, index) => (
                        <div key={index} className="w-full flex-shrink-0 flex justify-center">
                            <CardProfile profile={profile} />
                        </div>
                    ))}
                </div>
            </div>

            {/* Controles de navegación */}
            <div className="flex justify-center items-center mt-6 gap-4">
                <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={prevSlide}
                    className="flex items-center gap-2 text-black dark:text-white"
                >
                    <ChevronLeft className="w-4 h-4" />
                </Button>

                {/* Botón Play/Pause */}
                <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={togglePlayPause}
                    className="flex items-center gap-2 text-black dark:text-white"
                >
                    {isPlaying ? (
                        <Pause className="w-4 h-4 " />
                    ) : (
                        <Play className="w-4 h-4" />
                    )}
                </Button>

                <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={nextSlide}
                    className="flex items-center gap-2 text-black dark:text-white"
                >
                    <ChevronRight className="w-4 h-4" />
                </Button>
            </div>

            {/* Indicadores */}
            <div className="flex justify-center gap-2 mt-4">
                {profiles.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`w-3 h-3 rounded-full transition-colors ${
                            index === currentIndex 
                                ? 'bg-black dark:bg-white' 
                                : 'bg-gray-300 hover:bg-gray-400'
                        }`}
                    />
                ))}
            </div>

        </div>
    );
}
