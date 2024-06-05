"use client";

import { FC } from "react";

import { HomePage } from "@/views";

const Home: FC = () => {
  console.log("env", process.env.NODE_ENV);
  return <HomePage />;
};

export default Home;
