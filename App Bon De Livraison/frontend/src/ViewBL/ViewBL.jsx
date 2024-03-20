import React, { useState, useEffect } from 'react';
import { Col, Row, Button } from 'react-bootstrap';
import { FaFileDownload } from 'react-icons/fa';
import NavBar from '../NavBar/NavBar';
import { useDispatch, useSelector } from 'react-redux';
import BASE_URL from '../services/apiConfig';
import './ViewBL.css';

function ViewBL() {
  const [bills, setBills] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ dateBl: '', nomDest: '', blname: '' });
  const userId = useSelector((state) => state.auth.user?.id);

  const fetchBills = (page) => {
    setLoading(true);
    const itemsPerPage = 10;
    const baseApiUrl = `${BASE_URL}/bl/${userId}`;

    let apiUrl ;
    const { dateBl, nomDest } = filters;
    
    if (dateBl) {
      apiUrl = `${baseApiUrl}/${dateBl}/byDate`;
    } else {
      apiUrl = `${baseApiUrl}/getAllBlByUser`;
    }
    
    
    // Add filters to the URL
    if (nomDest) {
      apiUrl = `${baseApiUrl}/${nomDest}/getAllBlByDest`;
    }
    apiUrl = `${apiUrl}/${page}/${itemsPerPage}`;

    // Rest of your code...
    
      fetch(`${BASE_URL}/bl/${userId}/getAllBlByUser`)
    .then((response) => response.json())
    .then((data) => {
      console.log('API Response:', data);
      const estimatedTotalPages = Math.ceil(data.length / itemsPerPage) || 1;
      setTotalPages(estimatedTotalPages);
      console.log('API Response:', estimatedTotalPages);

    })
    .catch((error) => console.error('Error fetching bills:', error))

    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        console.log('API Response:', data);
        const billsArray = Array.isArray(data) ? data : [];
        setBills(billsArray);
            })
      .catch((error) => console.error('Error fetching bills:', error))
      .finally(() => setLoading(false));
  };
  

  useEffect(() => {
    fetchBills(currentPage);
  }, [currentPage, filters]);

  useEffect(() => {
    // Trigger a new API call when filters change
    fetchBills(1); // You might want to fetch from the first page when filters change
  }, [filters]);

  const downloadPdf = (billId) => {
    const pdfUrl = `${BASE_URL}/bl/${billId}/downloadImported`;
    window.location.href = pdfUrl;
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleFilterChange = (filterName, value) => {
    setCurrentPage(1);
    setFilters((prevFilters) => ({ ...prevFilters, [filterName]: value }));
  };

  return (
    <div>
      <div className='filters-container'>
        <NavBar />
        <div>
          <label>Date:</label>
          <input
            type='date'
            value={filters.dateBl}
            onChange={(e) => handleFilterChange('dateBl', e.target.value)}
          />
        </div>
        <div>
          <label>Nom Destinataire:</label>
          <input
            type='text'
            value={filters.nomDest}
            onChange={(e) => handleFilterChange('nomDest', e.target.value)}
          />
        </div>
      
      </div>
      <div className='table-container'>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <table className='custom-table'>
            <thead className='table-header'>
              <tr>
                <th>Date</th>
                <th>Nom Destinataire</th>
                <th>Numéro Téléphone</th>
                <th>Prix Hliv</th>
                <th>Description</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody className='table-body'>
              {bills.length === 0 ? (
                <tr>
                  <td colSpan="6">No data available</td>
                </tr>
              ) : (
                bills.map((bill) => (
                  <tr key={bill.id}>
                    <td>{bill.dateBl}</td>
                    <td>{bill.nomDest}</td>
                    <td>{bill.numTelephone1 || '-'}</td>
                    <td>{bill.prixHliv}</td>
                    <td>{bill.desc || '-'}</td>
                    <td>
                      <Button
                        size='sm'
                        variant='success'
                        onClick={() => downloadPdf(bill.id)}
                      >
                        <FaFileDownload /> Télécharger
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
        {!loading && (
          <div className='pagination-container'>
            {Array.from({ length: totalPages }, (_, index) => index + 1).map(
              (page) => (
                <Button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  disabled={page === currentPage}
                >
                  {page}
                </Button>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ViewBL;
