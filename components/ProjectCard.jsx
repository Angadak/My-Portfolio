import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardHeader } from "./ui/card";
import { Github, Link2Icon } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import projects from "@/app/Projects/page";

const ProjectCard = ({ project }) => {
  console.log(project);
  return (
    <Card className='group overflow-hidden relative h-[550px]'> 
      <CardHeader className="p-0">
        {/* image  */}
        <div className="relative w-full h-[250px] flex items-center justify-center bg-tertiary dark:bg-secondary/40 xl:bg-work_projrct_bg_light xl:dark:bg-work_projrct_bg_dark xl:bg-[110%] xl:bg-no-repeat overflow-hidden">
          <Image
            className="absolute bottom-0 shadow-2xl"
            src={project.Image}
            width={400}
            height={500}
            alt=""
            priority
          />
          {/* btn links  */}
          <div className="flex gap-x-4">
            <Link href={project.link} className='bg-secondary h-[54px] w-[54px] rounded-full flex justify-center items-center scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100 duration-200'><Link2Icon/></Link>
            <Link href={project.github} className='bg-secondary h-[54px] w-[54px] rounded-full flex justify-center items-center scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100 duration-200'><Github/></Link>
          </div>
        </div>
      </CardHeader>
      <div className="h-full px-8 py-6">
        <Badge className="uppercae text-sm font-medium mb-2 absolute top-4 left-5">{project.category}</Badge>

        <Button className="mb-4  bg-blue-600 hover:bg-blue-100 text-black h-[35px]">{project.name}</Button>
        <h4 className="h5 mb-4">{project.tech_stack}</h4>
        <p className="text-muted-foreground text-lg">{project.description}</p>
      </div>
    </Card>
  );
};

export default ProjectCard;
