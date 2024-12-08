import { MainNav } from "./main-nav"
import { Search } from "./search"
import RoleSwitcher from "./role-switcher"
import { UserNav } from "./userNav"

export const Header = () => {
  return (
    <div className="flex-col md:flex">
      <div className="border-b">
        <div className="flex h-16 items-center px-4">
          <RoleSwitcher className="hidden md:flex"/>
          <MainNav className="mx-6" />
          <div className="ml-auto flex items-center space-x-4">
            <Search className="hidden md:flex"/>
            <UserNav />
          </div>
        </div>
      </div>
    </div>
  )
}
