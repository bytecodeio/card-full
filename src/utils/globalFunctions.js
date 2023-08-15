import React, {useContext} from "react";
import { ExtensionContext } from "@looker/extension-sdk-react";


export const sortDateFilterList = (data) => {
    return data.sort((a,b) => {
       var x = a.description.toLowerCase();
       var y = b.description.toLowerCase();
           return x < y ? -1 : x > y ? 1 : 0;
       });
   }
