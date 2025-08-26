import React, { useState, useEffect, useRef } from 'react';
import { TrendingUp, Users, Building2, Calendar } from 'lucide-react';

const Statistics = () => {
  const [counters, setCounters] = useState({
    mentors: 0,
    startups: 0,
    events: 0,
    investors: 0
  });
  const [hasAnimated, setHasAnimated] = useState(false);
  const sectionRef = useRef(null);

  const finalValues = {
    mentors: 150,
    startups: 500,
    events: 200,
    investors: 75
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          animateCounters();
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated]);

  const animateCounters = () => {
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;

    Object.keys(finalValues).forEach(key => {
      let currentValue = 0;
      const increment = finalValues[key] / steps;

      const timer = setInterval(() => {
        currentValue += increment;
        if (currentValue >= finalValues[key]) {
          currentValue = finalValues[key];
          clearInterval(timer);
        }

        setCounters(prev => ({
          ...prev,
          [key]: Math.floor(currentValue)
        }));
      }, interval);
    });
  };

  const stats = [
    {
      icon: Users,
      label: 'Expert Mentors',
      value: counters.mentors,
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/10'
    },
    {
      icon: Building2,
      label: 'Startups',
      value: counters.startups,
      color: 'text-green-400',
      bgColor: 'bg-green-400/10'
    },
    {
      icon: Calendar,
      label: 'Events',
      value: counters.events,
      color: 'text-purple-400',
      bgColor: 'bg-purple-400/10'
    },
    {
      icon: TrendingUp,
      label: 'Investors',
      value: counters.investors,
      color: 'text-orange-400',
      bgColor: 'bg-orange-400/10'
    }
  ];

  return (
    <section id="statistics" ref={sectionRef} className="py-20 bg-slate-800/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-orange-400 bg-clip-text text-transparent">
            Our Impact
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Join thousands of entrepreneurs, mentors, and investors who are building the future together.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div 
                key={stat.label}
                className="group text-center bg-slate-900/70 backdrop-blur-sm rounded-xl p-8 hover:bg-slate-900 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-orange-500/10 border border-slate-700 hover:border-orange-500/30"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${stat.bgColor} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <IconComponent className={`w-8 h-8 ${stat.color}`} />
                </div>
                
                <div className="text-4xl font-bold text-white mb-2">
                  {stat.value.toLocaleString()}
                  <span className="text-orange-400">+</span>
                </div>
                
                <p className="text-gray-300 font-medium">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Statistics;