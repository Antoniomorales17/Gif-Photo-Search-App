import React, { useState, useEffect } from "react";
import "./GiphySearch.css"; // Importa tu archivo de estilos CSS aquí

const GiphySearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [gifs, setGifs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const apiKey = "uVOL2cBieXtEzOUzfHAvvK39GhbaxiTH"; // Tu clave de API de Giphy
  const itemsPerPage = 12; // Número de GIFs por página
  const maxPagesToShow = 10; // Número máximo de páginas mostradas en la paginación

  useEffect(() => {
    if (searchTerm.trim() !== "") {
      loadGifs();
    }
  }, [currentPage]);

  const loadGifs = () => {
    const apiUrl = `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${searchTerm}&limit=${itemsPerPage}&offset=${(currentPage - 1) * itemsPerPage}`;

    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error en la solicitud de la API");
        }
        return response.json();
      })
      .then((data) => {
        const gifData = data.data;
        setGifs(gifData);
        setTotalPages(Math.ceil(data.pagination.total_count / itemsPerPage));
      })
      .catch((error) => {
        console.error("Error en la solicitud de la API:", error);
      });
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const renderPagination = () => {
    const pages = [];

    // Calcular los límites inferior y superior para las páginas mostradas
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = startPage + maxPagesToShow - 1;

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let page = startPage; page <= endPage; page++) {
      pages.push(
        <button
          key={page}
          onClick={() => handlePageChange(page)}
          className={`page-button ${currentPage === page ? "active" : ""}`}
        >
          {page}
        </button>
      );
    }

    return (
      <div className="pagination-container">
        <button
          onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
          className={`page-button ${currentPage === 1 ? "disabled" : ""}`}
        >
          {"←"}{/* Flecha izquierda */}
        </button>
        {pages}
        <button
          onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
          className={`page-button ${currentPage === totalPages ? "disabled" : ""}`}
        >
          {"→"}{/* Flecha derecha */}
        </button>
      </div>
    );
  };

  return (
    <div className="giphy-search-container">
      <input
        type="text"
        placeholder="Search GIFs..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />
      <button onClick={loadGifs} className="search-button">
        Search
      </button>

      <div className="gif-container">
        {gifs.map((gif) => (
          <div className="gif-item" key={gif.id}>
            <a
              href={gif.images.original.url} // URL del GIF original
              download={`${gif.title}.gif`} // Nombre de archivo sugerido para la descarga
              className="gif-download-link"
            >
              <img src={gif.images.fixed_height.url} alt={gif.title} className="gif-image" />
            </a>
          </div>
        ))}
      </div>

      {totalPages > 1 && renderPagination()}
    </div>
  );
};

export default GiphySearch;
