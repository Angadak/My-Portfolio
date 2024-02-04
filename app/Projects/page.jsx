"use client";
import React, { useState } from "react";
import { Tabs, TabsContent, TabsTrigger, TabsList } from "@/components/ui/tabs";
import ProjectCard from "@/components/ProjectCard";

const projectData = [
  {
    Image: "/work/portfolio-1.png",
    category: "Next js",
    name: "My Portfolio",
    tech_stack:"Next Js,Tailwind Css, Shacdb Ui, farmer motion ",
    description:
      "Explore my portfolio website crafted with precision using Next.js for a dynamic and seamless user experience. Styled with the elegance of Tailwind CSS, it embodies modern design principles and responsiveness. Powered by Shacdn UI, the website delivers a visually stunning showcase of my skills and accomplishments, providing a glimpse into the innovative and creative world of web development.",
    link: "/",
    github: "/",
  },
  // {
  //   Image: "/work/4.png",
  //   category: "javaScript",
  //   name: "portfolio",
  //   description:
  //     "Lorem ipsum dolor sit amet consectetur adipisicing elit. Similiquecum necessitatibus ipsam tenetur natus. Totam voluptates beataelaudantium, quaerat quis cumque id delectus ad assumenda necessitatibus ullam ut quod placeat.",
  //   link: "/",
  //   github: "/",
  // },
  // {
  //   Image: "/work/2.png",
  //   category: "Asp.net ",
  //   name: "portfolio",
  //   description:
  //     "Lorem ipsum dolor sit amet consectetur adipisicing elit. Similiquecum necessitatibus ipsam tenetur natus. Totam voluptates beataelaudantium, quaerat quis cumque id delectus ad assumenda necessitatibus ullam ut quod placeat.",
  //   link: "/",
  //   github: "/",
  // },
  // {
  //   Image: "/work/1.png",
  //   category: "Asp.net core",
  //   name: "portfolio",
  //   description:
  //     "Lorem ipsum dolor sit amet consectetur adipisicing elit. Similiquecum necessitatibus ipsam tenetur natus. Totam voluptates beataelaudantium, quaerat quis cumque id delectus ad assumenda necessitatibus ullam ut quod placeat.",
  //   link: "/",
  //   github: "/",
  // },
  // {
  //   Image: "/work/5.png",
  //   category: "C#",
  //   name: "portfolio",
  //   description:
  //     "Lorem ipsum dolor sit amet consectetur adipisicing elit. Similiquecum necessitatibus ipsam tenetur natus. Totam voluptates beataelaudantium, quaerat quis cumque id delectus ad assumenda necessitatibus ullam ut quod placeat.",
  //   link: "/",
  //   github: "/",
  // },
];

//remove category duplicates
const uniqueCategories = [
  "all projects",
  ...new Set(projectData.map((item) => item.category)),
];
const projects = () => {
  const [categories, setCategories] = useState(uniqueCategories);
  const [category, setCategory] = useState("all projects");

  const filteredProjects = projectData.filter((project) => {
    // if category is all category  return all projects else filtre by category
    return category === "all projects"
      ? project
      : project.category === category;
  });
  return (
    <section className="min-h-screen pt-12">
      <div className="container mx-auto">
        <h2 className="section-title mb-8 xl:mb-16 text-center mx-auto">
          My Projects
        </h2>
        {/* tabs  */}
        <Tabs defaultValue={category} className="mb-24 xl:mb-48">
          <TabsList className="w-full grid h-full md:grid-cols-6 lg:max-w-[640px] mv-12 mx-auto md:border dark:border-none">
            {categories.map((category, index) => {
              return (
                <TabsTrigger
                  onClick={() => setCategory(category)}
                  value={category}
                  key={index}
                  className="capitalize w-[162px] md:w-auto"
                >
                  {category}
                </TabsTrigger>
              );
            })}
          </TabsList>
          {/* tabs content  */}
          <div className="mb-4">
            {filteredProjects.map((project,index)=>{
              return(
                <TabsContent value={category} key={index}>
                  <ProjectCard project={project}/>
                </TabsContent>
              );
            })}
          </div>
        </Tabs>
      </div>
    </section>
  );
};

export default projects;