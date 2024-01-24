"use client"

import { cn } from "@/lib/utils";
import { Briefcase, ChevronRightSquare, LayoutDashboard, List, ListOrdered, MessageCircle, Settings, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const data= [
  {
    href: "/admin",
    icon: LayoutDashboard,
    text: "Dashboard"
  },
  {
    href: "divider", icon: User
  },
  {
    href: "/admin/users",
    icon: User,
    text: "Users"
  },
  {
    href: "divider", icon: User
  },  
  // {
  //   href: "/admin/clients",
  //   icon: Briefcase,
  //   text: "Clients"
  // },
  {
    href: "/admin/prompts",
    icon: ChevronRightSquare,
    text: "Prompts"
  },
  {
    href: "/admin/topics",
    icon: List,
    text: "Temas(Problemas)"
  },
  {
    href: "/admin/topicresponses",
    icon: ListOrdered,
    text: "Respuestas"
  },
  {
    href: "divider", icon: User
  },  
  {
    href: "/admin/chat",
    icon: MessageCircle,
    text: "Simulador"
  },
]


export default function SideBar() {

  const path= usePathname()

  const commonClasses= "flex gap-2 items-center py-1 mx-2 rounded hover:bg-gray-200 dark:hover:text-black"
  const selectedClasses= "font-bold text-osom-color dark:border-r-white"

  const isChatPage= path.startsWith("/admin/chat")

  return (
    <div className={cn("flex flex-col justify-between border-r border-r-osom-color/50", !isChatPage && "lg:pl-8")}>
      <section className="flex flex-col gap-3 py-4 mt-3 ">
        {data.map(({ href, icon: Icon, text }, index) => {
          if (href === "divider") return divider(index)
          
          const selected= path.endsWith(href)
          const classes= cn(commonClasses, selected && selectedClasses)
          return (
            <Link href={href} key={href} className={classes}>
              <Icon size={23} />
              <p className={cn("hidden", !isChatPage && "md:block md:w-36")}>{text}</p>                  
            </Link>
          )
        })}

        {divider()}



      </section>
      <section className="mb-4">
        {divider()}
        
        <Link href="/admin/config" className="flex items-center gap-2 py-1 mx-2 rounded hover:bg-gray-200 dark:hover:text-black">
          <Settings />
          <p className={cn("hidden", !isChatPage && "md:block md:w-36")}>Config. Cliente</p>                  
        </Link>
        <Link href="/admin/configs" className="flex items-center gap-2 py-1 mx-2 rounded hover:bg-gray-200 dark:hover:text-black">
          <Settings />
          <p className={cn("hidden", !isChatPage && "md:block md:w-36")}>Config. Global</p>                  
        </Link>
      </section>
    </div>
  );
}


function divider(key?: number) {
  return <div key={key} className="mx-2 my-5 border-b border-b-osom-color/50" />
}
