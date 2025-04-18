/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from 'react';
import ProjectCard from '@/components/ProjectCard';
import Image from 'next/image';


type Project = {
  title: string;
  description: string;
  id: number;
  link:string;
};

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await fetch("https://portfolio-8e35d-default-rtdb.firebaseio.com/projects.json");
        if (!response.ok) throw new Error("Network response was not ok");

        const data = await response.json();

        const transformedData: Project[] = data.map((project: any, index: number) => ({
          ...project,
          id: index
        }));

        setProjects(transformedData);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    }

    fetchProjects();
  }, []);

  return (
    <div className='pt -3 min-h-screen [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]'>

    <div>
      <h1 className='text-white text-center text-5xl font-bold'>PROJECTS</h1>
      <h2 className='flex gap-1 font-semibold pt-1 text-xl justify-center '><span className='text-red-400'>Explore</span><span className='text-purple-500'>Now</span></h2>
      <div className='rounded-full flex justify-center p-8'><Image src="/Dev.png" alt='dev' width={132} height={132} /></div>
    </div>

      <section
        id="projects"
        className="px-6 py-8 grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
      >
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            title={project.title}
            description={project.description}
            link={project.link}
          />
        ))}
      </section>
    </div>
  );
};

export default Projects;
