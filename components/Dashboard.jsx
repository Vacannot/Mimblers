"use client";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/firebase";
import openSans from "@/fonts/openSans";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
} from "firebase/firestore";
import fugaz from "@/fonts/fugaz";
import { useEffect, useState } from "react";
import Calendar from "./Calendar";
import Login from "./Login";

export default function Dashboard() {
  const { currentUser } = useAuth();
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [data, setData] = useState({});
  const [selectedMachine, setSelectedMachine] = useState(null);
  const [machines, setMachines] = useState([]);
  const [userList, setUserList] = useState({});
  const [machineComment, setMachineComment] = useState("");
  const [showSavedMessage, setShowSavedMessage] = useState(false);

  useEffect(() => {
    async function fetchMachines() {
      if (!currentUser) return;

      try {
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        const isAdmin = userDoc.exists() && userDoc.data().admin === true;

        if (!isAdmin) {
          setMachines([]);
          setUserList({});
          return;
        }

        const q = query(collection(db, "machines"));
        const snapshot = await getDocs(q);
        const machinesArray = [];
        const usersMap = {};

        snapshot.forEach((doc) => {
          const machine = { id: doc.id, ...doc.data() };
          machinesArray.push(machine);

          if (machine.Owner && !usersMap[machine.Owner]) {
            usersMap[machine.Owner] = machine.Owner;
          }
        });

        setMachines(machinesArray);
        setUserList(usersMap);
      } catch (err) {
        console.error("Failed to fetch machines:", err.message);
      }
    }

    fetchMachines();
  }, [currentUser]);

  useEffect(() => {
    if (!selectedUserId) return;

    async function fetchUserData() {
      const docRef = doc(db, "users", selectedUserId);
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        setData(snapshot.data());
      } else {
        setData({});
      }
    }

    fetchUserData();
  }, [selectedUserId]);

  useEffect(() => {
    if (!currentUser) {
      setMachines([]);
      setUserList({});
      setSelectedUserId(null);
      setSelectedMachine(null);
      setData({});
    }
  }, [currentUser]);

  const statuses = {
    "Machines Running": 7,
    "Faults in last 24hrs": 0,
    "Total up time": "4004hrs",
  };

  async function handleSelectMachine(machineId) {
    setSelectedMachine(machineId);

    if (!selectedUserId) return;

    try {
      const now = new Date();
      const day = now.getDate();
      const month = now.getMonth();
      const year = now.getFullYear();

      const userDocRef = doc(db, "users", selectedUserId);

      const userSnapshot = await getDoc(userDocRef);
      const machineData =
        userSnapshot.exists() && userSnapshot.data()?.machines?.[machineId];

      setMachineComment(machineData?.comment || "");

      await setDoc(
        userDocRef,
        {
          machines: {
            [machineId]: {
              lastChecked: `${year}-${month + 1}-${day}`,
            },
          },
        },
        { merge: true }
      );
    } catch (err) {
      console.error("Failed to select machine or load comment:", err.message);
    }
  }

  if (!currentUser) return <Login />;

  if (currentUser && machines.length === 0) {
    return (
      <div className="flex items-center justify-center mt-60">
        <div className={"text-5xl text-center " + fugaz.className}>
          {`You don't own any machines yet..`}
          <p className={"text-3xl text-center mt-5 " + openSans.className}>
            If you are expecting to see some, contact us for support
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 gap-8 sm:gap-12 md:gap-16">
      <div className="flex flex-wrap items-center gap-4 bg-azure-radiance-50 border border-azure-radiance-100 p-4 rounded-md shadow-sm">
        <label className="text-sm sm:text-base font-semibold text-azure-radiance-700">
          Select User:
        </label>
        <select
          value={selectedUserId || ""}
          onChange={(e) => setSelectedUserId(e.target.value)}
          className="bg-white text-azure-radiance-700 border border-azure-radiance-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-azure-radiance-400 transition"
        >
          <option value="" disabled>
            -- Choose a user --
          </option>
          {Object.entries(userList).map(([id, name]) => (
            <option key={id} value={id}>
              {name}
            </option>
          ))}
        </select>
      </div>

      {selectedUserId && (
        <>
          <div className="grid grid-cols-3 bg-azure-radiance-50 text-azure-radiance-500 p-4 gap-4 rounded-md">
            {Object.keys(statuses).map((status, i) => (
              <div key={i} className="flex flex-col gap-1 sm:gap-2">
                <p className="font-medium capitalize text-xs sm:text-sm truncate">
                  {status.replaceAll("_", " ")}
                </p>
                <p
                  className={"text-base sm:text-lg truncate " + fugaz.className}
                >
                  {statuses[status]}
                </p>
              </div>
            ))}
          </div>

          <div className="flex items-stretch flex-wrap gap-4">
            {machines
              .filter((machine) => machine.Owner === selectedUserId)
              .map((machine) => (
                <button
                  key={machine.id}
                  onClick={() => handleSelectMachine(machine.id)}
                  className="p-4 px-5 rounded-md purpleShadow duration-200 bg-azure-radiance-50 hover:bg-azure-radiance-100 text-center flex flex-col items-center gap-2 flex-1"
                >
                  <p className="text-lg font-bold">{machine.label}</p>
                  <p className="text-azure-radiance-500 text-xs sm:text-sm">
                    {machine.id}
                  </p>
                </button>
              ))}
          </div>

          <Calendar completeData={data} />

          {showSavedMessage && (
            <div className="fixed bottom-6 right-6 bg-azure-radiance-600 text-white px-4 py-2 rounded-lg shadow-lg animate-fade-in-out z-50">
              Comment saved
            </div>
          )}

          {selectedMachine && (
            <div className="flex flex-col gap-2 mt-4">
              <label className="text-sm font-medium text-azure-radiance-700">
                Comment about machine: {selectedMachine}
              </label>
              <textarea
                className="p-2 border border-azure-radiance-300 rounded-md focus:outline-none focus:ring-2 focus:ring-azure-radiance-400 text-sm"
                rows={4}
                placeholder="Comments appear here"
                value={machineComment}
                onChange={(e) => setMachineComment(e.target.value)}
              />
              <button
                onClick={async () => {
                  const docRef = doc(db, "users", selectedUserId);
                  await setDoc(
                    docRef,
                    {
                      machines: {
                        [selectedMachine]: {
                          comment: machineComment,
                        },
                      },
                    },
                    { merge: true }
                  );

                  setShowSavedMessage(true);
                  setTimeout(() => setShowSavedMessage(false), 2000);
                }}
                className="p-4 px-5 mx-auto rounded-md purpleShadow duration-200 bg-azure-radiance-50 hover:bg-azure-radiance-100 text-center flex flex-col items-center gap-2 flex-1"
              >
                <p className="text-azure-radiance-500 text-xs sm:text-sm">
                  Save Comment
                </p>
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
