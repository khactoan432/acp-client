import React from "react";
import Advisory from "../../components/features/Advisory/Advisory";
import Upload from "../../components/features/Upload/Upload";

const About: React.FC = () => {
  return (
    <div>
      About
      <Upload />
      <Advisory />
    </div>
  );
};

export default About;
