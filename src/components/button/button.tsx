interface Button {
  textColor?: string;
  bgColor?: string;
  text?: string;
  hoverColor?: string;
  minWidth?: string;
  className?: string;
}

const Button: React.FC<Button> = ({
  textColor = "white",
  bgColor = "#1777ff",
  text = "Click Me",
  minWidth = "64px",
  className = "",
}) => {
  return (
    <button
      className={`px-4 py-2 rounded-lg transition hover:opacity-90 duration-300 ${className}`}
      style={{
        color: `${textColor}`,
        backgroundColor: `${bgColor}`,
        minWidth: `${minWidth}`,
      }}
    >
      {text}
    </button>
  );
};

export default Button;
