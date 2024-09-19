import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <section className="w-full bg-red-100 h-screen ">
      <div className="container mx-auto flex justify-center flex-col items-center h-full">
        <h1
          className={`font-caveat lg:hidden text-4xl select-none justify-self-start cursor-pointer `}
        >
          <span className="text-red-500">Brush</span>
          <span className={`text-black`}>Stroke</span>
          <span className="text-red-500">.</span>
        </h1>
        <Card className="rounded-xl lg:w-[70%] w-[90%] md:w-[80%]">
          <CardContent className="flex lg:p-9 p-4 ">
            <div className="w-1/2 hidden lg:block">
              <h1
                className={`font-caveat text-4xl select-none justify-self-start cursor-pointer `}
              >
                <span className="text-red-500">Brush</span>
                <span className={`text-black`}>Stroke</span>
                <span className="text-red-500">.</span>
              </h1>
              <Image
                src={"/login-vector.svg"}
                width={350}
                height={350}
                alt="login/signup image"
              />
            </div>
            {children}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
