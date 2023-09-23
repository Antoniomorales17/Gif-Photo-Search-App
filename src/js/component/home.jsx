import React from "react";
import "./styles.css"; 
import { FaCamera } from "react-icons/fa";

import Buscador from "./buscador/buscador";

const Home = () => {
  return (
    <div className="home container">
      <div className="jumbotron">
	  <p className="lead text-center custom-text">
          <FaCamera /> Search Photos! {/* Agrega el icono aquí */}
        </p>
        <Buscador />
      </div>
    </div>
  );
};

export default Home;
