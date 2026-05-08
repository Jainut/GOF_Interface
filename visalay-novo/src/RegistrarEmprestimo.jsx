import React, { useState } from 'react';

function RegistrarEmprestimo({ API_URL, onEmprestimoRegistrado }) {
  // ==========================================
  // ESTADOS DO FORMULÁRIO
  // ==========================================
  const [cpfOperador, setCpfOperador] = useState('');
  const [ferramentaId, setFerramentaId] = useState('');
  const [statusAviso, setStatusAviso] = useState({ tipo: '', msg: '' });
  const [carregando, setCarregando] = useState(false);

  // ==========================================
  // ESTILOS (Seguindo o padrão do VisAlay)
  // ==========================================
  const inputStyle = {
    width: '100%',
    padding: '12px',
    marginBottom: '15px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    boxSizing: 'border-box',
    fontSize: '16px'
  };

  const btnStyle = {
    backgroundColor: '#4b0082',
    color: 'white',
    border: 'none',
    padding: '15px',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    width: '100%',
    transition: '0.3s',
    opacity: carregando ? 0.7 : 1
  };

  // ==========================================
  // FUNÇÃO DE ENVIO PARA API
  // ==========================================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusAviso({ tipo: '', msg: '' });

    // Validação básica
    if (!cpfOperador || !ferramentaId) {
      setStatusAviso({ tipo: 'erro', msg: 'Preencha todos os campos!' });
      return;
    }

    setCarregando(true);

    try {
      const response = await fetch(`${API_URL}/registrar/Emprestimo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          operador_cpf: cpfOperador,
          ferramenta_id: parseInt(ferramentaId, 10) // Prisma espera Int!
        })
      });

      const data = await response.json();

      if (response.ok) {
        setStatusAviso({ tipo: 'sucesso', msg: ' Empréstimo registrado com sucesso!' });
        setCpfOperador('');
        setFerramentaId('');
        
        // Se você passou uma função pra atualizar as listas lá no App.jsx, a gente chama aqui
        if (onEmprestimoRegistrado) onEmprestimoRegistrado();
      } else {
        setStatusAviso({ tipo: 'erro', msg: `❌ Erro: ${data.message}` });
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      setStatusAviso({ tipo: 'erro', msg: '❌ Erro de conexão com a API.' });
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div style={{ backgroundColor: 'white', borderRadius: '15px', padding: '25px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)', maxWidth: '500px', margin: '0 auto' }}>
      <h3 style={{ color: '#4b0082', marginTop: 0, textAlign: 'center' }}>📝 Registrar Novo Empréstimo</h3>
      
      {statusAviso.msg && (
        <div style={{ 
          padding: '10px', 
          marginBottom: '15px', 
          borderRadius: '8px', 
          backgroundColor: statusAviso.tipo === 'erro' ? '#ffcccc' : '#d4edda',
          color: statusAviso.tipo === 'erro' ? '#cc0000' : '#155724',
          textAlign: 'center',
          fontWeight: 'bold'
        }}>
          {statusAviso.msg}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#333' }}>CPF do Operador:</label>
        <input 
          type="text" 
          placeholder="Ex: 12345678900 (Somente números)" 
          value={cpfOperador}
          onChange={(e) => setCpfOperador(e.target.value)}
          style={inputStyle}
          maxLength="11"
        />

        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#333' }}>ID da Ferramenta:</label>
        <input 
          type="number" 
          placeholder="Ex: 5" 
          value={ferramentaId}
          onChange={(e) => setFerramentaId(e.target.value)}
          style={inputStyle}
        />

        <button type="submit" style={btnStyle} disabled={carregando}>
          {carregando ? 'REGISTRANDO...' : 'CONFIRMAR EMPRÉSTIMO'}
        </button>
      </form>
    </div>
  );
}

export default RegistrarEmprestimo;