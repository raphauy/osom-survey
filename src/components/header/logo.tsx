"use client";

import { fontNunito, fontRubik, fontSans  } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";


export default function Logo() {

  return (
    <Link href="/">
      <div className="text-3xl font-bold">
        <span className="text-osom-color">osom</span>
        <span className="text-black">survey</span>
      </div>
    </Link>
  )
}
