import Calendar from "./Calendar";
import CallToAction from "./CallToAction";
import fugaz from "@/fonts/fugaz";

export default function Hero() {
  return (
    <div className="py-4 md:py-10 flex flex-col gap-8 sm:gap-10">
      <h1
        className={
          "text-5xl sm:text-6xl md:text-7xl text-center " + fugaz.className
        }
      >
        <span className="textGradient">Mimblers</span> makes sure your washing
        operations runs <span className="textGradient">stainless</span>
      </h1>
      <p className="text-lg sm:text-xl md:text-2xl text-center w-full mx-auto max-w-[600px]">
        Advanced and automated diagnostics let's us support you{" "}
        <span className="font-semibold">every day of every year.</span>
      </p>
      <CallToAction />
      <Calendar demo />
    </div>
  );
}
