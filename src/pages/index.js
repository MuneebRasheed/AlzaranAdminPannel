import Image from 'next/image';

export default function Home() {

  return (
    <section className="wa">
      <div className="container-fluid text-center mt-4 bg-white">
        <h1 className="display-1 text-black opacity-50 pt-2">Welcome</h1>
        <h3 className="display-3 text-black opacity-50">
          JRMNMIX(pvt) Admin Portal
        </h3>
        <img
          src="./assest/Screen Shot 2024-01-31 at 4.36.04 PM.png"
          alt=""
          className="logo-image mt-5 pt-3 mb-5 pb-5"
        />
        <Image
          src="/logo.png"
          alt="Example"
          width={500}
          height={300}
        />
      </div>
    </section>
  );
}
