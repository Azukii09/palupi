import { HiHome} from "react-icons/hi2";
import {TbDatabaseStar, TbPointFilled} from "react-icons/tb";
import React from "react";

export interface NavigationDataProps{
  name:string;
  link:string;
  icon?:React.ReactNode;
  navigation?:NavigationDataProps[];
}

export const navigationData : {
  id:number;
  locale:string;
  navigation:NavigationDataProps[];
}[] = [
  {
    id:1,
    locale:"en",
    navigation:[
      {
        name:"Dashboard",
        link:"/dashboard",
        icon:<HiHome className={"size-4"}/>,
      },
      {
        name:"Master Data",
        link: "/master",
        icon: <TbDatabaseStar className={"size-4"}/>,
        navigation:[
          {
            name:"Categories",
            link:"/master/categories",
            icon:<TbPointFilled className={"size-2"}/>,
          },
          {
            name:"Menu Items",
            link:"/master/menu-items",
            icon:<TbPointFilled className={"size-2"}/>,
          }
        ]
      },
    ]
  },
  {
    id:2,
    locale:"id",
    navigation:[
      {
        name:"Beranda",
        link:"/dashboard",
        icon:<HiHome className={"size-4"}/>,
      },
      {
        name:"Data Master",
        link: "/master",
        icon: <TbDatabaseStar className={"size-4"}/>,
        navigation:[
          {
            name:"Kategori",
            link:"/master/categories",
            icon:<TbPointFilled className={"size-2"}/>,
          },
          {
            name:"Item Menu",
            link:"/master/menu-items",
            icon:<TbPointFilled className={"size-2"}/>,
          }
        ]
      },
    ]
  },
]
