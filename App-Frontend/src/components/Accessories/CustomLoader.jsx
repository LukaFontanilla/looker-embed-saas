import { PuffLoader } from "react-spinners";
export const SunspotLoaderComponent = () => {
  return (
    <div className="backdrop-blur-sm w-full h-full flex flex-col justify-center align-center items-center bg-zinc-200 dark:bg-zinc-900">
      <PuffLoader size={400} speedMultiplier={0.5} color="#d18" />
    </div>
  );
};
