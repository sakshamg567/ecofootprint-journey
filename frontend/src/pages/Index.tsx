import { Leaf, ShoppingCart, Car, PencilRuler } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      {/* Hero Section */}
      <section id="hero" className="relative h-screen flex items-center justify-center bg-gradient-to-b from-[#F2FCE2] to-white px-4">
        <div className="container max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <span className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold tracking-wide">
              Measure Your Environmental Impact
            </span>
            <h1 className="text-4xl md:text-6xl font-bold text-secondary">
              Every Purchase Leaves a
              <span className="text-primary"> Trace</span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg text-foreground/80">
              Understand and reduce your carbon footprint with intelligent tracking across your daily activities.
            </p>
            <button className="bg-primary text-white px-8 py-3 rounded-lg font-semibold transform transition-all hover:scale-105 hover:shadow-lg">
              Get The App Now
            </button>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-background">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-4">
              Seamless Carbon Tracking
            </h2>
            <p className="text-foreground/70 max-w-2xl mx-auto">
              Multiple ways to track your environmental impact, designed to fit perfectly into your daily life.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: ShoppingCart,
                title: "E-commerce Integration",
                description: "Automatically calculate the carbon footprint of your online purchases.",
              },
              {
                icon: Car,
                title: "Transport Tracking",
                description: "Monitor your travel impact with our smart transport detection.",
              },
              {
                icon: PencilRuler,
                title: "Manual Entries",
                description: "Add custom activities and their environmental impact with ease.",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="p-6 rounded-xl bg-amber-50 hover:bg-amber-100 border-amber-300 border transition-colors"
              >
                <feature.icon className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold text-secondary mb-2">
                  {feature.title}
                </h3>
                <p className="text-foreground/70">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-20 px-4 bg-secondary text-white">
        <div className="container max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto space-y-6"
          >
            <Leaf className="w-16 h-16 mx-auto text-primary-foreground opacity-80" />
            <h2 className="text-3xl md:text-4xl font-bold">
              Your Actions Matter
            </h2>
            <p className="text-lg leading-relaxed text-white/80">
              Every choice we make impacts our planet. By understanding our individual carbon footprint, 
              we can make informed decisions that contribute to a sustainable future. Join thousands of 
              others who are taking control of their environmental impact with ecotrace.
            </p>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-t from-[#F2FCE2] to-white">
        <div className="container max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-secondary">
              Ready to Make a Difference?
            </h2>
            <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
              Join our community of environmentally conscious individuals and start your journey 
              towards a more sustainable lifestyle.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-primary text-white px-8 py-3 rounded-lg font-semibold transform transition-all hover:scale-105">
                Download the App
              </button>
              {/* <button className="bg-secondary text-white px-8 py-3 rounded-lg font-semibold transform transition-all hover:scale-105">
                Create Account
              </button> */}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Index;
