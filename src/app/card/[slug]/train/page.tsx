"use client";

import { useState, useEffect } from "react";
import { Sets, Card, Set } from "@/types/types";
import { redirect } from "next/navigation";

export default function Home({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const [setData, setSetData] = useState<Set | undefined>(undefined);
  const [cardCompletion, setCardCompletion] = useState<Array<number>>([
    2, 3, 3, 2, 1, 0,
  ]);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [slug, setSlug] = useState<string | null>(null);

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
    setSetData(foundSet || undefined);

    setIsLoading(false);
  }, [slug]);

  return (
    <div className="">
      {isLoading ? (
        <h1>Loading</h1>
      ) : (
        <div className="relative h-screen">
          <div>
            <div className="bg-zinc-900/50 flex justify-between items-center rounded-4xl p-3 ">
              <button
                className="bg-blue-500 rounded-4xl p-3 pl-8 pr-8 mr-4 cursor-pointer"
                onClick={() => redirect(`/card/${slug}`)}
              >
                Go Back
              </button>
              <div className="flex justify-center items-center">
                {setData?.cards.map((set) => (
                  <div
                    key={set.id}
                    className={`p-4 rounded-lg items-center flex justify-start mx-1 ${
                      cardCompletion[set.number - 1] == 3
                        ? "bg-red-500"
                        : cardCompletion[set.number - 1] == 2
                        ? "bg-green-500"
                        : cardCompletion[set.number - 1] == 1
                        ? "bg-yellow-500 "
                        : "bg-zinc-700 "
                    }`}
                  ></div>
                ))}
              </div>

              <button
                className="bg-red-500 rounded-4xl p-3 pl-8 pr-8 mr-4 cursor-pointer"
                onClick={() => alert("Restart")}
              >
                Restart
              </button>
            </div>

            <div className="relative bg-zinc-900/50 mt-6 rounded-xl p-4">
              <div className="flex justify-between p-6 rounded-2xl mt-4 gap-6">
                <div className="flex-1">
                  <label
                    htmlFor="question"
                    className="block text-sm font-medium text-purple-200"
                  >
                    Question:
                  </label>
                  <input
                    name="question"
                    id="question"
                    value="Hello"
                    disabled
                    className="mt-1 block w-full rounded-md bg-zinc-600 text-purple-100 border border-zinc-500 p-2"
                  />
                </div>

                <div className="flex-1">
                  <label
                    htmlFor="answer"
                    className="block text-sm font-medium text-purple-200"
                  >
                    Answer:
                  </label>
                  <input
                    name="answer"
                    id="answer"
                    placeholder="Answer"
                    className="mt-1 block w-full rounded-md bg-zinc-600 text-purple-100 border border-zinc-500 p-2"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
