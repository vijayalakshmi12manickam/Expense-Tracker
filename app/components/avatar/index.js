"use client";

function getInitials(name) {
  const words = name.trim().split(" ");

  if (words.length === 1) return words[0][0].toUpperCase();

  return words[0][0].toUpperCase() + words[words.length - 1][0].toUpperCase();
}

function getColor(name) {
  const colors = [
    "bg-orange-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-teal-500",
  ];

  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  return colors[Math.abs(hash) % colors.length];
}

export default function Avatar({ name, size = 30 }) {
  const initials = getInitials(name);
  const color = getColor(name);

  return (
    <div
      className={`relative flex items-center justify-center rounded-full overflow-hidden text-white font-bold ${color}`}
      style={{ width: size, height: size }}
    >
      {/* long shadow */}
      <div className="absolute w-[200%] h-[200%] bg-black/20 rotate-45 top-[40%] left-[40%]" />

      {/* initials */}
      <span className="relative z-10" style={{ fontSize: size * 0.45 }}>
        {initials}
      </span>
    </div>
  );
}
