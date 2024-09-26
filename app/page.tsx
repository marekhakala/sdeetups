import Link from 'next/link';
import Image from "next/image";

export default function Home() {
  return (
    <div className="grid grid-rows-[1fr,auto,auto] items-center justify-items-center">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <Image
          src="/logo.png"
          alt="Starknet Deetups Logo"
          width={200}
          height={100}
          priority
        />
        <p className="text-xl text-center sm:text-left">
          Welcome to a decentralized solution for meetups.
        </p>
        <div className="flex gap-4">
          <Link href="/new">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Create New Event
            </button>
          </Link>
          <Link href="/lookup">
            <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded">
              Lookup Event
            </button>
          </Link>
        </div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center w-full mt-16 py-4 bg-white">
        © StarkNet Fanat1c5, Inc.
      </footer>
    </div>
  );
}
