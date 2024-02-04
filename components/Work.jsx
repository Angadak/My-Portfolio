"use client";

import Link from "next/link";
import { Button } from "./ui/button";
//import swiper react components
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
//import swiper styles
import "swiper/css";
import "swiper/css/pagination";

//import require modules
import { Pagination, pagi } from "swiper/modules";

//components
import ProjectCard from "@/components/ProjectCard";

const projectData = [
  {
    Image: "/work/portfolio.png",
    category: "Next js",
    name: "My Portfolio",
    tech_stack:"Next Js, Tailwind Css, Shacdb Ui, farmer motion ",
    description:
      "Explore my sleek Next.js portfolio, styled with Tailwind CSS and powered by Shacdn UI. It highlights my skills, achievements, and the exciting realm of web development",
    link: "https://my-portfolio-nine-khaki-46.vercel.app/",
    github: "https://github.com/Angadak/My-Portfolio",
  },
  {
    Image: "/work/tris-dashboard.png",
    category: "Asp.Net Core",
    name: "TRIS Dashboard",
    tech_stack:"ASP.NET CORE, ASP.NET CORE MVC, JQuery, Bootstrap",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Similiquecum necessitatibus ipsam tenetur natus. Totam voluptates beataelaudantium, quaerat quis cumque id.",
    link: "https://www.dhillonfarm.com/",
    github: "/",
  },
//   {
//     Image: "/work/2.png",
//     category: "Asp.net ",
//     name: "portfolio",
//     description:
//       "Lorem ipsum dolor sit amet consectetur adipisicing elit. Similiquecum necessitatibus ipsam tenetur natus. Totam voluptates beataelaudantium, quaerat quis cumque id delectus ad assumenda necessitatibus ullam ut quod placeat.",
//     link: "/",
//     github: "/",
//   },
//   {
//     Image: "/work/1.png",
//     category: "Asp.net core",
//     name: "portfolio",
//     description:
//       "Lorem ipsum dolor sit amet consectetur adipisicing elit. Similiquecum necessitatibus ipsam tenetur natus. Totam voluptates beataelaudantium, quaerat quis cumque id delectus ad assumenda necessitatibus ullam ut quod placeat.",
//     link: "/",
//     github: "/",
//   },
//   {
//     Image: "/work/5.png",
//     category: "C#",
//     name: "portfolio",
//     description:
//       "Lorem ipsum dolor sit amet consectetur adipisicing elit. Similiquecum necessitatibus ipsam tenetur natus. Totam voluptates beataelaudantium, quaerat quis cumque id delectus ad assumenda necessitatibus ullam ut quod placeat.",
//     link: "/",
//     github: "/",
//   },
];
const Work = () => {
  return (
    <section className="relative mb-12 xl:mb-48">
      <div className="container mx-auto flex flex-col xl:flex-row">
        {/* text */}
        <div className="max-w-[400px] mx-auto xl:mx-0 text-center xl:text-left mb-12 xl:h-[400px] flex flex-col justify-center items-center xl:items-start">
          <h2 className="section-title mb-4">Latest Projects</h2>
          <p className="subtitle mb-8">
            Discover innovation in our latest projects—captivating web
            applications, seamless user experiences. Each reflects our
            commitment to creativity, pushing boundaries for vibrant digital
            experiences.
          </p>
          <Link href="/Projects">
            <Button>All Projects</Button>
          </Link>
        </div>

        {/* slider */}
        <div className="xl:max-w-[1000px] xl:relative xl:flex-grow">
          <Swiper
            className="h-[600px]"
            slidesPerView={1}
            breakpoints={{
              640: {
                slidesPerView: 2,
              },
            }}
            spaceBetween={30}
            modules={[Pagination]}
            pagination={{ clickable: true }}
          >
            {/* show only the first 4 projects in slider */}
            {projectData.slice(0, 5).map((projects, index) => (
              <SwiperSlide key={index}>
                <ProjectCard project={projects} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default Work;
