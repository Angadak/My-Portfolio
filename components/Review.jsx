"use client";
import Image from "next/image";

import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";
//import swiper react components
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
//import swiper styles
import "swiper/css";
import "swiper/css/pagination";

//import require modules
import { Pagination, pagi } from "swiper/modules";

const reviewData = [
  {
    avatar: "/reviews/avatar-1.png",
    name: "Angad kumar",
    desigation: "Game Dev",
    review: "Very impressive website u have build mate ",
  },
  {
    avatar: "/reviews/avatar-1.png",
    name: "Angad kumar",
    desigation: "Game Dev",
    review: "Very impressive website u have build mate ",
  },
  {
    avatar: "/reviews/avatar-1.png",
    name: "Angad kumar",
    desigation: "Game Dev",
    review: "Very impressive website u have build mate ",
  },
  {
    avatar: "/reviews/avatar-1.png",
    name: "Angad kumar",
    desigation: "Game Dev",
    review: "Very impressive website u have build mate ",
  },
  {
    avatar: "/reviews/avatar-1.png",
    name: "Angad kumar",
    desigation: "Game Dev",
    review: "Very impressive website u have build mate ",
  },
  {
    avatar: "/reviews/avatar-1.png",
    name: "Angad kumar",
    desigation: "Game Dev",
    review: "Very impressive website u have build mate ",
  },
];

const Review = () => {
  return (
    <section className="mb-12 xl:mb-32">
      <div className="container mx-auto">
        <h2 className="section-title mb-12 text-center mx-auto ">Reviews</h2>
        {/* slider  */}
        <Swiper
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 2 },
            1400: { slidesPerView: 3 },
          }}
          spaceBetween={30}
          modules={[Pagination]}
          pagination={{ clickable: true }}
          className="h-[350px]"
        >
          {reviewData.map((person, index) => {
            return (
              <SwiperSlide key={index}>
                <Card className="bg-tertiary dark:bg-secondary/40 p-8 min-h-[300px]">
                  <CardHeader className="p-0 mb-10">
                    <div className="flex items-center gap-x-4">
                      <Image
                        src={person.avatar}
                        width={70}
                        height={70}
                        alt=""
                        priority
                      />
                      {/* name  */}
                      <div className="flex flex-col">
                        <CardTitle>{person.name}</CardTitle>
                        <p>{person.desigation}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardDescription>{person.review}</CardDescription>
                </Card>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </section>
  );
};

export default Review;
