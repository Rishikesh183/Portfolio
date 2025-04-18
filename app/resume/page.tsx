import React from 'react';
import {  Mail, Phone, Code, Star, Briefcase, BookOpen, GitBranch } from 'lucide-react';
export default function AboutPage() {
  return (
    <div className="min-h-screen text-white [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]">
      <div className="container mx-auto px-4 py-16 max-w-5xl">
        {/* Header Section */}
        <header className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Devarashetty Rishikesh</h1>
          <p className="text-xl text-purple-200 mb-8">Full Stack & AI Enthusiast</p>
          
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <a href="tel:+917013848045" className="flex items-center gap-2 hover:text-purple-300 transition-colors">
              <Phone size={18} />
              <span>+91-7013848045</span>
            </a>
            <a href="mailto:rishikeshdevarashetty@gmail.com" target="_blank" className="flex items-center gap-2 hover:text-purple-300 transition-colors">
              <Mail size={18} />
              <span>rishikeshdevarashetty@gmail.com</span>
            </a>
            <a href="https://linkedin.com/in/rishikesh24" className="flex items-center gap-2 hover:text-purple-300 transition-colors">
              {/* <Linkedin size={18} /> */}
              <span>Linkedin</span>
            </a>
            <a href="https://github.com/Rishikesh183" className="flex items-center gap-2 hover:text-purple-300 transition-colors">
              <GitBranch size={18} />
              <span>Github</span>
            </a>
          </div>
        </header>

        {/* About Section */}
        <section className="mb-16">
          <div className="bg-black bg-opacity-40 rounded-lg p-8 backdrop-blur-sm">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Star className="text-purple-400" />
              About Me
            </h2>
            <p className="text-lg leading-relaxed mb-4">
              I&apos;m a Computer Science graduate from Keshav Memorial Institute of Technology. My passion lies in building intelligent applications that solve real-world problems 
              through the intersection of software development and artificial intelligence.
            </p>
            <p className="text-lg leading-relaxed">
              With expertise in full-stack development, machine learning, and natural language processing, 
              I&apos;ve created projects ranging from fake news detection systems to AI-powered learning platforms 
              and specialized chatbots.
            </p>
          </div>
        </section>

        {/* Skills Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Code className="text-purple-400" />
            Technical Skills
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-black bg-opacity-40 rounded-lg p-6 backdrop-blur-sm">
              <h3 className="text-xl font-semibold mb-4 text-purple-300">Languages</h3>
              <div className="flex flex-wrap gap-2">
                {["Python", "Java", "C", "HTML/CSS", "JavaScript", "SQL"].map((skill) => (
                  <span key={skill} className="px-3 py-1 bg-purple-900 bg-opacity-40 rounded-full text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="bg-black bg-opacity-40 rounded-lg p-6 backdrop-blur-sm">
              <h3 className="text-xl font-semibold mb-4 text-purple-300">Frameworks</h3>
              <div className="flex flex-wrap gap-2">
                {["React", "Node.js", "Express", "Next.js", "Tailwind"].map((skill) => (
                  <span key={skill} className="px-3 py-1 bg-purple-900 bg-opacity-40 rounded-full text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="bg-black bg-opacity-40 rounded-lg p-6 backdrop-blur-sm">
              <h3 className="text-xl font-semibold mb-4 text-purple-300">AI & ML</h3>
              <div className="flex flex-wrap gap-2">
                {["Machine Learning", "Deep Learning", "NLP", "Transformers", "Generative AI"].map((skill) => (
                  <span key={skill} className="px-3 py-1 bg-purple-900 bg-opacity-40 rounded-full text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="bg-black bg-opacity-40 rounded-lg p-6 backdrop-blur-sm">
              <h3 className="text-xl font-semibold mb-4 text-purple-300">Tools & Databases</h3>
              <div className="flex flex-wrap gap-2">
                {["Git", "GitHub", "VS Code", "MongoDB", "FAISS", "Google Cloud"].map((skill) => (
                  <span key={skill} className="px-3 py-1 bg-purple-900 bg-opacity-40 rounded-full text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Briefcase className="text-purple-400" />
            Featured Projects
          </h2>
          
          <div className="grid grid-cols-1 gap-6">
            <div className="bg-black bg-opacity-40 rounded-lg p-6 backdrop-blur-sm">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-purple-300">TruthLens</h3>
                <span className="text-sm text-purple-200">August 2024</span>
              </div>
              <p className="mb-4 text-gray-300 italic">Naive Bayes, Random Forest, Transformers</p>
              <p className="mb-4">
                A fake news detection platform achieving 91% accuracy through machine learning models. 
                Features real-time data processing, web scraping, and has reduced misinformation spread by 10%.
              </p>
              <div className="flex flex-wrap gap-2">
                {["Python", "ML", "Transformers", "Beautiful Soup"].map((tech) => (
                  <span key={tech} className="px-2 py-1 bg-purple-900 bg-opacity-30 rounded text-xs">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="bg-black bg-opacity-40 rounded-lg p-6 backdrop-blur-sm">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-purple-300">CricLaws</h3>
                <span className="text-sm text-purple-200">February 2024</span>
              </div>
              <p className="mb-4 text-gray-300 italic">LangChain, HuggingFace, Mistral, FAISS, Streamlit</p>
              <p className="mb-4">
                A fine-tuned LLM chatbot trained on cricket laws, utilizing FAISS for vector storage and 
                HuggingFace&apos;s Mistral model for natural language understanding with an intuitive Streamlit interface.
              </p>
              <div className="flex flex-wrap gap-2">
                {["Python", "Streamlit", "FAISS", "LangChain", "NLP"].map((tech) => (
                  <span key={tech} className="px-2 py-1 bg-purple-900 bg-opacity-30 rounded text-xs">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="bg-black bg-opacity-40 rounded-lg p-6 backdrop-blur-sm">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-purple-300">SkillForge AI</h3>
                <span className="text-sm text-purple-200">October 2023</span>
              </div>
              <p className="mb-4 text-gray-300 italic">React+vite, Tailwind, Firebase, Clerk,Gemini AI</p>
              <p className="mb-4">
                An AI-powered learning platform with an interactive interview simulation module leveraging Gemini AI
                and a smart question-sourcing system that enhances preparation efficiency.
              </p>
              <div className="flex flex-wrap gap-2">
                {["React", "Tailwind", "Firebase", "Clerk", "Gemini AI"].map((tech) => (
                  <span key={tech} className="px-2 py-1 bg-purple-900 bg-opacity-30 rounded text-xs">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Education & Certifications */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <BookOpen className="text-purple-400" />
            Education & Certifications
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-black bg-opacity-40 rounded-lg p-6 backdrop-blur-sm">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-semibold text-purple-300">Education</h3>
              </div>
              <p className="font-medium">Keshav Memorial Institute of Technology</p>
              <p className="mb-2">B.Tech in Computer Science (CGPA: 7.5)</p>
              <p className="text-purple-200">2021 - 2025</p>
              <p className="text-sm text-gray-300 mt-2">Hyderabad, Telangana</p>
            </div>
            
            <div className="bg-black bg-opacity-40 rounded-lg p-6 backdrop-blur-sm">
              <h3 className="text-xl font-semibold mb-4 text-purple-300">Certifications</h3>
              <ul className="space-y-4">
                <li>
                  <p className="font-medium">Supervised Machine Learning</p>
                  <p className="text-sm text-gray-300">Coursera</p>
                </li>
                <li>
                  <p className="font-medium">Advanced Machine Learning Algorithms</p>
                  <p className="text-sm text-gray-300">Coursera</p>
                </li>
                <li>
                  <p className="font-medium">Full Stack Web Development</p>
                  <p className="text-sm text-gray-300">GeeksForGeeks</p>
                </li>
              </ul>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}