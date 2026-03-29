import Image from 'next/image';

export default function page() {
  return (
    <div className="container mx-auto p-3">
      <Image
        src="/about.webp"
        alt="Cover image"
        width={1600}
        height={900}
        priority
        style={{ width: '100%', height: 'auto' }}
      />

      <section className="leading-6 my-4">
        <p>
          This is a small corner of the internet where I keep track of things
          I&rsquo;m figuring out. I am coming to the age where my age is
          becoming &lsquo;serious&rsquo;. I don&rsquo;t mind that but I want my
          life to be more exciting.
        </p>

        <p className="mt-4">I want to be able to say that</p>

        <ul className="list-disc list-inside ml-4 mt-4">
          <li>I have done something with my life. </li>
          <li>I have made a difference in the world. </li>
          <li>I have lived a life worth living. </li>
          <li>I have lived a life worth remembering. </li>
          <li>I have lived a life worth telling stories about. </li>
          <li>I have lived a life worth sharing with others. </li>
          <li>I have lived a life worth learning from. </li>
          <li>I have lived a life worth inspiring others with. </li>
          <li>I have lived a life worth being proud of. </li>
          <li>I have lived a life worth being grateful for. </li>
          <li>I have lived a life worth being happy about. </li>
        </ul>

        <p className="mt-4">
          To say this to who exactly? I have always been a bit selfish where I
          do care deeply about a select few, but ultimately I want to prove
          myself to myself. Myself and the Almighty God.
        </p>

        <p className="mt-4">
         Anyways, this blog is just my little hub of my life.
        </p>
      </section>
    </div>
  );
}
