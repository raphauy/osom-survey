"use client"

import { getTopicsDAOAction } from "@/app/admin/topics/topic-actions";
import { cn } from "@/lib/utils";
import { TopicDAO } from "@/services/topic-services";
import { BarChartHorizontalBig, LayoutDashboard, MessageCircle, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface Props {
  slug: string
}
export default function SideBar({ slug }: Props) {
  const [topics, setTopics] = useState<TopicDAO[]>([])

  useEffect(() => {
    getTopicsDAOAction()
    .then((res) => {
      if(!res) return
      setTopics(res)
    })
  }, [])
  

  const data= [
    {
      href: `/client/${slug}`,
      icon: LayoutDashboard,
      text: "Dashboard"
    },
    {
      href: "divider", icon: User
    },
    {
      href: `/client/${slug}/chats`,
      icon: MessageCircle,
      text: "Conversaciones"
    },
    {
      href: "divider", icon: User
    },  
    {
      href: `/client/${slug}/users`,
      icon: User,
      text: "Usuarios"
    },
  ]

  const path= usePathname()

  const commonClasses= "flex gap-2 items-center py-1 mx-2 rounded hover:bg-gray-200 dark:hover:text-black"
  const selectedClasses= "font-bold text-osom-color dark:border-r-white"

  const isChatPage= path.startsWith(`/client/${slug}/chats`)

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

        <Link href={`/client/${slug}/results`} className={cn(commonClasses, path.endsWith("results") && selectedClasses)}>
          <BarChartHorizontalBig size={23} />
          <p className={cn("hidden", !isChatPage && "md:block md:w-36")}>Resultados</p>
        </Link>

        {
          topics.map((topic) => (
            <Link href={`/client/${slug}/results/${topic.id}`} key={topic.id} className={cn(commonClasses, path.endsWith(topic.id) && selectedClasses)}>              
              <p className={cn("hidden", !isChatPage && "md:block md:w-36 ml-8")}>{topic.name}</p>
            </Link>
          ))
        }

        {divider()}


      </section>
    </div>
  );
}


function divider(key?: number) {
  return <div key={key} className="mx-2 my-5 border-b border-b-osom-color/50" />
}
