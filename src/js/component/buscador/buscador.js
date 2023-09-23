import React, { useState, useEffect } from "react";
import "./buscador.css"; // Importa tu archivo de estilos CSS aquí

const Buscador = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [images, setImages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(12); // Número de imágenes por página
  const [maxPagesToShow] = useState(10); // Número máximo de páginas mostradas
  const apiKey = "39618174-e395b4a97be03a6809542973d"; // Tu clave de API de Pixabay

  useEffect(() => {
    if (searchTerm.trim() !== "") {
      handleSearch();
    }
  }, [currentPage]);

  const handleSearch = () => {
    const apiUrl = `https://pixabay.com/api/?key=${apiKey}&q=${searchTerm}&per_page=${itemsPerPage}&page=${currentPage}`;

    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error en la solicitud de la API");
        }
        return response.json();
      })
      .then((data) => {
        // Agregar propiedades de "me gusta" y visitas a cada imagen
        const imagesWithDetails = data.hits.map((image) => {
          return {
            ...image,
            likes: image.likes,
            views: image.views,
          };
        });

        // Actualizar el estado de las imágenes con los resultados de la búsqueda
        setImages(imagesWithDetails);

        // Calcular el número total de páginas
        const totalResults = data.totalHits;
        const totalPages = Math.ceil(totalResults / itemsPerPage);
        setTotalPages(totalPages);
      })
      .catch((error) => {
        console.error("Error en la solicitud de la API:", error);
      });
  };

  const openImageInNewTab = (imageUrl) => {
    window.open(imageUrl, "_blank");
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
        <li
          className={`page-item ${
            currentPage === page ? "active" : ""
          }`}
          key={page}
        >
          <button
            className="page-link page-button"
            onClick={() => handlePageChange(page)}
          >
            {page}
          </button>
        </li>
      );
    }

    return (
      <nav>
        <ul className="pagination">
          <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
            <button
              className="page-link page-button"
              onClick={() => handlePageChange(currentPage - 1)}
            >
              {"←"}{/* Flecha izquierda */}
            </button>
          </li>
          {pages}
          <li
            className={`page-item ${
              currentPage === totalPages ? "disabled" : ""
            }`}
          >
            <button
              className="page-link page-button"
              onClick={() => handlePageChange(currentPage + 1)}
            >
              {"→"}{/* Flecha derecha */}
            </button>
          </li>
        </ul>
      </nav>
    );
  };

  return (
    <div className="giphy-search-container">
      <div className="row">
        <div className="col-md-8">
          <input
            type="text"
            className="search-input"
            placeholder="Search Photos..."
            aria-label="Buscar"
            aria-describedby="basic-addon2"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <button className="btn-search" type="button" onClick={handleSearch}>
            Search
          </button>
        </div>
      </div>

      {images.length > 0 && (
        <div className="row mt-3 result-container">
          {images.map((image) => (
            <div className="col-md-4 mb-3 image-container" key={image.id}>
              <img
                src={image.webformatURL}
                alt={image.tags}
                className="img-fluid result-image"
              />
              <div className="image-details">
                <p>Likes: {image.likes}</p>
                <p>Views: {image.views}</p>
                <button
                  className="btnsearch"
                  onClick={() => openImageInNewTab(image.largeImageURL)}
                >
                  View and download
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="row mt-3 pagination-container">
        {renderPagination()}
      </div>
    </div>
  );
};

export default Buscador;
