import React from "react";
import "./Loading.css";

const Loading = () => {
  const letters = "DEVLIGHTS".split("");

  return (
    <div className="loading-container">
      <svg
        className="loading-svg"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 300 100"
      >
        {letters.map((letter, index) => (
          <g key={index} transform={`translate(${index * 30}, 0)`}>
            <g>
              <rect
                x="10"
                y="30"
                width="20"
                height="40"
                rx="2"
                fill="#4F3737"
              >
                <animateTransform
                  attributeName="transform"
                  type="translate"
                  values="0,0; 0,-20; 0,0"
                  dur="1s"
                  repeatCount="indefinite"
                  begin={`${index * 0.2}s`}
                />
              </rect>
              <text
                x="20"
                y="55"
                textAnchor="middle"
                fontSize="18"
                fill="#007BFF"
                fontWeight="bold"
              >
                <animateTransform
                  attributeName="transform"
                  type="translate"
                  values="0,0; 0,-20; 0,0"
                  dur="1s"
                  repeatCount="indefinite"
                  begin={`${index * 0.2}s`}
                />
                {letter}
              </text>
            </g>
          </g>
        ))}
      </svg>
      {/* Barra de carga */}
      <div className="loading-bar">
        <div className="loading-progress"></div>
      </div>
    </div>
  );
};

export default Loading;