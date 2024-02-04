import Socials from "./Socials";

const Footer = () => {
  return (
    <footer className="bg-primary dark:bg-secondary py-10">
      <div className="contanier mx-auto">
        <div className="flex flex-col items-center justify-between">
          {/* socails  */}
          <Socials
            contaiberStyles="flex gap-x-6 mx-auto xl:mx-0 mb-4"
            iconsStyles="text-black dark:text-white/70 text-[20px] hover:text-white dark:hover:text-primary transition-all "
          />
          {/* copy rights  */}
          <div className="text-black dark:text-muted-foreground ">
            Copyright © Angad Kumar. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
