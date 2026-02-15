import { motion } from 'framer-motion';

const AnimatedBackground = () => {
  return (
    <>
      {/* Gradient Background */}
      <div className="absolute inset-0 gradient-bg opacity-20" />

      {/* Animated Blur Shapes */}
      <motion.div
        className="blur-shape blur-shape-1"
        animate={{
          x: [0, 50, 0],
          y: [0, -30, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="blur-shape blur-shape-2"
        animate={{
          x: [0, -40, 0],
          y: [0, 40, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
      />
      <motion.div
        className="blur-shape blur-shape-3"
        animate={{
          x: [0, 30, 0],
          y: [0, -50, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 16,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 4
        }}
      />

      {/* Curved SVG Lines */}
      <div className="curved-lines-bg text-saylani-green">
        <motion.svg
          className="curved-line"
          viewBox="0 0 1000 1000"
          preserveAspectRatio="none"
          animate={{
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <motion.path
            d="M 0,400 Q 250,300 500,400 T 1000,400"
            animate={{
              d: [
                "M 0,400 Q 250,300 500,400 T 1000,400",
                "M 0,450 Q 250,350 500,450 T 1000,450",
                "M 0,400 Q 250,300 500,400 T 1000,400",
              ],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.svg>
      </div>

      <div className="curved-lines-bg text-saylani-blue">
        <motion.svg
          className="curved-line"
          viewBox="0 0 1000 1000"
          preserveAspectRatio="none"
          animate={{
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        >
          <motion.path
            d="M 0,600 Q 250,500 500,600 T 1000,600"
            animate={{
              d: [
                "M 0,600 Q 250,500 500,600 T 1000,600",
                "M 0,550 Q 250,450 500,550 T 1000,550",
                "M 0,600 Q 250,500 500,600 T 1000,600",
              ],
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.svg>
      </div>

      <div className="curved-lines-bg text-saylani-green-light">
        <motion.svg
          className="curved-line"
          viewBox="0 0 1000 1000"
          preserveAspectRatio="none"
          animate={{
            opacity: [0.1, 0.18, 0.1],
          }}
          transition={{
            duration: 16,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4
          }}
        >
          <motion.path
            d="M 0,300 Q 250,200 500,300 T 1000,300"
            animate={{
              d: [
                "M 0,300 Q 250,200 500,300 T 1000,300",
                "M 0,350 Q 250,250 500,350 T 1000,350",
                "M 0,300 Q 250,200 500,300 T 1000,300",
              ],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.svg>
      </div>
    </>
  );
};

export default AnimatedBackground;