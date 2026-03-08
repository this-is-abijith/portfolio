import { motion } from "framer-motion";
import { useState } from "react";
import NeuralBackground from "./NeuralBackground";

function App() {
const [menuOpen, setMenuOpen] = useState(false);

return (
<> <NeuralBackground />

  <div className="bg-gray-950 text-white min-h-screen relative z-10">

    {/* NAVBAR */}
    <nav className="fixed top-0 w-full bg-gray-950/80 backdrop-blur-md border-b border-gray-800 z-50">
      <div className="max-w-6xl mx-auto flex justify-between items-center p-4">

        <h1 className="text-xl font-bold">Abijith</h1>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6 text-gray-300">
          <a href="#about" className="hover:text-purple-400 transition">About</a>
          <a href="#skills" className="hover:text-purple-400 transition">Skills</a>
          <a href="#projects" className="hover:text-purple-400 transition">Projects</a>
          <a href="#contact" className="hover:text-purple-400 transition">Contact</a>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>

      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-gray-900 text-center py-4 space-y-4">
          <a href="#about" className="block">About</a>
          <a href="#skills" className="block">Skills</a>
          <a href="#projects" className="block">Projects</a>
          <a href="#contact" className="block">Contact</a>
        </div>
      )}
    </nav>


    {/* HERO */}
    <section className="h-screen flex flex-col justify-center items-center text-center px-6">

      <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
        Abijith Binu
      </h1>

      <p className="text-xl text-gray-400 mb-4">
        AI / ML Developer • React Developer
      </p>

      <p className="text-gray-500 max-w-xl text-center mb-8">
        Building AI-powered applications and modern web experiences
        using Machine Learning, Python and React.
      </p>

      <div className="space-x-4">

        <a
          href="https://github.com/this-is-abijith"
          target="_blank"
          rel="noreferrer"
          className="bg-white text-black px-6 py-2 rounded-lg font-medium hover:scale-105 transition"
        >
          GitHub
        </a>

        <a
          href="https://www.linkedin.com/in/abijith-binu/"
          target="_blank"
          rel="noreferrer"
          className="border border-white px-6 py-2 rounded-lg hover:bg-white hover:text-black transition"
        >
          LinkedIn
        </a>

        <a
          href="/resume.pdf"
          className="border border-purple-400 px-6 py-2 rounded-lg hover:bg-purple-400 hover:text-black transition"
        >
          Resume
        </a>

      </div>

      {/* Scroll indicator */}
      <div className="mt-16 text-gray-500 animate-bounce">
        ↓ Scroll
      </div>

    </section>


    {/* ABOUT */}
    <motion.section
      id="about"
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="max-w-4xl mx-auto py-20 px-6"
    >

      <h2 className="text-3xl font-bold mb-6">About Me</h2>

      <p className="text-gray-400 leading-relaxed">
        I'm an MSc student passionate about Artificial Intelligence,
        Machine Learning and Web Development. I enjoy building AI
        applications and modern web systems using React, Node.js
        and machine learning models.
      </p>

    </motion.section>


    {/* SKILLS */}
    <motion.section
      id="skills"
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="max-w-6xl mx-auto py-20 px-6"
    >

      <h2 className="text-3xl font-bold mb-10">Skills</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

        {[
          "Python",
          "Machine Learning",
          "React",
          "Node.js",
          "MySQL",
          "TensorFlow",
          "Git",
          "Linux"
        ].map((skill, index) => (

          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            className="bg-gray-900 p-4 rounded-lg text-center border border-gray-800"
          >
            {skill}
          </motion.div>

        ))}

      </div>

    </motion.section>


    {/* PROJECTS */}
    <motion.section
      id="projects"
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="max-w-6xl mx-auto py-20 px-6"
    >

      <h2 className="text-3xl font-bold mb-10">Projects</h2>

      <div className="grid md:grid-cols-3 gap-8">

        {/* Project 1 */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden"
        >

          <img
  src="/images/brain-tumor.png"
  alt="Brain Tumor Detection"
  className="w-full h-40 object-cover"
/>

          <div className="p-6">

            <h3 className="text-xl font-semibold mb-2">
              Brain Tumor Detection
            </h3>

            <p className="text-gray-400 mb-4">
              CNN model detecting brain tumors from MRI images.
            </p>

            <div className="flex gap-4">
              <a
                href="https://github.com/this-is-abijith/brain-tumor-detection-ai"
                className="text-blue-400 hover:underline"
              >
                GitHub
              </a>

              
            </div>

          </div>

        </motion.div>


        {/* Project 2 */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden"
        >

          <img
            src="/images/number-plate-detection.png"
            alt="Number Plate Detection"
            className="w-full h-40 object-cover"
          />

          <div className="p-6">

            <h3 className="text-xl font-semibold mb-2">
              Number Plate Detection
            </h3>

            <p className="text-gray-400 mb-4">
              Number Plate Detection system built with YOLO model.
            </p>

            <div className="flex gap-4">
              <a
                href="https://github.com/this-is-abijith/ai-number-plate-detector"
                className="text-blue-400 hover:underline"
              >
                GitHub
              </a>

            </div>

          </div>

        </motion.div>


        {/* Project 3 */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden"
        >

          <img
            src="/images/bitcoin.png"
            alt="Bitcoin Prediction"
            className="w-full h-40 object-cover"
          />

          <div className="p-6">

            <h3 className="text-xl font-semibold mb-2">
              Bitcoin Price Prediction
            </h3>

            <p className="text-gray-400 mb-4">
              Machine learning model predicting cryptocurrency trends.
            </p>

            <div className="flex gap-4">
              <a
                href="https://github.com/this-is-abijith/bitcoin-price-prediction-ai"
                className="text-blue-400 hover:underline"
              >
                GitHub
              </a>

              
            </div>

          </div>

        </motion.div>

      </div>

    </motion.section>


    {/* CONTACT */}
    <motion.section
      id="contact"
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="text-center py-20"
    >

      <h2 className="text-3xl font-bold mb-4">Contact</h2>

      <p className="text-gray-400 mb-2">
        abijithbinu654@gmail.com
      </p>

      <p className="text-gray-500">
        Feel free to reach out for collaborations or opportunities.
      </p>

    </motion.section>


    {/* FOOTER */}
    <footer className="text-center py-10 text-gray-500 border-t border-gray-800">
      © 2026 Abijith Binu • Built with React
    </footer>

  </div>
</>

);
}

export default App;
