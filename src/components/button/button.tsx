interface Button {
  textColor?: string;
  bgColor?: string;
  text?: string;
  hoverColor?: string;
}

const Button: React.FC<Button> = ({
  textColor = "white",
  bgColor = "#1777ff",
  text = "Click Me",
}) => {
  return (
    <button
      className="px-4 py-2 rounded-lg transition hover:opacity-90 duration-300"
      style={{ color: `${textColor}`, backgroundColor: `${bgColor}` }}
    >
      {text}
    </button>
  );
};

export default Button;
