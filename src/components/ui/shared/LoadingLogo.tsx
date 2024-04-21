import Image from "next/image";

type Props = {
  size: number;
};

const LoadingLogo = ({ size = 100 }) => {
  return (
    <div className="h-full w-full justify-center items-center flex">
      <Image
        src="/Logo.svg"
        alt="logo"
        width={size}
        height={size}
        className="animate-pulse duration-700"
      />
    </div>
  );
};

export default LoadingLogo;
