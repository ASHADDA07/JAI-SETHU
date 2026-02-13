import { useNavigate } from "react-router-dom";

interface TileProps {
  title: string;
  to: string;
}

export default function Tile({ title, to }: TileProps) {
  const navigate = useNavigate();

  return (
    <div
      className="tile"
      role="button"
      tabIndex={0}
      aria-label={title}
      onClick={() => navigate(to)}
      onKeyDown={e => e.key === "Enter" && navigate(to)}
    >
      <h3>{title}</h3>
    </div>
  );
}
