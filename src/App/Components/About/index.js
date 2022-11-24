// External Imports
import { FaPhone, FaEye, FaCalculator } from "react-icons/fa";

// Window data to map through
const displayData = [
  {
    cName: "stats",
    icon: <FaCalculator className="about-icons" />,
    title: "Stats",
    info: "Updated stats monthly for your enjoyment! See games from the past 10 seasons with information on players, teams, and specific games.",
  },
  {
    cName: "insights",
    icon: <FaEye className="about-icons" />,
    title: "Insights",
    info: "Get insights into who is going to win games in upcoming seasons using machine learning solutions and previous game/player data.",
  },
  {
    cName: "contact",
    icon: <FaPhone className="about-icons" />,
    title: "Contact",
    info: "Click here to contact us if there are any issues using the website or if any errors. Estimated 5-7 business day response time.",
  },
];

const About = () => {
  return (
    <div id="about-wrapper">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
        <path
          fill="#e12836"
          fill-opacity="1"
          d="M0,160L48,160C96,160,192,160,288,144C384,128,480,96,576,69.3C672,43,768,21,864,58.7C960,96,1056,192,1152,192C1248,192,1344,96,1392,48L1440,0L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
        ></path>
      </svg>

      <h1>What We Do</h1>
      <div className="about-modals">
        {/* Map through data to create three display windows */}
        {displayData.map((data, index) => {
          return (
            <div className={`about ${data.cName}`} key={index}>
              {data.icon}
              <h3>{data.title}</h3>
              <p>{data.info}</p>
              <a href={`/${data.cName}`} className="about-btn">
                Click Here
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default About;
