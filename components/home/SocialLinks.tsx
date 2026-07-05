import Link from 'next/link';
import { Facebook, Instagram, Linkedin, Twitter, MessageCircle } from 'lucide-react';

export default function SocialLinks() {
  const socials = [
    { name: 'Facebook', icon: <Facebook size={20} />, href: 'https://www.facebook.com/rodrigo.j.tomasini/', color: 'hover:text-blue-500 hover:border-blue-500' },
    { name: 'Instagram', icon: <Instagram size={20} />, href: 'https://www.instagram.com/clases1a1/', color: 'hover:text-pink-500 hover:border-pink-500' },
    { name: 'LinkedIn', icon: <Linkedin size={20} />, href: 'https://www.linkedin.com/in/royalfa28/', color: 'hover:text-blue-400 hover:border-blue-400' },
    { name: 'X' , icon: <Twitter size={20} />, href: 'https://twitter.com/clases1a1', color: 'hover:text-gray-300 hover:border-gray-300' },
  ];

  return (
    <div className="bg-base-surface/40 border border-base-border p-6 rounded-sm mb-6">
      <h3 className="text-sm uppercase tracking-wider text-text-muted font-semibold mb-4 text-center">
        Conecta conmigo
      </h3>
      <div className="flex justify-center gap-4">
        {socials.map((social) => (
          <Link 
            key={social.name} 
            href={social.href}
            target="_blank"
            className={`p-3 border border-base-border bg-base-dark rounded-sm text-text-muted transition-all duration-300 ${social.color}`}
            title={social.name}
          >
            {social.icon}
          </Link>
        ))}
      </div>
    </div>
  );
}