import Image from "next/image";

type Props = {
  size: number;
};

const LoadingLogo = ({ size = 100 }) => {
  return (
    <div className="h-full w-full justify-center items-center flex">
      <Image
        src="/logo.svg"
        alt="logo"
        width={size}
        height={size}
        className="animate-pulse duration-700 items-center"
      />
    </div>
  );
};

export default LoadingLogo;
