import React from "react";
import { GanttChartSquare, Blocks, Gem } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const ServicesData = [
  {
    icon: <GanttChartSquare size={72} strokeWidth={0.8} />,
    title: "Web Development",
    description:"I specialize in web development, creating visually appealing and functional websites tailored to your needs. Let's collaborate to elevate your digital presence!",
  },
  {
    icon: <Blocks size={72} strokeWidth={0.8} />,
    title: "Back-end Development",
    description:
    "I specialize in backend development using ASP.NET Core to build robust and scalable web applications. Proficient in SQL Server and MySQL, I excel in optimizing databases and crafting efficient server-side solutions for seamless data processing and retrieval.",
  },
  {
    icon: <Gem size={72} strokeWidth={0.8} />,
    title: "Front-end Development",
    description:
    "I create dynamic and responsive user interfaces using Next.js and React. Leveraging cutting-edge technologies, I deliver high-performance web experiences. My holistic approach ensures comprehensive solutions for modern web applications.",
  },
];
const Services = () => {
  return (
    <section className="mb-12 xl:mb-36">
      <div className="container mx-auto">
        <h2 className="section-title mb-12 xl:mb-24 text-center mx-auto">
          My Services
        </h2>
        {/* grid itmes  */}
        <div className="grid xl:grid-cols-3 justify-center gap-y-12 xl:gap-y-12 xl:gap-x-8">
          {ServicesData.map((item, index) => {
            return (
              <Card
                className="w-full max-w-[424px] h-[300px] flex flex-col pt-16 pb-10 justify-center items-center relative"
                key={index}
              >
                <CardHeader className="text-primary absolute -top-[60px]">
                  <div className="w-[140px] h-[80px] bg-white dark:bg-background flex justify-center items-center ">
                    {item.icon}
                  </div>
                </CardHeader>
                <CardContent className="text-center">
                  <CardTitle className="mb-4 my-4">{item.title}</CardTitle>
                  <CardDescription className=" text-lg mb-4">
                    {item.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;
