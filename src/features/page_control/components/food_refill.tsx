"use client";
import { Dispatch, SetStateAction, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

type VoteType = {
  title: string;
  votes: number;
  variant: "default" | "destructive" | "outline" | "secondary";
  color: string;
};

interface BarPollProps {
  votes?: VoteType[];
  setVotes?: Dispatch<SetStateAction<VoteType[]>>;
  title?: string;
  showResetButton?: boolean;
  maxWidth?: string;
  gridCols?: string;
  className?: string;
  onVoteChange?: (votes: VoteType[]) => void;
  disabled?: boolean;
  full?: number;
  current?: number;
  containerTitle?: string;
  containerColor?: string;
  showPercentage?: boolean;
}

const BarPoll = ({
  votes: propVotes,
  setVotes: propSetVotes,
  title = "What's your opinion?",
  showResetButton = true,
  maxWidth = "max-w-4xl",
  gridCols = "md:grid-cols-[1fr_400px]",
  className = "",
  onVoteChange,
  disabled = false,
  full,
  current,
  containerTitle = "Container",
  containerColor = "bg-blue-500",
  showPercentage = true,
}: BarPollProps) => {
  const [internalVotes, setInternalVotes] = useState<VoteType[]>([
    {
      title: "Tabs",
      votes: 100,
      variant: "default",
      color: "bg-indigo-500",
    },
  ]);

  // Create container vote when full/current are provided
  const containerVotes =
    full !== undefined && current !== undefined
      ? [
          {
            title: containerTitle,
            votes: current,
            variant: "default" as const,
            color: containerColor,
            maxVotes: full,
          },
        ]
      : [];

  const votes =
    propVotes || (containerVotes.length > 0 ? containerVotes : internalVotes);
  const setVotes = propSetVotes || setInternalVotes;

  const handleVotesChange = (newVotes: VoteType[]) => {
    setVotes(newVotes);
    onVoteChange?.(newVotes);
  };

  // Hide options when in container mode
  const showOptions = full === undefined || current === undefined;

  return (
    <section className={`px-4 py-12 ${className}`}>
      <div
        className={`mx-auto grid relative ${maxWidth} grid-cols-1 gap-2 ${
          showOptions ? gridCols : ""
        } md:gap-12`}
      >
        {showOptions && (
          <Options
            votes={votes}
            setVotes={handleVotesChange}
            title={title}
            showResetButton={showResetButton}
            disabled={disabled}
          />
        )}
        <Bars votes={votes} isContainerMode={!showOptions} full={full} />
      </div>
    </section>
  );
};

const Options = ({
  votes,
  setVotes,
  title,
  showResetButton,
  disabled,
}: {
  votes: VoteType[];
  setVotes: (votes: VoteType[]) => void;
  title?: string;
  showResetButton?: boolean;
  disabled?: boolean;
}) => {
  const totalVotes = votes.reduce((acc, cv) => (acc += cv.votes), 0);

  const handleIncrementVote = (vote: VoteType) => {
    if (disabled) return;

    const newVote = { ...vote, votes: vote.votes + 1 };
    const newVotes = votes.map((v) =>
      v.title === newVote.title ? newVote : v
    );
    setVotes(newVotes);
  };

  const handleReset = () => {
    if (disabled) return;

    const resetVotes = votes.map((v) => ({ ...v, votes: 0 }));
    setVotes(resetVotes);
  };

  return (
    <div className="col-span-1 py-12">
      <h3 className="mb-6 text-3xl font-semibold text-slate-50">{title}</h3>
      <div className="mb-6 space-y-2">
        {votes.map((vote) => {
          return (
            <motion.div
              whileHover={disabled ? {} : { scale: 1.015 }}
              whileTap={disabled ? {} : { scale: 0.985 }}
              key={vote.title}
            >
              <Button
                onClick={() => handleIncrementVote(vote)}
                className="w-full"
                variant={vote.variant}
                size="lg"
                disabled={disabled}
              >
                {vote.title}
              </Button>
            </motion.div>
          );
        })}
      </div>
      <div className="flex items-center justify-between">
        <span className="mb-2 italic text-slate-400">{totalVotes} votes</span>
        {showResetButton && (
          <motion.div
            whileHover={disabled ? {} : { scale: 1.015 }}
            whileTap={disabled ? {} : { scale: 0.985 }}
          >
            <Button
              onClick={handleReset}
              variant="secondary"
              size="sm"
              disabled={disabled}
            >
              Reset count
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export const Bars = ({
  votes,
  isContainerMode = false,
  full,
}: {
  votes: VoteType[];
  isContainerMode?: boolean;
  full?: number;
}) => {
  const totalVotes =
    isContainerMode && full
      ? full
      : votes.reduce((acc, cv) => (acc += cv.votes), 0);

  return (
    <div
      className="col-span-1 grid min-h-[200px] gap-2"
      style={{
        gridTemplateColumns: `repeat(${votes.length}, minmax(0, 1fr))`,
      }}
    >
      {votes.map((vote) => {
        const height =
          vote.votes && totalVotes
            ? ((vote.votes / totalVotes) * 100).toFixed(2)
            : 0;

        const displayVotes = isContainerMode
          ? `${vote.votes}/${full}`
          : `${vote.votes} votes`;

        return (
          <div key={vote.title} className="col-span-1">
            <span className="text-xs text-slate-300 absolute right-2 top-2 z-100">
              {height}%
            </span>

            <div className="relative flex h-full w-full items-end overflow-hidden rounded-2xl bg-gradient-to-b from-slate-700 to-slate-800">
              <motion.span
                animate={{ height: `${height}%` }}
                className={`relative z-0 w-full ${vote.color}`}
                transition={{ type: "spring" }}
              />
              <span className="absolute bottom-0 left-[50%] mt-2 inline-block w-full -translate-x-[50%] p-2 text-center text-sm text-slate-50">
                <b>{vote.title}</b>
                <br />
                <span className="text-xs text-slate-200">{displayVotes}</span>
                <br />
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BarPoll;
export { default as SingleBar } from "./single_bar";
