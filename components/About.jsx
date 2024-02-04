import DevImg from "./DevImg";
import Image from "next/image";
import { Tabs, TabsContent, TabsTrigger, TabsList } from "@/components/ui/tabs";
import {
  User2,
  MailIcon,
  HomeIcon,
  PhoneCall,
  GraduationCap,
  Calendar,
  Briefcase,
} from "lucide-react";

const infoData = [
  {
    icon: <User2 size={20} />,
    text: "Angad Kumar",
  },
  {
    icon: <PhoneCall size={20} />,
    text: "+91-9643574079",
  },
  {
    icon: <MailIcon size={20} />,
    text: "Angad.ak70@gmail.com",
  },
  {
    icon: <Calendar size={20} />,
    text: "16-07-1999",
  },
  {
    icon: <GraduationCap size={20} />,
    text: "BCA",
  },
  {
    icon: <HomeIcon size={20} />,
    text: "New Delhi, Bharat",
  },
];

const qualificationData = [
  {
    title: "education",
    data: [
      {
        university: "sarvodaya bal vidyalaya",
        qualification: "12th in Commerce with Maths",
        year: "2018",
      },
      {
        university: "Guru Gobind Singh Indraprastha University",
        qualification: "Bachelor of Computer Application",
        year: "2018 - 2021",
      },
      // {
      //   university: "IGNOU",
      //   qualification: "Masters of Computer Application",
      //   year: "Present",
      // },
    ],
  },
  {
    title: "experince",
    data: [
      {
        company: "MRM//Maccan",
        desigination: "Jr. Software Developer",
        year: "2022 - 2023",
      },
      {
        company: "Cyber Matrix Solution Pvt Ltd",
        desigination: "Softawre Developer",
        year: "Present",
      },
    ],
  },
];

const skillData = [
  {
    title: "skills",
    data: [
      {
        name: "HTML, CSS, Tailwind CSS",
      },
      {
        name: "JavaScript, JQuery",
      },
      {
        name: " C#",
      },
      {
        name: "ASP.NET Core",
      },
      {
        name: " ASP.NET Core MVC",
      },
      {
        name: "Next Js",
      },
      {
        name: "Node Js",
      },

      {
        name: " ASP.NET Core Web API's",
      },
    ],
  },
  {
    title: "tools",
    data: [
      {
        imgPath: "/about/vscode.svg",
      },
      
      {
        imgPath: "/about/visual-studio.png",
      },
      {
        imgPath: "/about/sql-server.png",
      },
      {
        imgPath: "/about/mysql.png",
      },
      {
        imgPath: "/about/postman-icon.png",
      },
      {
        imgPath: "/about/stackoverflow.png",
      },

    ],
  },
];

