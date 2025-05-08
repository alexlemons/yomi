type LinkProps = {
  href: string;
  text: string;
};

export const Link = ({
  href,
  text,
}: LinkProps) => {
  return (
    <a
      href={href}
      rel="noopener noreferrer"
      target="_blank"
    >
      {text}
    </a>
  );
}