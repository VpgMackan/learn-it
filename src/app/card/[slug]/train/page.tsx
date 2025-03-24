"use client";

import { useState, useEffect } from "react";
import { Sets, Card, Set } from "@/types/types";
import { redirect } from "next/navigation";

const CardComponent = ({ cardCompletion = 4 }: { cardCompletion: number }) => {
  return (
    <div
      id="absolute-center"
      className={`p-4 rounded-lg mx-1 ${
        cardCompletion == 4
          ? ""
          : cardCompletion == 3
          ? "bg-red-500"
          : cardCompletion == 2
          ? "bg-green-500"
          : cardCompletion == 1
          ? "bg-yellow-500"
          : "bg-zinc-700"
      }`}
    ></div>
  );
};

const FinishModalComponent = ({
  show,
  data,
  answers,
  cardCompletion,
  restartQuiz,
}: {
  show: boolean;
  data: Set | undefined;
  answers: Array<string>;
  cardCompletion: Array<number>;
  restartQuiz: () => void;
}) => {
  const [wrongAnswers, setWrongAnswers] = useState<
    (string | number)[][] | undefined
  >();

  useEffect(() => {
    if (!show) return;
    const wrongAnswersCalc = data?.cards
      .map((v, i) => {
        if (v.back != answers[i]) return [v.id, v.number, answers[i], v.back];
      })
      .filter((v) => {
        return v !== undefined;
      });

    if (wrongAnswersCalc == undefined) return alert("Error during calculation");
    setWrongAnswers(wrongAnswersCalc);
  }, [show]);

  return (
    <div
      className={`relative z-10 ${show ? "" : "hidden"}`}
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full h-screen items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div className="relative transform overflow-hidden rounded-lg bg-zinc-800 text-left shadow-xl transition-all w-5/6 h-5/6 p-16">
            <div className="flex justify-between">
              <p className="text-3xl">Create a new set</p>
              <div>
                <button
                  className="bg-blue-500 rounded-4xl p-3 pl-8 pr-8 mr-4 cursor-pointer"
                  onClick={() => redirect("/")}
                >
                  Home
                </button>
                <button
                  className="bg-red-500 rounded-4xl p-3 pl-8 pr-8 cursor-pointer"
                  onClick={() => restartQuiz()}
                >
                  Restart
                </button>
              </div>
            </div>

            <div className="flex justify-center bg-zinc-700 p-8 rounded-2xl mt-4">
              {!show ? (
                <div className="text-center py-10 text-gray-400 col-span-full">
                  <p>Quiz Not Finished</p>
                </div>
              ) : (
                cardCompletion.map((v, i) => (
                  <CardComponent key={i} cardCompletion={v} />
                ))
              )}
            </div>

            <p className="text-3xl mt-6">Wrong answers</p>
            <div className="relative bg-zinc-900/50 mt-2 rounded-xl">
              <div className="grid grid-cols-1 gap-4 overflow-y-auto p-4 max-h-[35vh]">
                {wrongAnswers?.length === 0 ? (
                  <div className="text-center py-10 text-gray-400 col-span-full">
                    <p>YOU GOT THEM ALL RIGHT!</p>
                  </div>
                ) : (
                  wrongAnswers?.map((set) => (
                    <div
                      key={set[0]}
                      className="p-4 rounded-lg bg-zinc-800 items-center flex justify-start"
                    >
                      <span className="text-2xl">{set[1]}:</span>

                      <div className="flex justify-between flex-grow">
                        <span className="text-2xl ml-12">
                          You said: {set[2]}
                        </span>
                        <span className="text-2xl">I</span>
                        <span className="text-2xl mr-12">
                          Correct answer was: {set[3]}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Home({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const [showModal, setShowModal] = useState<boolean>(false);

  const [setData, setSetData] = useState<Set | undefined>(undefined);
  const [currentCardIndex, setCurrentCardIndex] = useState<number>(0);
  const [cardCompletion, setCardCompletion] = useState<Array<number>>([]);
  const [answers, setAnswers] = useState<Array<string>>([]);

  const [answerInput, setAnswerInput] = useState<string>("");

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

  useEffect(() => {
    if (setData == undefined) return;
    if (!setData?.cards) return alert("Cards don't exist try to reload");

    setCardCompletion(
      setData?.cards.map((_, i) => {
        return i == 0 ? 1 : 0;
      })
    );
    setAnswers(
      setData?.cards.map(() => {
        return "";
      })
    );
  }, [setData]);

  const checkAnswer = () => {
    setCardCompletion(
      cardCompletion.map((v, i) => {
        if (i == currentCardIndex) {
          if (setData?.cards[currentCardIndex].back == answerInput) {
            return 2;
          } else {
            return 3;
          }
        } else if (
          i == currentCardIndex + 1 &&
          currentCardIndex + 1 != setData?.cards.length
        ) {
          return 1;
        } else {
          return v;
        }
      })
    );

    setAnswers(
      answers.map((v, i) => {
        if (i == currentCardIndex) {
          return answerInput;
        } else {
          return v;
        }
      })
    );

    if (currentCardIndex + 1 == setData?.cards.length)
      return setShowModal(true);

    setCurrentCardIndex(currentCardIndex + 1);
    setAnswerInput("");
  };

  const restartQuiz = () => {
    if (!setData?.cards) return alert("Cards don't exist try to reload");
    setShowModal(false);

    setCurrentCardIndex(0);
    setAnswerInput("");
    setCardCompletion(
      setData?.cards.map((_, i) => {
        return i == 0 ? 1 : 0;
      })
    );
  };

  return (
    <div className="">
      <FinishModalComponent
        show={showModal}
        data={setData}
        answers={answers}
        cardCompletion={cardCompletion}
        restartQuiz={restartQuiz}
      />
      {isLoading ? (
        <h1>Loading</h1>
      ) : setData?.cards.length != null ? (
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
                <div
                  id="absolute-center"
                  className={`p-1 px-3 rounded-full mx-1 ${
                    currentCardIndex - 3 < 0
                      ? "text-black/0"
                      : "bg-white opacity-80 text-black"
                  }`}
                >
                  {"+" + setData?.cards.slice(0, currentCardIndex - 2).length}
                </div>

                <CardComponent
                  cardCompletion={cardCompletion[currentCardIndex - 2]}
                />
                <CardComponent
                  cardCompletion={cardCompletion[currentCardIndex - 1]}
                />
                <CardComponent
                  cardCompletion={cardCompletion[currentCardIndex]}
                />
                <CardComponent
                  cardCompletion={cardCompletion[currentCardIndex + 1]}
                />
                <CardComponent
                  cardCompletion={cardCompletion[currentCardIndex + 2]}
                />

                <div
                  id="absolute-center"
                  className={`p-1 px-3 rounded-full mx-1 ${
                    currentCardIndex + 3 >= setData?.cards.length
                      ? "text-black/0"
                      : "bg-white opacity-80 text-black"
                  } text-black`}
                >
                  {"+" + setData?.cards.slice(currentCardIndex + 3).length}
                </div>
              </div>

              <button
                className="bg-red-500 rounded-4xl p-3 pl-8 pr-8 mr-4 cursor-pointer"
                onClick={() => restartQuiz()}
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
                    value={setData?.cards[currentCardIndex].front}
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
                    onChange={(e) => setAnswerInput(e.target.value)}
                    value={answerInput}
                    className="mt-1 block w-full rounded-md bg-zinc-600 text-purple-100 border border-zinc-500 p-2"
                  />
                </div>
              </div>
              <div className="flex justify-center">
                <button
                  className="bg-green-500 rounded-4xl p-3 px-16 cursor-pointer"
                  onClick={() => checkAnswer()}
                >
                  Answer
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p>Cards don't exist try to reload</p>
      )}
    </div>
  );
}
