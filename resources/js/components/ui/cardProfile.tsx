import { Briefcase, Facebook, Github, Instagram, Linkedin, Mail, MapPin, Phone } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { Button } from "./button";
import { ProfileData } from "../../data/profiles";

interface CardProfileProps {
    profile: ProfileData;
}

export default function CardProfile({ profile }: CardProfileProps) {
    const { name, image, job, location, whatsapp, email, github, linkedin, facebook, instagram } = profile;
    return (
        <Card className="border-3 border-blue-500 w-80 p-2">
            <CardHeader>
                <CardTitle>
                    <img src={image} className="w-40 h-40 rounded-full border-3 border-blue-500 mx-auto" alt="Card Profile" />
                    <h1 className="text-xl font-bold text-center">{name}</h1>
                    <p className="text-sm text-center flex items-center justify-center gap-2 font-normal">
                        <Briefcase className="w-4 h-4 text-blue-500" /> {job}
                    </p>
                    <p className="text-xs mt-1 text-muted-foreground text-center flex items-center justify-center gap-2 font-normal">
                       <MapPin className="w-4 h-4 text-yellow-500" /> {location}
                    </p>
                </CardTitle>
            </CardHeader>
            <CardContent>
                {/* Redes Sociales */}
                <div className="flex items-center justify-center gap-2">
                    <a href={github} target="_blank" rel="noopener noreferrer">
                        <Github className="w-4 h-4 text-gray-500" />
                    </a>
                    <a href={linkedin} target="_blank" rel="noopener noreferrer">
                        <Linkedin className="w-4 h-4 text-gray-500" />
                    </a>
                    <a href={facebook} target="_blank" rel="noopener noreferrer">
                        <Facebook className="w-4 h-4 text-gray-500" />
                    </a>
                </div>

                {/* Botones de contacto */}
                <div className="flex items-center justify-center gap-2 mt-4 flex-col">
                    <Button variant="green" className="w-full" onClick={() => window.open(whatsapp, '_blank')}>
                        <Phone className="w-4 h-4 text-white" /> WhatsApp
                    </Button>
                    <Button variant="blue" className="w-full" onClick={() => window.open(`mailto:${email}`, '_blank')}>
                        <Mail className="w-4 h-4 text-white" /> Correo Electrónico
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}