const About = () => {
  const getData = (arr, title) => {
    return arr.find((item) => item.title === title);
  };

  return (
    <section className="xl:h-[860px] pb-12 xl:py-24">
      <div className="container mx-auto">
        <h2 className="section-title mb-8 xl:mb-16 text-center mx-auto">
          About me
        </h2>
        <div className="flex flex-col xl:flex-row">
          {/* image */}
          <div className="hidden xl:flex flex-1 relative">
            <DevImg
              containerStyles="bg-about_shape_light dark:bg-about_shape_dark w-[350px] h-[350px] bg-no-repeat relative"
              imgSrc="/hero/ds.png"
            />
          </div>

          {/* tabs */}
          <div className="flex-1">
            <Tabs defaultValue="personal">
              <TabsList className="w-full grid xl:grid-cols-3 xl:max-w-[520px] xl:border dark:border-none">
                <TabsTrigger className="w-[162px] xl:w-auto" value="personal">
                  Personal Info
                </TabsTrigger>
                <TabsTrigger
                  className="w-[162px] xl:w-auto"
                  value="qualification"
                >
                  Qualification
                </TabsTrigger>
                <TabsTrigger className="w-[162px] xl:w-auto" value="skills">
                  Skills
                </TabsTrigger>
              </TabsList>
              {/* tab content */}
              <div className="text-lg mt-12 xl:mt-8">
                {/* personal */}
                <TabsContent value="personal">
                  <div className="text-center xl:text-left">
                    <h3 className="h3 mb-4">
                      Unmatched Service Quality and Best deigns
                    </h3>
                    <p className="subtitle max-w-xl max-auto xl:mx-0">
                      I sepecialize in crafting intuitive website with
                      cutting-edge tech stack, delivering dynamic and aggaging
                      user experince
                    </p>
                    {/* icons */}
                    <div className="grid xl:grid-cols-2 gap-4 mb-12 ">
                      {infoData.map((item, index) => {
                        return (
                          <div
                            className="flex items-center gap-x-4 mx-auto xl:mx-0"
                            key={index}
                          >
                            <div className="text-primary">{item.icon}</div>
                            <div>{item.text}</div>
                          </div>
                        );
                      })}
                    </div>
                    {/* language */}
                    <div className="flex flex-col gap-y-2">
                      <div className="text-primary">Language Skill</div>
                      <div className="border-b border-border"></div>
                      <div>English, Hindi</div>
                    </div>
                  </div>
                </TabsContent>

                {/* Qualification */}
                <TabsContent value="qualification">
                  <div className="text-center xl:text-left">
                    <h3 className="h3 mb-4 text-center xl:text-left">
                      My Awesome Journey
                    </h3>

                    <div className="grid md:grid-cols-2 gap-x-8">
                      {/* experience */}
                      <div className="flex flex-col gap-y-6">
                        <div className="flex gap-x-4 items-center text-[22px] text-primary">
                          <Briefcase />
                          <h4 className="capitilize font-medium">
                            {getData(qualificationData, "experince").title}
                          </h4>
                        </div>
                        {/* list */}
                        <div className="flex flex-col gap-y-8">
                          {getData(qualificationData, "experince").data.map(
                            (item, index) => {
                              const { company, desigination, year } = item;
                              return (
                                <div className="flex gap-x-8 group" key={index}>
                                  <div className="h-[84px] w-[1px] bg-border relative ml-2">
                                    <div className="w-[11px] h-[11px] rounded-full bg-primary absolute -left-[5px] group-hover:translate-y-[84px] transition-all duration-500"></div>
                                  </div>
                                  <div>
                                    <div className="font-semibold text-xl leading-none mb-2">
                                      {company}
                                    </div>
                                    <div className="text-lg leading-none text-muted-foreground mb-4">
                                      {desigination}
                                    </div>
                                    <div className="text-base font-medium">
                                      {year}
                                    </div>
                                  </div>
                                </div>
                              );
                            }
                          )}
                        </div>
                      </div>
                      {/* edication */}
                      <div className="flex flex-col gap-y-6">
                        <div className="flex gap-x-4 items-center text-[22px] text-primary">
                          <GraduationCap />
                          <h4 className="capitilize font-medium">
                            {getData(qualificationData, "education").title}
                          </h4>
                        </div>
                        {/* list */}
                        <div className="flex flex-col gap-y-8">
                          {getData(qualificationData, "education").data.map(
                            (item, index) => {
                              const { university, qualification, year } = item;
                              return (
                                <div className="flex gap-x-8 group" key={index}>
                                  <div className="h-[84px] w-[1px] bg-border relative ml-2">
                                    <div className="w-[11px] h-[11px] rounded-full bg-primary absolute -left-[5px] group-hover:translate-y-[84px] transition-all duration-500"></div>
                                  </div>
                                  <div>
                                    <div className="font-semibold text-xl leading-none mb-2">
                                      {university}
                                    </div>
                                    <div className="text-lg leading-none text-muted-foreground mb-4">
                                      {qualification}
                                    </div>
                                    <div className="text-base font-medium">
                                      {year}
                                    </div>
                                  </div>
                                </div>
                              );
                            }
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Skills */}
                <TabsContent value="skills">
                  <div className="text-center xl:text-left">
                    <h3 className="h3 mb-8">What I Use Everyday</h3>
                    <div className="mb-16">
                      <h4 className="text-xl font-semibold mb-2">Skills</h4>
                      <div className="border-b border-border mb-4"></div>
                      {/* skills list  */}
                      <div>
                        {getData(skillData, "skills").data.map(
                          (item, index) => {
                            const { name } = item;
                            return (
                              <div
                                className="w-2/4 text-center xl:text-left mx-auto xl:mx-0"
                                key={index}
                              >
                                <div className="font-medium">{name}</div>
                              </div>
                            );
                          }
                        )}
                      </div>
                    </div>
                    {/* tools  */}
                    <div>
                      <h4 className="text-xl font-semibold mb-2 xl:text-left">
                        Tools
                      </h4>
                      <div className="border-b border-border mb-4"></div>
                      {/* tools List  */}
                      <div className="flex gap-x-8 justify-center xl:justify-start"> 
                        {getData(skillData,'tools').data.map((item,index)=>{
                          const {imgPath}=item;
                          return(
                            <div key={index}>
                              <Image src={imgPath} width={48} height={48} alt="" priority/>
                            </div>
                          );

                        })}
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
