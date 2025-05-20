import React from "react";
import Card from "./Card";
import type { CardProps } from "./Card";
import { FaStar, FaChartLine, FaCheckCircle, FaBolt } from "react-icons/fa";
import "../css/CardGrid.css";

// Sample card data (replace with parsed finalIdea as needed)
const cardData: CardProps[] = [
  {
    label: "Organizational",
    title: "Visioning",
    description: "Set a clear vision for your team and align everyone toward common goals.",
    borderColor: "#fbbf24",
    icon: <FaStar style={{ color: "#fbbf24", marginRight: 8 }} />,
    meta: <span>4.8/5</span>,
    className: "wide"
  },
  {
    label: "Productivity",
    title: "Sprint Planning",
    description: "Plan your sprints efficiently and track progress in real time.",
    borderColor: "#38bdf8",
    icon: <FaChartLine style={{ color: "#38bdf8", marginRight: 8 }} />,
    meta: <span>92%</span>
  },
  {
    label: "Wellness",
    title: "Mood Tracker",
    description: "Monitor your mood and well-being with daily check-ins.",
    borderColor: "#ec4899",
    icon: <FaCheckCircle style={{ color: "#ec4899", marginRight: 8 }} />,
    meta: <span>Stable</span>
  },
  {
    label: "AI",
    title: "Smart Insights",
    description: "Get AI-powered insights and recommendations for your workflow.",
    borderColor: "#a78bfa",
    icon: <FaBolt style={{ color: "#a78bfa", marginRight: 8 }} />,
    meta: <span>New</span>,
    className: "tall"
  },
  {
    label: "Finance",
    title: "Budgeting",
    description: "Easily manage your expenses and set monthly goals.",
    borderColor: "#10b981",
    meta: <span>On Track</span>
  },
  {
    label: "Education",
    title: "Learning Path",
    description: "Personalized learning paths to help you grow your skills.",
    borderColor: "#fde68a",
    meta: <span>3 Courses</span>
  },
  {
    label: "Social",
    title: "Team Chat",
    description: "Stay connected with your team using real-time chat.",
    borderColor: "#818cf8",
    meta: <span>Active</span>
  },
  {
    label: "Health",
    title: "Step Counter",
    description: "Track your daily steps and reach your fitness goals.",
    borderColor: "#ef4444",
    meta: <span>7,500 steps</span>
  }
];

const CardGrid: React.FC<{ cards?: CardProps[] }> = ({ cards = cardData }) => (
  <div className="dashboard-card-grid">
    {cards.map((card, idx) => (
      <Card key={idx} {...card} />
    ))}
  </div>
);

export default CardGrid;