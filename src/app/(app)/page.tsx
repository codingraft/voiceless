"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Link from "next/link";
import messages from "../../messages.json";
import { useSession } from "next-auth/react";
// import Image from "next/image";

export default function Home() {
  const session = useSession();
  const user = session.data?.user;
  return (
    <>
      {/* // Banner */}
      <div className="flex min-h-screen items-center justify-center p-6 lg:p-24 sm:p-20 bg-[image:radial-gradient(80%_50%_at_50%_-20%,hsl(206,81.9%,65.3%,0.5),rgba(255,255,255,0))]">
        <div className="z-10 w-full max-w-5xl flex flex-col items-center justify-between font-mono text-sm lg:flex text-center">
          <h1 className="line-clamp-4 text-2xl sm:text-3xl lg:text-5xl font-bold mb-5">
            Speak Freely, Be Heard Anonymously – Powered by AI
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl mb-6">
            Voiceless empowers you to share your thoughts and feedback
            anonymously. No judgments, no fear—just your voice making an impact.
            Let your ideas spark change! Powered by AI for smarter feedback and
            deeper insights.
          </p>
          <Button>
            {user ? (
              <Link href="/dashboard"> Dashboard </Link>
            ) : (
              <Link href="/sign-in"> Get Started </Link>
            )}
          </Button>
        </div>
      </div>

      {/* // carousal */}

      <div className="flex items-center justify-center px-4 sm:px-8 md:px-16 lg:px-32 pb-20">
        <Carousel className="w-full">
          <CarouselContent>
            {messages.map((data, index) => (
              <CarouselItem key={index} className="basis-full sm:basis-1/2 md:basis-1/3">
                <div className="p-1">
                  <Card>
                    <CardContent className="flex aspect-square flex-col items-center justify-center p-6">
                      <h2 className="text-xl sm:text-2xl"> {data.title}</h2>
                      <p className="text-base sm:text-lg">{data.content}</p>
                      <p className="text-base sm:text-lg">{data.received}</p>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className=""/>
          <CarouselNext className=""/>
        </Carousel>
      </div>

      {/* Footer */}
      <footer className="text-center p-4 md:p-6 border-t border-gray-800">
        © 2025 Voiceless. All rights reserved.
      </footer>
    </>
  );
}
