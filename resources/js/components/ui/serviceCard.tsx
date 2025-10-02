import { ServiceData } from "../../data/services";

interface ServiceCardProps {
    service: ServiceData;
}

export default function ServiceCard({ service }: ServiceCardProps) {
    const IconComponent = service.icon;
    
    return (
        <div className="group relative overflow-hidden rounded-xl bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 dark:bg-gray-800">
            {/* Gradiente de fondo */}
            <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 transition-opacity duration-300 group-hover:opacity-5`}></div>
            
            {/* Icono */}
            <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-r ${service.color} text-white shadow-lg`}>
                <IconComponent className="h-6 w-6" />
            </div>
            
            {/* Contenido */}
            <div className="relative z-10">
                <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
                    {service.title}
                </h3>
                <p className="mb-4 text-gray-600 dark:text-gray-300">
                    {service.description}
                </p>
                
                {/* Características */}
                <ul className="space-y-2">
                    {service.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                            <div className={`mr-2 h-1.5 w-1.5 rounded-full bg-gradient-to-r ${service.color}`}></div>
                            {feature}
                        </li>
                    ))}
                </ul>
            </div>
            
            {/* Efecto hover */}
            <div className={`absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r ${service.color} transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100`}></div>
        </div>
    );
}
