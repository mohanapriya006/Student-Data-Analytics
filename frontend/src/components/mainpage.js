import { FaSortNumericUp, FaTrophy, FaStar } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

function MainPage() { 
  const navigate = useNavigate();

  const containerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f0f0f0'
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 200px)',
    gridGap: '20px',
    textAlign: 'center'
  };

  const buttonStyle = {
    padding: '30px 20px',
    backgroundColor: 'white',
    borderRadius: '12px',
    border: '2px solid #ccc',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#333',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    transition: '0.3s'
  };

  const iconStyle = {
    fontSize: '28px',
    marginBottom: '10px'
  };

  return (
    <div style={containerStyle}>
      <div style={gridStyle}>
        <div 
          style={buttonStyle} 
          onClick={() => navigate('/cgpa-ranking')} 
        >
          <FaSortNumericUp style={{ ...iconStyle, color: '#17a2b8' }} />
          CGPA Ranking
        </div>
        <div 
          style={buttonStyle}  
          onClick={() => navigate('/students-lc')}
        >
          <FaTrophy style={{ ...iconStyle, color: '#e83e8c' }} />
          LC Ranking
        </div>
        <div 
          style={buttonStyle}
          onClick={() => navigate('/overall-ranking')}
        >
          <FaStar style={{ ...iconStyle, color: '#fd7e14' }} />
          Overall Ranking
        </div>
      </div>
    </div>
  );
}

export default MainPage;
