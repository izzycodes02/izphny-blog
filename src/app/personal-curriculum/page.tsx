import Image from 'next/image';
import Link from 'next/link';

export default function page() {
  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold mb-4 font-serif">
        Personal Curriculum
      </h1>

      <table className="w-full table-fixed border-collapse">
        <tbody>
          <tr>
            <td className="border border-gray-300 p-2 w-28 font-bold">
              Course Title
            </td>
            <td className="border border-gray-300 p-2">
              Blender for Stylized 3D Art & Animation
            </td>
          </tr>
          <tr>
            <td className="border border-gray-300 p-2 w-20 font-bold">
              Course Code
            </td>
            <td className="border border-gray-300 p-2">BLDN 101</td>
          </tr>
          <tr>
            <td className="border border-gray-300 p-2 w-20 font-bold">
              Course Duration
            </td>
            <td className="border border-gray-300 p-2">
              Friday 27 March 2026 → Friday 29 August 2026 (22 weeks)
            </td>
          </tr>
        </tbody>
      </table>

      <section className="my-8">
        <h2 className="text-lg font-bold mb-2">✷ Course Description</h2>

        <p className="leading-6 ">
          This curriculum is a structured, self-directed program designed to
          take me from beginner to a strong intermediate/early-advanced level in
          Blender. It emphasises practical creation over theory, with a
          consistent weekly output of models, renders, and animations. The
          course focuses on developing a distinct visual identity that
          blends:{' '}
        </p>

        <ul className="list-disc list-inside mb-3 leading-6 ">
          <li>Low poly stylization</li>
          <li>90s anime-inspired aesthetics</li>
          <li>Cute, modern mascot-style characters</li>
        </ul>

        <p className="leading-6 ">
          By the end, I believe I will understand Blender&rsquo;s core systems
          (modelling, materials, lighting, rendering, animation), but also
          produce a great beginner&rsquo;s portfolio and a capstone project
          demonstrating my artistic direction and technical competence.
        </p>
      </section>

      <section className="my-8">
        <h2 className="text-lg font-bold mb-2">✷ Inspiration Images</h2>

        <div className="grid grid-cols-3 gap-4 h-48">
          <Link
            href="https://x.com/nam_mac/status/2014525517282869581"
            className="relative h-full cursor-my-pointer"
            target="_blank"
          >
            <Image
              src="https://i.pinimg.com/1200x/8a/b6/f0/8ab6f0f938845259b23a420ba9cd7a19.jpg"
              alt="Inspiration 1"
              fill
              className="object-cover"
            />
          </Link>

          <Link
            href="https://www.behance.net/gallery/204216811/TOYS/modules/1159031537"
            target="_blank"
            className="relative h-full"
          >
            <Image
              src="https://i.pinimg.com/1200x/40/d6/a8/40d6a8f62f9ab591349b2d09fcf9f438.jpg"
              alt="Inspiration 2"
              fill
              className="object-cover"
            />
          </Link>

          <Link
            className="relative h-full"
            href="https://x.com/kyu_fu"
            target="_blank"
          >
            <Image
              src="https://i.pinimg.com/736x/9b/34/3e/9b343ee224b33368366e8485591c63cb.jpg"
              alt="Inspiration 3"
              fill
              className="object-cover"
            />
          </Link>
        </div>
      </section>

      <section className="my-8">
        <h2 className="text-lg font-bold mb-2">✷ Learning Outcomes</h2>

        <p className="leading-6 ">
          By completion, I want to be will be able to:
        </p>

        <ul className="list-disc list-inside mb-3 leading-6 ">
          <li>
            Navigate and efficiently use Blender’s interface and core workflows
          </li>
          <li>
            Create clean, optimized 3D models using both low poly and stylized
            techniques
          </li>
          <li>
            Apply materials, textures, and lighting to achieve aesthetic
            consistency
          </li>
          <li>Render high-quality stills using Eevee and Cycles</li>
          <li>
            Animate objects and characters using keyframes and basic rigging
          </li>
          <li>Build stylized environments and scenes</li>
          <li>Develop a recognizable personal art style</li>
          <li>
            Produce short, polished animations suitable for portfolio or social
            media
          </li>
        </ul>
      </section>

      <section className="my-8">
        <h2 className="text-lg font-bold mb-2">✷ Course Timeline Overview</h2>

        <p className="leading-6 ">
          By completion, I want to be will be able to:
        </p>

        <ul className="list-disc list-inside mb-3 leading-6 space-y-1">
          {[
            {
              title: 'Module 1 (Weeks 1–2):',
              description: 'Foundations',
              link: '/personal-curriculum/module-one',
            },
            {
              title: 'Module 2 (Weeks 3–4):',
              description: 'Modelling Fundamentals',
            },
            {
              title: 'Module 3 (Weeks 5–6):',
              description: 'Materials, Lighting & Rendering',
            },
            {
              title: 'Module 4 (Weeks 7–8):',
              description: 'Stylized Modelling & Props',
            },
            {
              title: 'Module 5 (Weeks 9–10):',
              description: 'Character Creation (Mascot Style)',
            },
            {
              title: 'Module 6 (Weeks 11–12):',
              description: 'Rigging & Basic Animation',
            },
            {
              title: 'Module 7 (Weeks 13–14):',
              description: 'Environment Design',
            },
            {
              title: 'Module 8 (Weeks 15–16):',
              description: 'Animation & Cinematics',
            },
            {
              title: 'Module 9 (Weeks 17–18):',
              description: 'Style Development & Polish',
            },
            {
              title: 'Module 10 (Weeks 19–20):',
              description: 'Advanced Techniques',
            },
            { title: 'Weeks 21–22:', description: 'Capstone Project' },
          ].map((module, index) => {
            const content = (
              <>
                <b>{module.title}</b> {module.description}
              </>
            );

            return (
              <li key={index}>
                {module.link ? (
                  <>
                    {content}
                    <Link
                      href={module.link}
                      className="ml-2  mainColourText hover:underline transition-colors"
                    >
                      ▸ click here ◂
                    </Link>
                  </>
                ) : (
                  content
                )}
              </li>
            );
          })}
        </ul>
      </section>

      <section className="my-8">
        <h2 className="text-lg font-bold mb-2">✷ Weekly Time Structure</h2>

        <p>
          Each week will follow a consistent structure to build skills and
          produce work:
        </p>

        <ul className="list-disc list-inside mb-3 leading-6 ">
          <li>
            <b>Friday (2 hours):</b> Introduce new module/week topics + follow
            first tutorial
          </li>
          <li>
            <b>Saturday (2 hours):</b> Continue learning + guided practice
          </li>
          <li>
            <b>Sunday (1 hour):</b> Light review + reinforce key concepts
          </li>
          <li>
            <b>Monday (2 hours):</b> Focused practice (repeat techniques without
            tutorials)
          </li>
          <li>
            <b>Tuesday (2 hours):</b> Build toward weekly assignment (early
            draft)
          </li>
          <li>
            <b>Wednesday (2 hours):</b> Continue assignment + problem-solving
          </li>
          <li>
            <b>Thursday (2 hours):</b> Finalise and polish weekly assignment
          </li>
        </ul>
      </section>

      <section className="my-8">
        <h2 className="text-lg font-bold mb-2">✷ Final Note</h2>

        <p>
          This course aims to be intentionally output-driven. By August, I
          should have:
        </p>

        <ul className="list-disc list-inside mb-3 leading-6 ">
          <li>15–25 completed pieces</li>
          <li>Multiple animations</li>
          <li>A clear visual identity</li>
        </ul>
      </section>
    </div>
  );
}
