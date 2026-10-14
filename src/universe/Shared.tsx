import { Star } from "lucide-react";
import { useUniverse } from "./Universe";
import { fragments, type FragmentId } from "./data";
import type { ReactNode } from "react";

export function ExperienceFrame({
  title,
  kicker,
  description,
  children,
  className = "",
}: {
  title: string;
  kicker: string;
  description: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={"world-experience " + className}>
      <span className="eyebrow">{kicker}</span>
      <h2 id="modal-title">{title}</h2>
      <p className="experience-intro">{description}</p>
      {children}
    </section>
  );
}
export function StarFragment({ id }: { id: FragmentId }) {
  const world = useUniverse();
  const found = world.progress.fragments.includes(id);
  return (
    <div className={"star-fragment " + (found ? "collected" : "")}>
      <button
        className="fragment-button"
        disabled={found}
        onClick={() => world.fragment(id)}
        aria-label={
          (found ? "Bintang terkumpul: " : "Ambil bintang: ") +
          fragments[id].name
        }
      >
        <Star size={20} fill="currentColor" />
        <span>
          {found ? "Kept in our little sky" : "Psst… a tiny star for you"}
          <small>{fragments[id].name}</small>
        </span>
      </button>
      {found && <p>{fragments[id].line}</p>}
    </div>
  );
}
