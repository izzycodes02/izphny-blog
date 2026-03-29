import Image from 'next/image';
import type { MDXComponents } from 'mdx/types';
import { IconExternalLink, IconMapPin, IconMovie, IconUser } from '@tabler/icons-react';

interface MyLinkProps {
  src: string;
  children?: React.ReactNode;
  type?: string;
}

interface MyImagesProps {
  cols?: number;
  children?: React.ReactNode;
}

interface MyImageProps {
  src: string;
  alt?: string;
  caption?: string;
}

interface EmojiProps {
  type: string;
}

export const mdxComponents: MDXComponents = {
  // Custom link component
  MyLink: ({ src, children, type }: MyLinkProps) => {
    return (
      <>
        {type === 'location' ? (
          <a
            href={src}
            target="_blank"
            rel="noopener noreferrer"
            title="See about this place!"
            className={`inline-flex text-red-400 hover:text-red-600
      hover:underline font-medium transition-colors duration-200`}
          >
            <span className="inline-flex items-center gap-[2px] font-medium MyPointerCursor">
              <IconMapPin className="w-[10px] h-[10px] MyPointerCursor" />
              <span className="pt-[1.5px] MyPointerCursor"> {children}</span>
            </span>
          </a>
        ) : type === 'movie' ? (
          <a
            href={src}
            target="_blank"
            rel="noopener noreferrer"
            title="See about this movie!"
            className={`inline-flex text-blue-400 hover:text-blue-600
    hover:underline font-medium transition-colors duration-200`}
          >
            <span className="inline-flex items-center gap-[2px] font-medium MyPointerCursor">
              <IconMovie className="w-[10px] h-[10px] MyPointerCursor" />
              <span className="pt-[1.5px] MyPointerCursor"> {children}</span>
            </span>
          </a>
        ) : type === 'person' ? (
          <a
            href={src}
            target="_blank"
            title="See about this person!"
            rel="noopener noreferrer"
            className={`inline-flex text-violet-400 hover:text-violet-600
    hover:underline font-medium transition-colors duration-200 `}
          >
            <span className="inline-flex items-center gap-[2px] font-medium MyPointerCursor">
              <IconUser className="w-[10px] h-[10px] MyPointerCursor" />
              <span className="pt-[1.5px] MyPointerCursor"> {children}</span>
            </span>
          </a>
        ) : (
          <a
            href={src}
            target="_blank"
            title="See about this person!"
            rel="noopener noreferrer"
            className={`inline-flex text-yellow-700 hover:text-yellow-900
  hover:underline font-medium transition-colors duration-200 `}
          >
            <span className="inline-flex items-center gap-[2px] font-medium MyPointerCursor">
              <IconExternalLink className="w-[10px] h-[10px] MyPointerCursor" />
              <span className="pt-[1.5px] MyPointerCursor"> {children}</span>
            </span>
          </a>
        )}
      </>
    );
  },

  Emoji: ({ type }: EmojiProps) => {
    const emojiMap: Record<string, string> = {
      smile: '/emoji/smile.webp',
      party: '/emoji/party.webp',
      sad: '/emoji/sad.webp',
      angry: '/emoji/angry.webp',
      confused: '/emoji/confused.webp',
      love: '/emoji/inlove.webp',
      sarcastic: '/emoji/sarcastic.webp',
      sleepy: '/emoji/sleepy.gif',
      angel: '/emoji/angel.webp',
      alien: '/emoji/alien.webp',
      nerd: '/emoji/nerd.webp',
      crying: '/emoji/crying.webp',
      cake: '/emoji/cake.webp',
      camera: '/emoji/camera.png',
      cat: '/emoji/cat.webp',
      dog: '/emoji/dog.webp',
      computer: '/emoji/computer.gif',
      cool: '/emoji/cool.webp',
      disappointed: '/emoji/disappointed.webp',
      embarrassed: '/emoji/embarrassed.png',
      heart: '/emoji/heart.png',
      heartbreak: '/emoji/heartbreak.png',
      eyeroll: '/emoji/eye-roll.gif',
      freezing: '/emoji/freezing.webp',
      princess: '/emoji/princess.webp',
      smilewide: '/emoji/smile-wide.webp',
      stickingtongue: '/emoji/sticking-tongue.webp',
      star: '/emoji/star.gif',
      surprised: '/emoji/surprised.webp',
      thinking: '/emoji/thinking.webp',
      wink: '/emoji/wink.webp',
      hmmm: '/emoji/hmmm.webp',
      punk: '/emoji/punk.webp',
    };

    const makeSmaller = new Set([
      'embarrassed',
      'heart',
      'heartbreak',
      'eyeroll',
      'computer',
      'sleepy',
    ]);

    let width = 16;
    let height = 16;

    if (makeSmaller.has(type)) {
      width = 13;
      height = 13;
    }

    return (
      <Image
        src={emojiMap[type] || '/emojis/confused.webp'}
        alt={type}
        width={width}
        height={height}
        className="inline-block align-middle mb-1"
      />
    );
  },

  // Custom images grid component
  'my images': ({ cols = 2, children }: MyImagesProps) => {
    const gridCols = {
      1: 'grid-cols-1',
      2: 'grid-cols-1 md:grid-cols-2',
      3: 'grid-cols-1 md:grid-cols-3',
      4: 'grid-cols-1 md:grid-cols-4',
    };

    return (
      <div className="my-8">
        <div
          className={`grid ${gridCols[cols as keyof typeof gridCols] || 'grid-cols-1 md:grid-cols-2'} gap-4`}
        >
          {children}
        </div>
      </div>
    );
  },

  // Optional: Single image with caption
  MyImage: ({ src, alt, caption }: MyImageProps) => (
    <figure className="mt-6 mb-3">
      <Image
        src={src}
        alt={alt || ''}
        width={1200}
        height={600}
        className="rounded w-full h-auto object-cover"
        priority
        sizes="(max-width: 768px) 100vw, 1200px"
      />
      {caption && (
        <figcaption className="text-center text-[10px] italic text-gray-500 mt-2">
          {caption}
        </figcaption>
      )}
    </figure>
  ),

  // Custom image component with Next.js Image optimization
  img: (props) => (
    <span className="block my-8">
      <Image
        src={props.src || ''}
        alt={props.alt || ''}
        width={800}
        height={400}
        className="rounded-lg w-full h-auto"
        sizes="(max-width: 768px) 100vw, 800px"
      />
      {props.alt && (
        <span className="block text-gray-500 dark:text-gray-400 mt-2 text-center">
          {props.alt}
        </span>
      )}
    </span>
  ),

  // Custom blockquote styling
  blockquote: (props) => (
    <blockquote
      className="border-l-4 border-gray-300 dark:border-gray-700 pl-4 py-2 my-6 italic text-gray-700 dark:text-gray-300"
      {...props}
    />
  ),

  // Code blocks
  pre: (props) => (
    <pre
      className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg overflow-x-auto my-6"
      {...props}
    />
  ),

  // Headers with anchor links
  h1: (props) => (
    <h1
      className="text-3xl font-bold mt-8 mb-4"
      id={props.children?.toString().toLowerCase().replace(/\s+/g, '-')}
      {...props}
    />
  ),

  h2: (props) => (
    <h2
      className="text-xl font-semibold mt-8 mb-4"
      id={props.children?.toString().toLowerCase().replace(/\s+/g, '-')}
      {...props}
    />
  ),

  h3: (props) => (
    <h3
      className="text-lg font-medium mt-6 mb-3"
      id={props.children?.toString().toLowerCase().replace(/\s+/g, '-')}
      {...props}
    />
  ),

  // Paragraphs
  p: (props) => <p className="leading-6 mb-4" {...props} />,

  // Lists
  ul: (props) => (
    <ul
      className="list-disc list-inside mb-4 space-y-2 text-gray-700 dark:text-gray-300 pl-4"
      {...props}
    />
  ),

  ol: (props) => (
    <ol
      className="list-decimal list-inside mb-4 space-y-2 text-gray-700 dark:text-gray-300"
      {...props}
    />
  ),

  li: (props) => <li className="leading-6 " {...props} />,

  // Links
  a: (props) => (
    <a
      className="text-blue-600 dark:text-blue-400 hover:underline"
      target={props.href?.startsWith('http') ? '_blank' : undefined}
      rel={props.href?.startsWith('http') ? 'noopener noreferrer' : undefined}
      {...props}
    />
  ),

  // Horizontal rule
  hr: (props) => (
    <hr className="my-4 border-gray-200 dark:border-gray-800" {...props} />
  ),
};
