import { useState, useEffect } from "react";
import { Play, Pause, RotateCcw, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDurationReadable } from "@/lib/utils";
import type { Subject, InsertStudySession } from "@shared/schema";

interface StudyTimerProps {
  subjects: Subject[];
  onSessionComplete: (session: Omit<InsertStudySession, "id">) => void;
}

export function StudyTimer({ subjects, onSessionComplete }: StudyTimerProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [duration, setDuration] = useState(0);
  const [selectedSubjectId, setSelectedSubjectId] = useState(subjects[0]?.id || "");

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => setDuration(d => d + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const handleStop = () => {
    setIsRunning(false);
    if (duration > 0) {
      const today = new Date().toISOString().split("T")[0];
      onSessionComplete({
        subjectId: selectedSubjectId,
        duration,
        date: today,
        startTime: new Date().toISOString(),
        endTime: new Date().toISOString(),
        notes: "",
      });
      setDuration(0);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="text-6xl font-bold font-mono">{formatDurationReadable(duration)}</div>
      </div>

      <div className="flex gap-2">
        <Button
          variant="default"
          size="lg"
          className="flex-1"
          onClick={() => setIsRunning(!isRunning)}
          data-testid="button-timer-toggle"
        >
          {isRunning ? (
            <>
              <Pause className="w-4 h-4 mr-2" />
              Pause
            </>
          ) : (
            <>
              <Play className="w-4 h-4 mr-2" />
              Start
            </>
          )}
        </Button>

        <Button
          variant="outline"
          size="lg"
          onClick={handleStop}
          data-testid="button-timer-stop"
        >
          <Plus className="w-4 h-4" />
        </Button>

        <Button
          variant="outline"
          size="lg"
          onClick={() => {
            setIsRunning(false);
            setDuration(0);
          }}
          data-testid="button-timer-reset"
        >
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>

      <select
        value={selectedSubjectId}
        onChange={e => setSelectedSubjectId(e.target.value)}
        className="w-full px-4 py-2 rounded-lg border"
        data-testid="select-subject"
      >
        {subjects.map(subject => (
          <option key={subject.id} value={subject.id}>{subject.name}</option>
        ))}
      </select>
    </div>
  );
}
