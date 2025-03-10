"use client";

import { useEffect, useState, useRef } from "react";
import { Sets, Card } from "@/types/types";
import Image from "next/image";
import { redirect } from "next/navigation";

export default function SetId({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const [setData, setSetData] = useState<Sets | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showArrow, setShowArrow] = useState<boolean>(false);
  const [slug, setSlug] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const getSlug = async () => {
      setSlug((await params).slug);
    };
    getSlug();
  }, []);

  useEffect(() => {
    if (slug == null) return;

    const storedData = localStorage.getItem("sets");
    if (!storedData) redirect("/");

    const tempSetData: Sets[] = JSON.parse(storedData);
    const foundSet = tempSetData.find((i: Sets) => i.id === slug);
    setSetData(foundSet || null);

    setIsLoading(false);
  }, [slug]);

  return (
    <div className="">
      {isLoading ? (
        <h1>Loading</h1>
      ) : (
        <div>
          <div className=" pb-10">
            <span className="text-6xl">{setData?.name} </span>
          </div>
          <div>
            <div
              style={{
                backgroundColor: setData?.color,
              }}
              className="bg-zinc-900/50 flex justify-between items-center rounded-4xl p-3"
            >
              <span className="ml-3 text-2xl">Your cards</span>

              <div>
                <button
                  className="bg-blue-500 rounded-4xl p-3 pl-8 pr-8 mr-4 cursor-pointer"
                  onClick={() => alert("Hello")}
                >
                  Add New
                </button>
                <button
                  className="bg-violet-500 rounded-4xl p-3 pl-8 pr-8 cursor-pointer"
                  onClick={() => (window.location.href += "/train")}
                >
                  Learn!
                </button>
              </div>
            </div>

            <div className="relative bg-zinc-900/50 mt-6 rounded-xl">
              <div
                ref={scrollContainerRef}
                className="grid grid-cols-1 gap-4 overflow-y-auto p-4 max-h-[60vh]"
                onScroll={() => {
                  if (scrollContainerRef.current) {
                    const { scrollTop, scrollHeight, clientHeight } =
                      scrollContainerRef.current;
                    const isNearBottom =
                      scrollTop + clientHeight >= scrollHeight - 40;
                    setShowArrow(!isNearBottom);
                  }
                }}
              >
                {setData?.length === 0 ? (
                  <div className="text-center py-10 text-gray-400 col-span-full">
                    <p>No cards yet. Create your first set to get started!</p>
                  </div>
                ) : (
                  setData?.cards.map((set) => (
                    <div
                      key={set.id}
                      className="p-4 rounded-lg bg-zinc-800 items-center flex justify-start"
                    >
                      <span className="text-2xl">{set.number}:</span>

                      <div className="flex justify-between flex-grow">
                        <span className="text-2xl ml-12">{set.front}</span>
                        <span className="text-2xl">I</span>
                        <span className="text-2xl mr-12">{set.back}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {showArrow ? (
                <div className="bg-gray-300 rounded-4xl p-3 max-w-fit max-h-fit opacity-80 absolute bottom-0 left-1/2">
                  <Image
                    src="/down-arrow.svg"
                    alt="Down arrow"
                    width={24}
                    height={24}
                  />
                </div>
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
