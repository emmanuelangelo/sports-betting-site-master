// External Imports
import { useTypewriter, Cursor } from "react-simple-typewriter";
import { FaChevronDown } from "react-icons/fa";
import { Link } from "react-scroll";

const Hero = () => {
  // Typewriter hook to loop through words
  const { text } = useTypewriter({
    words: ["fans.", "bets.", "you.", "Ellie!"],
    loop: 2,
    delaySpeed: 2000,
    typeSpeed: 200,
    deleteSpeed: 200,
  });

  return (
    <div className="hero-wrapper">
      <div className="hero-section">
        <div className="hero-splash">
          <h1 className="hero-title">Powerful tools for anyone's use!</h1>
          <h3 className="hero-text">
            SportsInsights is for <span>{text}</span>
            <Cursor />
          </h3>
          <a href="#" className="hero-section-btn">
            Get started here
          </a>
          <Link
            to="about-wrapper"
            smooth={true}
            duration={1000}
            offset={50}
            className="hero-section-learn"
          >
            <FaChevronDown className=".hero-section-icon" fill={"#333"} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Hero;
