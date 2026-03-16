import { motion } from "framer-motion";
import { useEffect } from "react";

export type StoryBlockType =
    | { id: string; type: "text"; content: string }
    | { id: string; type: "image"; url: string; alt: string }
    | { id: string; type: "audio"; data: string; mimeType: string };

interface StoryBlockProps {
  block: StoryBlockType;
}

export const StoryBlock = ({ block }: StoryBlockProps) => {
  useEffect(() => {
    if (block.type === "audio") {
      try {
        const bytes = atob(block.data);
        const arr = new Uint8Array(bytes.length);
        for (let i = 0; i < bytes.length; i++) {
          arr[i] = bytes.charCodeAt(i);
        }
        const blob = new Blob([arr], { type: block.mimeType });
        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);
        audio.play().catch(() => {});
        return () => {
          audio.pause();
          URL.revokeObjectURL(url);
        };
      } catch {
        // silent fail
      }
    }
  }, [block]);

  if (block.type === "text") {
    return (
        <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-serif italic text-white/80 text-base leading-relaxed"
        >
          {block.content}
        </motion.p>
    );
  }

  if (block.type === "image") {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="w-full max-w-sm mx-auto rounded-xl overflow-hidden"
        >
          <img
              src={block.url}
              alt={block.alt}
              className="w-full object-cover"
              loading="lazy"
          />
          <p className="text-center text-white/30 text-xs italic mt-2 px-2">
            {block.alt}
          </p>
        </motion.div>
    );
  }

  return null;
};

export default StoryBlock;