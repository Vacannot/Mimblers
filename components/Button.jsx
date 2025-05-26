import React from "react";
import fugaz from "@/fonts/fugaz";

export default function Button(props) {
  const { text, dark, full, clickHandler } = props;

  return (
    <button
      onClick={clickHandler}
      className={
        "rounded-md overflow-hidden duration-200 hover:opacity-60 border-2 border-solid border-azure-radiance-600 " +
        (dark
          ? " text-white bg-azure-radiance-600 "
          : " text-azure-radiance-600 ") +
        (full ? " grid place-items-center w-full " : " ")
      }
    >
      <p
        className={
          "px-6 sm:px-10 whitespace-nowrap py-2 sm:py-3 " + fugaz.className
        }
      >
        {text}
      </p>
    </button>
  );
}
