import React, { useState } from 'react';

function RegistrarDevolucao({ API_URL, emprestimos, onDevolucaoConcluida }) {
  const [mensagem, setMensagem] = useState({ texto: '', cor: '' });

  const realizarDevolucao = async (emp) => {
    try {
      const response = await fetch(`${API_URL}/registrar/Devolucao`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          operador_cpf: emp.operador_cpf,
          emprestimo_id: emp.emprestimo_id,
          ferramenta_id: emp.ferramenta_id
        }),
      });

      if (response.ok) {
        setMensagem({ texto: `${emp.tipo_ferramenta} devolvida com sucesso!`, cor: '#28a745' });
        onDevolucaoConcluida(); // Atualiza a lista no App.jsx
      } else {
        setMensagem({ texto: ' Erro ao registrar devolução no servidor.', cor: '#ff4d4d' });
      }
    } catch (error) {
      setMensagem({ texto: ' Erro de conexão com a API.', cor: '#ff4d4d' });
    }

    setTimeout(() => setMensagem({ texto: '', cor: '' }), 4000);
  };

  // Filtra apenas os que estão com status "Emprestado"
  const ativos = emprestimos.filter(emp => emp.ferramenta_status === 'Emprestado');

  return (
    <div style={{ backgroundColor: 'white', borderRadius: '15px', padding: '25px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
      <h3 style={{ color: '#4b0082', marginTop: 0 }}>🔄 Processar Devolução de Ferramenta</h3>
      
      {mensagem.texto && (
        <div style={{ backgroundColor: mensagem.cor, color: 'white', padding: '10px', borderRadius: '8px', marginBottom: '15px', fontWeight: 'bold' }}>
          {mensagem.texto}
        </div>
      )}

      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr style={{ backgroundColor: '#f8f9fa' }}>
            <th style={{ padding: '12px', borderBottom: '2px solid #dee2e6' }}>Item</th>
            <th style={{ padding: '12px', borderBottom: '2px solid #dee2e6' }}>Operador</th>
            <th style={{ padding: '12px', borderBottom: '2px solid #dee2e6' }}>Ação</th>
          </tr>
        </thead>
        <tbody>
          {ativos.length === 0 ? (
            <tr><td colSpan="3" style={{ padding: '20px', textAlign: 'center' }}>Não há ferramentas para devolver no momento.</td></tr>
          ) : (
            ativos.map((emp) => (
              <tr key={emp.emprestimo_id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '12px' }}>{emp.tipo_ferramenta}</td>
                <td style={{ padding: '12px' }}>{emp.nome_operador}</td>
                <td style={{ padding: '12px' }}>
                  <button 
                    onClick={() => realizarDevolucao(emp)}
                    style={{ 
                      backgroundColor: '#ff00ff', 
                      color: 'white', 
                      border: 'none', 
                      padding: '8px 12px', 
                      borderRadius: '6px', 
                      cursor: 'pointer', 
                      fontWeight: 'bold' 
                    }}
                  >
                    RECEBER ITEM
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default RegistrarDevolucao;