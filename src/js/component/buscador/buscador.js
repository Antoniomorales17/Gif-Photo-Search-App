import React, { useState, useEffect } from "react";
import "./buscador.css";

const Buscador = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [images, setImages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(12); // Número de imágenes por página
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

  return (
    <div>
      <div className="row">
        <div className="col-md-8">
          <input
            type="text"
            className="form-control"
            placeholder="Look for what you want..."
            aria-label="Buscar"
            aria-describedby="basic-addon2"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="col-md-4">
        <button
  className="btn btn-search"
  type="button"
  onClick={handleSearch}
>
  Search
</button>

        </div>
      </div>
      {/* Mostrar las imágenes obtenidas solo si hay imágenes en el estado */}
      {images.length > 0 && (
        <div>
          <div className="row mt-3">
            {images.map((image) => (
              <div className="col-md-4 mb-3 image-container" key={image.id}>
                <img
                  src={image.webformatURL}
                  alt={image.tags}
                  className="img-fluid"
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
          {/* Paginación */}
          <div className="pagination-container">
         
            
              <nav>
                <ul className="pagination">
                  {Array.from({ length: totalPages }, (_, index) => (
                    <li
                      className={`page-item ${
                        currentPage === index + 1 ? "active" : ""
                      }`}
                      key={index + 1}
                    >
                      <button
                        className="page-link"
                        onClick={() => handlePageChange(index + 1)}
                      >
                        {index + 1}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
              
            </div>
          </div>
        
      )}
    </div>
  );
};

export default Buscador;
