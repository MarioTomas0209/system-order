import { Code, Smartphone, Monitor, Database, Palette, Settings } from "lucide-react";

export interface ServiceData {
    id: string;
    title: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    features: string[];
    color: string;
}

export const services: ServiceData[] = [
    {
        id: "web-development",
        title: "Desarrollo Web",
        description: "Creamos sitios web modernos y responsivos que se adaptan a cualquier dispositivo.",
        icon: Monitor,
        features: [
            "Diseño responsivo",
            "Optimización SEO",
            "Carga rápida",
            "Seguridad avanzada"
        ],
        color: "from-blue-500 to-blue-600"
    },
    {
        id: "mobile-development",
        title: "Desarrollo Móvil",
        description: "Desarrollamos aplicaciones móviles nativas e híbridas para iOS y Android.",
        icon: Smartphone,
        features: [
            "Apps nativas",
            "Cross-platform",
            "UI/UX optimizada",
            "Integración API"
        ],
        color: "from-green-500 to-green-600"
    },
    {
        id: "backend-development",
        title: "Backend & APIs",
        description: "Construimos APIs robustas y escalables para conectar todos tus sistemas.",
        icon: Database,
        features: [
            "APIs RESTful",
            "Microservicios",
            "Base de datos",
            "Autenticación"
        ],
        color: "from-purple-500 to-purple-600"
    },
    {
        id: "ui-ux-design",
        title: "Diseño UI/UX",
        description: "Diseñamos interfaces intuitivas y experiencias de usuario excepcionales.",
        icon: Palette,
        features: [
            "Prototipado",
            "Diseño de interfaces",
            "Experiencia de usuario",
            "Testing de usabilidad"
        ],
        color: "from-pink-500 to-pink-600"
    },
    {
        id: "system-integration",
        title: "Integración de Sistemas",
        description: "Conectamos y optimizamos tus sistemas existentes para mayor eficiencia.",
        icon: Settings,
        features: [
            "Migración de datos",
            "Automatización",
            "Integración de APIs",
            "Optimización"
        ],
        color: "from-orange-500 to-orange-600"
    },
    {
        id: "custom-solutions",
        title: "Soluciones Personalizadas",
        description: "Desarrollamos software a medida para resolver problemas específicos de tu negocio.",
        icon: Code,
        features: [
            "Análisis de requerimientos",
            "Desarrollo personalizado",
            "Testing exhaustivo",
            "Soporte continuo"
        ],
        color: "from-indigo-500 to-indigo-600"
    }
];
