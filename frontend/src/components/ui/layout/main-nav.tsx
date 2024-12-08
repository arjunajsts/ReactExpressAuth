 

import { cn } from "@/lib/utils"
import { Link } from "react-router-dom"


const navLinks = [
  {
   to:"/dashboard",
   label:"Overview"
  },
  {
   to:"/settings",
   label:"Settings"
  },
]

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >

    {navLinks.map(({to,label},index) =>(
      <Link
        key={index}
        to={to}
        className="text-sm font-medium transition-colors hover:text-primary"
      >
        {label}
      </Link>
    ))}
    </nav>
  )
}
