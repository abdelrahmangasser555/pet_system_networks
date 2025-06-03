"use client";
import { motion } from "framer-motion";

interface SingleBarProps {
  full: number;
  current: number;
  title?: string;
  color?: string;
  showPercentage?: boolean;
  showValues?: boolean;
  height?: string;
  width?: string;
  className?: string;
  backgroundColor?: string;
  textColor?: string;
  rounded?: string;
  animated?: boolean;
}

const SingleBar = ({
  full,
  current,
  title = "Flexible Bar",
  color = "bg-blue-500",
  showPercentage = false,
  showValues = true,
  height = "min-h-[200px]",
  width = "w-full",
  className = "",
  backgroundColor = "bg-gradient-to-b from-slate-700 to-slate-800",
  textColor = "text-slate-50",
  rounded = "rounded-2xl",
  animated = true,
}: SingleBarProps) => {
  const percentage = full > 0 ? ((current / full) * 100).toFixed(2) : 0;
  const fillHeight = `${percentage}%`;

  const displayText = () => {
    const parts = [];
    if (showValues) parts.push(`${current}/${full}`);
    if (showPercentage) parts.push(`${percentage}%`);
    return parts.join(" • ");
  };

  const MotionSpan = animated ? motion.span : "span";
  const motionProps = animated
    ? {
        animate: { height: fillHeight },
        transition: { type: "spring" },
      }
    : { style: { height: fillHeight } };

  return (
    <div className={`${width} ${className}`}>
      <div
        className={`relative flex ${height} w-full items-end overflow-hidden ${rounded} ${backgroundColor}`}
      >
        <MotionSpan
          {...motionProps}
          className={`relative z-0 w-full ${color}`}
        />
        <span
          className={`absolute bottom-0 left-[50%] mt-2 inline-block w-full -translate-x-[50%] p-2 text-center text-sm ${textColor}`}
        >
          <b>{title}</b>
          <br />
          <span className="text-xs opacity-80">{displayText()}</span>
        </span>
      </div>
    </div>
  );
};

export default SingleBar;
