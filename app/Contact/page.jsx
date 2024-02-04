import { MailIcon, HomeIcon, PhoneCall } from "lucide-react";
import Form from "@/components/Form";

const contact = () => {
  return (
    <section>
      <div className="container mx-auto">
        {/* text & illusration  */}
        <div className="grid xl:grid-cols-2 pt-12 xl:h-[480px] mb-6 xl:mb-24">
          {/* text  */}
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-x-4 text-primary text-lg mb-4">
              <span className="w-[30px] h-[2px] bg-primary"></span>
              <div>Send me Hello 👋 </div>
            </div>
            <h1 className="h1 max-w-md mb-8 ">Let's Work Together.</h1>
            <p className="subtitle mx-w-[400px]">
              Embark on a collaborative journey with us! Whether you have
              inquiries or seek additional information about our services, don't
              hesitate to reach out. I am dedicated to providing
              comprehensive assistance, and we're here to ensure your experience
              is seamless and tailored to your specific needs. Feel free to
              connect with us, and let's explore the possibilities together.
            </p>
          </div>
          {/* illustration  */}
          <div className="hidden xl:flex w-full bg-contact_illustration_light dark:bg-contact_illustration_dark bg-contain bp-top bg-no-repeat"></div>
        </div>
        {/* info text & form  */}
        <div className="grid xl:grid-cols-2 mb-24 xl:mb-32">
          {/* info text  */}
          <div className="flex flex-col gap-y-4 xl:gap-y-14 mb-12 xl:mb-24 text-base xl:lg:text-lg">
            {/* mail  */}
            <div className="flex itmes-center gap-x-8 ">
              <MailIcon size={18} className="text-primary" />
              <div>Angad.ak70@gmail.com</div>
            </div>
            {/* address  */}
            <div className="flex itmes-center gap-x-8 ">
              <HomeIcon size={18} className="text-primary" />
              <div>New Delhi, Bharat</div>
            </div>
            {/* phone  */}
            <div className="flex itmes-center gap-x-8 ">
              <PhoneCall size={18} className="text-primary" />
              <div>+91-9643574079</div>
            </div>
          </div>
          <Form />
        </div>
      </div>
    </section>
  );
};

export default contact;
