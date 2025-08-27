import React from "react";
import { Link } from "react-router-dom";
import Card from "../../../components/Card";
import PrimaryButton from "../../../components/PrimaryButton";

export default function MiniGamesIndex() {
  return (
    <div className="p-6 grid gap-6 grid-cols-1 md:grid-cols-2">
      <Card title="Snake" action={<PrimaryButton to="/off-time/minigames/snake">Play</PrimaryButton>}>
        <p className="text-sm text-gray-600 dark:text-gray-300">Eat the food. Don’t bite yourself. Arrow keys or swipe.</p>
      </Card>
      <Card title="2048" action={<PrimaryButton to="/off-time/minigames/2048">Play</PrimaryButton>}>
        <p className="text-sm text-gray-600 dark:text-gray-300">Merge tiles to reach 2048. Arrows or swipe.</p>
      </Card>
      <div className="col-span-full">
        <Link to="/off-time" className="text-indigo-600 hover:underline">Back to Off Time</Link>
      </div>
    </div>
  );
}
