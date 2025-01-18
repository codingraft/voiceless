"use client";

import { Button } from "@/components/ui/button";
import { User } from "next-auth";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

const Navbar = () => {
  const { data: session } = useSession();
  const user: User = session?.user as User;

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") === "dark";
    }
    return false;
  });

  useEffect(() => {
    const html = document.documentElement;

    if (darkMode) {
      setDarkMode(true);
      html.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      setDarkMode(false);
      html.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <div className="container mx-auto px-5 py-3 sm:px-10 md:px-20 absolute top-0 left-0 right-0">
      <div className="flex justify-between items-center flex-wrap">
        <a href="#" className="font-bold text-2xl sm:text-3xl md:text-4xl">
          Voiceless
        </a>
        {session ? (
          <div className="flex gap-2 sm:gap-4 items-center mt-2 sm:mt-0">
            <p className="text-sm sm:text-md">
              Welcome <strong>{user?.username || user?.email}</strong>
            </p>
            <Button onClick={() => signOut()}>Logout</Button>
            <button onClick={() => setDarkMode(!darkMode)}>
              {darkMode ? <Sun /> : <Moon />}
            </button>
          </div>
        ) : (
          <div className="flex gap-2 sm:gap-4 items-center mt-2 sm:mt-0">
            <Link href="/sign-in">
              <Button>Login</Button>
            </Link>
            <button onClick={() => setDarkMode(!darkMode)}>
              {darkMode ? <Sun /> : <Moon />}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
