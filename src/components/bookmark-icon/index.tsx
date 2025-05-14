import classes from "./index.module.css";

type BookmarkIconProps = {
  active: boolean;
  onClick: () => void;
};

export const BookmarkIcon = ({
  active,
  onClick,
}: BookmarkIconProps) => {
  return (
    <div
      aria-label={active ? 'unsave' : 'save'}
      className={classes.root}
      onClick={onClick}
      role="button"
    >
      <svg
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <title>{active ? 'Unsave (Ctrl/Cmd+S)' : 'Save (Ctrl/Cmd+S)'}</title> {/* a11y tooltip */}
        {active ? (
          <path d="M20 22a.999.999 0 0 1-.687-.273L12 14.815l-7.313 6.912A1 1 0 0 1 3 21V3a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1Z"></path>
        ) : (
          <polygon fill="none" points="20 21 12 13.44 4 21 4 3 20 3 20 21" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></polygon>
        )}
      </svg>
    </div>
  );
}