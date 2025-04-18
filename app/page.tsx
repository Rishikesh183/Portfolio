import Hero from '@/components/Hero'
import ProjectCard from '@/components/ProjectCard'

export default function Home() {
  return (
    <>
      <div className='pt-10 -z-10 min-h-screen w-full items-center [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)] pb-12'>
        {/* <Header/> */}
        <Hero />
        
        <div className="px-4 mt-8 md:mt-16">
          <h1 className='text-white text-center text-3xl md:text-4xl lg:text-5xl font-bold'>PROJECTS</h1>
          <h2 className='flex gap-1 font-semibold pt-1 text-lg md:text-xl justify-center'>
            <span className='text-red-400'>Explore</span>
            <span className='text-purple-500'>Now</span>
          </h2>
        </div>
        
        <section id="projects" className="px-4 md:px-6 py-8 grid gap-6 md:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
          <ProjectCard 
            title="SkillForge AI" 
            description="AI-powered LMS platform offering mock interviews, PDF generation, and Interview questions with notes using React, Firebase, Clerk, and Shadcn." 
            link='https://ai-learner-nu.vercel.app/' 
          />
          <ProjectCard 
            title="CricTrack" 
            description="SRH fan app for live scores and news updates built with React, Tailwind, and Clerk for a fast, fan-focused experience." 
            link='https://bleedorangism.vercel.app/' 
          />
          <ProjectCard 
            title="Truth Lens" 
            description="Fake news detection system using Python and ML models like Naive Bayes, Random Forest, and Transformers in real time." 
            link='https://github.com/Rishikesh183' 
          />
        </section>
      </div>
    </>
  )
}