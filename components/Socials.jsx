"use client ";

import {
  //RiYoutubeFill,
  RiLinkedinFill,
  RiGithubFill,
  RiFacebookFill,
  RiInstagramFill
} from "react-icons/ri";

import Link from "next/link";

const icons = [
//   {
//     path: "/",
//     name: <RiYoutubeFill />,
//   },
  {
    path: "https://www.linkedin.com/in/angad-kumar-22173a175?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
    name: <RiLinkedinFill />,
  },
  {
    path: "https://github.com/Angadak",
    name: <RiGithubFill />,
  },
  {
    path: "/",
    name: <RiFacebookFill />,
  },
  {
    path: "https://www.instagram.com/i_am.r_zoro?igsh=bDdsdG1ueTl1NWtl",
    name: <RiInstagramFill />,
  },
];
const Socials = ({ contaiberStyles, iconsStyles }) => {
  return (
    <div className={`${contaiberStyles}`}>
      {icons.map((icon, index) => {
        return (
          <Link href={icon.path} key={index}>
            <div className={`${iconsStyles}`}>{icon.name}</div>
          </Link>
        );
      })}
    </div>
  );
};

export default Socials;
