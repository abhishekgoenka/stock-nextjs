"use client";
import Link from "next/link";
import React from "react";

import { Icons } from "@/components/icons";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

const components: { title: string; href: string; description: string }[] = [
  {
    title: "Buy Stock",
    href: "/investments/stocks",
    description: "Allows users to initiate and manage stock purchasing activities.",
  },
  {
    title: "Buy Mutual Fund",
    href: "/investments/mutual-fund",
    description: "This feature simplifies the process of purchasing mutual funds",
  },
  {
    title: "Fund Transfer",
    href: "/fund-transfer",
    description: "Enables seamless movement of funds between accounts.",
  },
  {
    title: "Dividend",
    href: "/dividend",
    description: "Records dividends received from investments",
  },
];

export type NavItem = {
  title: string;
  href?: string;
  disabled?: boolean;
  external?: boolean;
};

export function MainNav() {
  return (
    <div className="flex gap-6 md:gap-10">
      <Link href="/" className="flex items-center space-x-2">
        <Icons.activity className="h-6 w-6" />
        <span className="inline-block font-bold">StockSync</span>
      </Link>

      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <Link href="/" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>Dashboard</NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Profile Management</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                <li className="row-span-3">
                  <NavigationMenuLink asChild>
                    <Link
                      href="/"
                      className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                    >
                      <Icons.activity className="h-6 w-6" />
                      <div className="mb-2 mt-4 text-lg font-medium">StockSync</div>
                      <p className="text-sm leading-tight text-muted-foreground">Simplify Your Inventory and Order Management</p>
                    </Link>
                  </NavigationMenuLink>
                </li>
                <ListItem href="/companies" title="Company Information">
                  This menu adds information about the companies
                </ListItem>
                <ListItem href="/mutual-fund" title="Mutual Fund Information">
                  This menu is designed add detailed information about MF.
                </ListItem>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Inventory Management</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                {components.map(component => (
                  <ListItem key={component.title} title={component.title} href={component.href}>
                    {component.description}
                  </ListItem>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/reports" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>Reports</NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/docs" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>Charts</NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/settings" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>Setting</NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}

const ListItem = React.forwardRef<React.ElementRef<"a">, React.ComponentPropsWithoutRef<"a">>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className,
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{children}</p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
