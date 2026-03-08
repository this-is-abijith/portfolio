import Particles from "react-tsparticles";

function ParticlesBackground() {
  return (
    <Particles
      options={{
        background: { color: { value: "#030712" } },
        particles: {
          number: { value: 60 },
          color: { value: "#8b5cf6" },
          links: {
            enable: true,
            color: "#6366f1",
            distance: 150
          },
          move: {
            enable: true,
            speed: 1
          },
          size: {
            value: 2
          }
        }
      }}
    />
  );
}

export default ParticlesBackground;