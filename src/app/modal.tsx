import { Card, Set } from "@/types/types";
import { useState } from "react";
import { v4 } from "uuid";

export default function SetsModal({
  show,
  setModal,
}: {
  show: boolean;
  setModal: any;
}) {
  const [cardList, setCardList] = useState<Card[]>([]);
  const [setName, setSetName] = useState<string>("");
  const [setColor, setSetColor] = useState<string>("");

  const addCard = () => {
    const cardElement: Card = {
      front: (document.getElementById("front") as HTMLInputElement)?.value,
      back: (document.getElementById("back") as HTMLInputElement)?.value,
      id: v4(),
      number: cardList.length + 1,
    };
    setCardList([...cardList, cardElement]);

    (document.getElementById("front") as HTMLInputElement).value = "";
    (document.getElementById("back") as HTMLInputElement).value = "";
  };

  const creatSet = () => {
    const setData: Set = {
      name: setName,
      cards: cardList,
      color: setColor,
      id: v4(),
    };

    const sets = window.localStorage.getItem("sets");
    if (sets) {
      window.localStorage.setItem(
        "sets",
        JSON.stringify([...JSON.parse(sets), setData])
      );
    } else {
      window.localStorage.setItem("sets", JSON.stringify([setData]));
    }

    window.location.href = "/";
  };

  const deleteCard = ({ id }: { id: string }) => {
    const newCardList = cardList.filter((card) => card.id !== id);
    setCardList(newCardList);
  };

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
                  onClick={() => creatSet()}
                >
                  Save
                </button>
                <button
                  className="bg-violet-500 rounded-4xl p-3 pl-8 pr-8 cursor-pointer"
                  onClick={() => setModal(false)}
                >
                  Exit
                </button>
              </div>
            </div>

            <div className="flex justify-between bg-zinc-700 p-8 rounded-2xl mt-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-purple-200"
                >
                  Set Name:
                </label>
                <input
                  name="name"
                  id="name"
                  placeholder="Enter set name"
                  onChange={(e) => setSetName(e.target.value)}
                  className="mt-1 block w-full rounded-md bg-zinc-700 text-purple-100 border border-zinc-600 p-2"
                />
              </div>

              <div>
                <label
                  htmlFor="color"
                  className="block text-sm font-medium text-purple-200 mt-4"
                >
                  Set Color:
                </label>
                <input
                  name="color"
                  id="color"
                  type="color"
                  onChange={(e) => setSetColor(e.target.value)}
                  className="mt-1 block w-16 h-10 border-none"
                />
              </div>
            </div>

            <div className="flex justify-between bg-zinc-700 p-8 rounded-2xl mt-4">
              <div>
                <label
                  htmlFor="front"
                  className="block text-sm font-medium text-purple-200"
                >
                  Front:
                </label>
                <input
                  name="front"
                  id="front"
                  placeholder="Front"
                  className="mt-1 block w-full rounded-md bg-zinc-600 text-purple-100 border border-zinc-500 p-2"
                />
              </div>

              <button
                className="bg-violet-500 rounded-4xl pl-8 pr-8 cursor-pointer"
                onClick={() => addCard()}
              >
                Add card
              </button>

              <div>
                <label
                  htmlFor="back"
                  className="block text-sm font-medium text-purple-200"
                >
                  Back:
                </label>
                <input
                  name="back"
                  id="back"
                  placeholder="Back:"
                  className="mt-1 block w-full rounded-md bg-zinc-600 text-purple-100 border border-zinc-500 p-2"
                />
              </div>
            </div>

            <div className="relative bg-zinc-900/50 mt-6 rounded-xl">
              <div className="grid grid-cols-1 gap-4 overflow-y-auto p-4 max-h-[60vh]">
                {cardList?.length === 0 ? (
                  <div className="text-center py-10 text-gray-400 col-span-full">
                    <p>No cards yet. Create your first set to get started!</p>
                  </div>
                ) : (
                  cardList?.map((set) => (
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

                      <button
                        className="bg-violet-500 rounded-4xl p-3 pl-8 pr-8 cursor-pointer"
                        onClick={() => deleteCard({ id: set.id })}
                      >
                        Delete
                      </button>
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
}
