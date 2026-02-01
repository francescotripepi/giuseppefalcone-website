"use client";

import { useEffect, useState } from "react";
import { motion, useSpring, useTransform } from "framer-motion";
import { Clock, Music, Users, Award } from "lucide-react";

const stats = [
  {
    icon: Clock,
    value: 150000,
    suffix: "+",
    label: "Minutes of Dancefloor",
    color: "#ff0080",
  },
  {
    icon: Music,
    value: 35,
    suffix: "",
    label: "Years of Classics Mastered",
    color: "#ffd000",
  },
  {
    icon: Users,
    value: 500000,
    suffix: "+",
    label: "Happy Dancers",
    color: "#00d4ff",
  },
  {
    icon: Award,
    value: 1200,
    suffix: "+",
    label: "Events Performed",
    color: "#00ff88",
  },
];

function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
  const [isInView, setIsInView] = useState(false);
  const spring = useSpring(0, { duration: 2000 });
  const display = useTransform(spring, (latest) =>
    Math.floor(latest).toLocaleString()
  );

  useEffect(() => {
    if (isInView) {
      spring.set(value);
    }
  }, [isInView, spring, value]);

  return (
    <motion.span
      onViewportEnter={() => setIsInView(true)}
      className="tabular-nums"
    >
      {display}
      {suffix}
    </motion.span>
  );
}

export default function LiveProof() {
  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 gradient-mesh opacity-30" />

      <div className="max-w-7xl mx-auto px-6 relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-sm tracking-[0.3em] uppercase text-white/60 mb-4">
            The Numbers Speak
          </p>
          <h2 className="text-4xl md:text-5xl font-bold">
            Live <span className="text-gradient-neon">Proof</span>
          </h2>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative group"
            >
              <div className="glass p-6 md:p-8 rounded-lg text-center h-full transition-all group-hover:scale-105">
                {/* Icon */}
                <div
                  className="w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${stat.color}20` }}
                >
                  <stat.icon className="w-6 h-6" style={{ color: stat.color }} />
                </div>

                {/* Value */}
                <div
                  className="text-3xl md:text-4xl font-bold mb-2"
                  style={{ color: stat.color }}
                >
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </div>

                {/* Label */}
                <p className="text-sm text-white/60">{stat.label}</p>

                {/* Glow effect on hover */}
                <div
                  className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity -z-10"
                  style={{
                    boxShadow: `0 0 40px ${stat.color}20`,
                  }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
