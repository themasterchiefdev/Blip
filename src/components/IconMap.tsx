import { Github, ExternalLink } from 'lucide-react';

const IconMap = ({ name, size = 16, className = "" }: { name: string, size?: number, className?: string }) => {
    switch (name) {
        case 'Github': return <Github size={size} className={className} />;
        case 'ExternalLink': return <ExternalLink size={size} className={className} />;
        default: return <ExternalLink size={size} className={className} />;
    }
};

export default IconMap;
