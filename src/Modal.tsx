import { useEffect, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { motion, useReducedMotion } from "motion/react";
import { X } from "lucide-react";
import { useUniverse } from "./universe/Universe";

export default function Modal({
  children,
  onClose,
  className = "",
  titleId = "modal-title",
}: {
  children: ReactNode;
  onClose: () => void;
  className?: string;
  titleId?: string;
}) {
  const dialog = useRef<HTMLDivElement>(null);
  const systemReduceMotion = useReducedMotion();
  const { progress } = useUniverse();
  const reduceMotion = systemReduceMotion || !progress.effects;
  const close = useRef(onClose);
  close.current = onClose;
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const scroll = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const page = document.getElementById("page");
    if (page) page.inert = true;
    dialog.current
      ?.querySelector<HTMLElement>("[data-autofocus], button")
      ?.focus();
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close.current();
      }
      if (event.key !== "Tab") return;
      const elements = [
        ...(dialog.current?.querySelectorAll<HTMLElement>(
          'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex="0"]',
        ) ?? []),
      ].filter((el) => el.getClientRects().length);
      const first = elements[0];
      const last = elements.at(-1);
      if (!first) {
        event.preventDefault();
        return;
      }
      if (
        event.shiftKey &&
        (document.activeElement === first ||
          !dialog.current?.contains(document.activeElement))
      ) {
        event.preventDefault();
        last?.focus();
      } else if (
        !event.shiftKey &&
        (document.activeElement === last ||
          !dialog.current?.contains(document.activeElement))
      ) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = scroll;
      if (page) page.inert = false;
      document.removeEventListener("keydown", handleKey);
      if (previous?.isConnected) previous.focus({ preventScroll: true });
    };
  }, []);
  return createPortal(
    <motion.div
      className="modal-backdrop"
      initial={reduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <motion.div
        ref={dialog}
        className={`modal ${className}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        initial={reduceMotion ? false : { opacity: 0, y: 24, scale: 0.94 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.96 }}
        transition={{ type: "spring", stiffness: 300, damping: 28 }}
      >
        <button
          className="close-modal icon-button"
          onClick={onClose}
          aria-label="Tutup popup"
        >
          <X size={21} />
        </button>
        {children}
      </motion.div>
    </motion.div>,
    document.body,
  );
}
