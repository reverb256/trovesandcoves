import { Truck, Shield, Gem } from "lucide-react";

export default function FeaturesBar() {
  const features = [
    {
      icon: Truck,
      text: "Free Shipping Across Canada"
    },
    {
      icon: Shield,
      text: "Lifetime Warranty"
    },
    {
      icon: Gem,
      text: "Ethically Sourced"
    }
  ];

  return (
    <section className="bg-white py-8 border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 text-center">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="flex items-center justify-center space-x-3">
                <Icon className="text-elegant-gold text-xl w-5 h-5" />
                <span className="font-medium text-gray-800">{feature.text}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
