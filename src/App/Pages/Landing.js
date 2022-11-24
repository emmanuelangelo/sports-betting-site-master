//External Imports
// import firebase from "firebase";
// import { useState, useEffect } from "react";

// Internal Imports
import Navbar from "../Components/Navbar";
import Hero from "../Components/Hero";
import About from "../Components/About";

const Landing = () => {
  // const [games, setGames] = useState([]);
  // const gameRef = firebase.firestore().collection("Games");
  // const getGames = () => {
  //   gameRef
  //     .where("season", "<", 2011)
  //     .limit(1)
  //     .onSnapshot((querySnapshot) => {
  //       const items = [];
  //       querySnapshot.forEach((doc) => {
  //         items.push(doc.data());
  //         console.log(doc.data());
  //       });
  //       setGames(items);
  //     });
  // };
  // useEffect(() => {
  //   getGames();
  // }, [games]);
  // return (
  //   <div>
  //     <h1>Games Displayed:</h1>
  //     {games.map((game) => {
  //       return (
  //         <li key={game.id.toString()}>
  //           <div>{game.id}</div>
  //           <div>{game.homeTeam}</div>
  //           <div>{game.homeScore}</div>
  //           <div>{game.visitorTeam}</div>
  //           <div>{game.visitorScore}</div>
  //         </li>
  //       );
  //     })}
  //   </div>
  // );

  return (
    <div className="landing-wrapper">
      <Navbar />
      <Hero />
      <About />
    </div>
  );
};

export default Landing;
