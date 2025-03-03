"use client";

import { useEffect } from "react";
import { Sets } from "@/types/types";

const mockdata: Sets[] = [
  {
    name: "Engelska Glossor Vecka 14",
    cards: [
      {
        back: "Hallå",
        front: "Hello",
        number: 0,
        id: "253ea86d-a086-4106-af6e-fe57cc889c0a",
      },
    ],
    color: "#2b8d8d",
    id: "c0914c03-94d9-4bae-ad6a-4cae74a32103",
  },
];

export default function Home() {
  useEffect(() => {
    window.localStorage.setItem("sets", JSON.stringify(mockdata));
  }, []);

  return <div className=""></div>;
}
