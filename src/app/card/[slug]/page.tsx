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
              <span className="ml-3 text-2xl">Your sets</span>
              <button
                className="bg-violet-900 rounded-4xl p-3 pl-8 pr-8"
                onClick={() => alert("Hello")}
              >
                Create New
              </button>
            </div>

            <div className="relative bg-zinc-900/50 mt-6 rounded-xl">
              <div
                ref={scrollContainerRef}
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 overflow-y-auto p-4 max-h-[60vh] pb-10"
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
                {/*setData?.length === 0 ? (
                  <div className="text-center py-10 text-gray-400 col-span-full">
                    <p>No sets yet. Create your first set to get started!</p>
                  </div>
                ) : (
                  setData?.map((set) => (
                    <div
                      key={set.id}
                      style={{ background: set.color }}
                      className="p-4 rounded-lg hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() => (window.location.href = `/card/${set.id}`)}
                    >
                      <div className="flex flex-col">
                        <span className="text-lg mb-2">{set.name}</span>
                        <span className="text-sm">
                          Cards: {set.cards.length}
                        </span>
                      </div>
                    </div>
                  ))
                )*/}
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
