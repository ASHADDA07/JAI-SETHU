import { NavLink } from "react-router-dom";

interface LinkItem {
  label: string;
  to: string;
}

export default function Sidebar({ links }: { links: LinkItem[] }) {
  return (
    <div className="sidebar">
      {links.map(l => (
        <NavLink
          key={l.to}
          to={l.to}
          className={({ isActive }) =>
            isActive ? "navlink active" : "navlink"
          }
        >
          {l.label}
        </NavLink>
      ))}
    </div>
  );
}
