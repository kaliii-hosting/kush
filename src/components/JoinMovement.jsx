import { ArrowRight } from 'lucide-react';

const JoinMovement = () => {
  return (
    <section className="py-[131px] lg:py-[200px] bg-black">
      <div className="max-w-[900px] mx-auto px-5 lg:px-10 text-center">
        <h2 className="font-title text-[36px] md:text-[48px] lg:text-[60px] leading-[1.1] text-white mb-6">
          Join the Movement
        </h2>
        <p className="text-huly-text-light text-[15px] md:text-[18px] leading-relaxed mb-10 max-w-[600px] mx-auto">
          Thousands of teams are already using Huly to transform how they work. Experience the future of team collaboration today.
        </p>
        
        {/* CTA Button with glow effect */}
        <div className="relative inline-block">
          <a 
            href="#get-started"
            className="group relative bg-huly-blue hover:bg-huly-blue/90 text-white px-10 py-5 rounded-full text-[18px] font-medium transition-all duration-300 flex items-center gap-3 shadow-[0_0_40px_rgba(71,139,235,0.5)] hover:shadow-[0_0_60px_rgba(71,139,235,0.7)]"
          >
            Get Early Access
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
          {/* Animated glow ring */}
          <div className="absolute inset-0 rounded-full bg-huly-blue/20 blur-xl animate-pulse" />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 mt-20 max-w-[600px] mx-auto">
          <div>
            <div className="text-[36px] font-bold text-white mb-2">10k+</div>
            <div className="text-huly-text-light text-[14px]">Active teams</div>
          </div>
          <div>
            <div className="text-[36px] font-bold text-white mb-2">50k+</div>
            <div className="text-huly-text-light text-[14px]">Daily users</div>
          </div>
          <div>
            <div className="text-[36px] font-bold text-white mb-2">99.9%</div>
            <div className="text-huly-text-light text-[14px]">Uptime</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default JoinMovement;