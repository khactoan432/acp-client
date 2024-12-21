import React from "react";
import Advisory from "../../components/features/Advisory/Advisory";
import Upload from "../../components/features/Upload/Upload";
import ListFile from "../../components/features/Upload/List";

const About: React.FC = () => {
  return (
    <div>
      About
      <Upload />

      <ListFile />
      <Advisory />
    </div>
  );
};

export default About;
