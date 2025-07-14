import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu"
import { assets } from "../assets/assets";

const MenuBar = () => {
    return (
        // <NavigationMenu>
        //     <NavigationMenuList>
        //         <NavigationMenuItem>
        //             <NavigationMenuTrigger>Item One</NavigationMenuTrigger>
        //             <NavigationMenuContent>
        //                 <NavigationMenuLink>Link</NavigationMenuLink>
        //             </NavigationMenuContent>
        //         </NavigationMenuItem>
        //     </NavigationMenuList>
        // </NavigationMenu>
        <nav className="bg-white px-5 py-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
                <img src={assets.logo} alt="header" width={120} className="mb-4" />

                <h5>
                    Hey someone <span role="img" aria-label="wave"></span>
                </h5>
                <h1 className="font-bold mb-3">Welcome back</h1>
                <p className="text-muted"></p>
            </div>
        </nav>
    )
}

export default MenuBar;