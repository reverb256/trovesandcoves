import { Truck, Shield, Gem } from "lucide-react";

export default function FeaturesBar() {
  const features = [
    {
      icon: Truck,
      text: "Free Shipping Across Canada"
    },
    {
      icon: Shield,
      text: "Crafted with Intention"
    },
    {
      icon: Gem,
      text: "Empower Your Energy"
    }
  ];

  return (
    <section className="relative py-8 border-b" style={{ backgroundColor: 'hsl(var(--bg-primary))', borderColor: 'hsla(var(--troves-turquoise),0.15)' }}>
      {/* Mystical top border glow */}
      <div className="absolute top-0 left-0 w-full h-px"
        style={{ background: 'linear-gradient(90deg, transparent, hsla(174,85%,45%,0.4), transparent)' }}
      ></div>

      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 text-center">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="flex items-center justify-center gap-3 group">
                <div className="relative">
                  {/* Icon glow effect */}
                  <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ backgroundColor: 'hsla(174,85%,45%,0.2)', filter: 'blur(8px)' }}
                  ></div>
                  <Icon className="relative w-5 h-5 transition-colors duration-300"
                    style={{ color: '#deb55b' }}
                  />
                </div>
                <span className="font-medium tracking-wide transition-colors duration-300"
                  style={{ 
                    color: 'hsl(var(--text-primary))',
                    fontFamily: "'Montserrat', sans-serif"
                  }}
                >
                  {feature.text}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mystical bottom border glow */}
      <div className="absolute bottom-0 left-0 w-full h-px"
        style={{ background: 'linear-gradient(90deg, transparent, hsla(43,95%,55%,0.3), transparent)' }}
      ></div>
    </section>
  );
}
