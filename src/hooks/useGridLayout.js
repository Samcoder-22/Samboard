import { useEffect, useState } from "react"

export function useGridLayout(){

  const [layout, setLayout] = useState({cols:4, rows:3})

  useEffect(()=>{

    function updateLayout(){

      const width = window.innerWidth

      // if(width < 640){
      //   setLayout({cols:2, rows:4})
      // }
      if(width < 1024){
        setLayout({cols:4, rows:3})
      }
      else{
        setLayout({cols:6, rows:2})
      }

    }

    updateLayout()

    window.addEventListener("resize", updateLayout)

    return ()=> window.removeEventListener("resize", updateLayout)

  },[])

  return layout
}