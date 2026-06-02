import React, { useState } from 'react';

function Register({ onBack }) {
  // 1. Agora o tipo começa vazio!
  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    setor: '',
    tipo: '' 
  });
  
  const [status, setStatus] = useState({ loading: false, msg: '', error: false });

  const API_URL = "https://visalayapi.onrender.com";
  
  const handleRegistro = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: false });

    try {
      // Registrar na tabela Usuario (funciona para Operador, Almoxarife, RH)
      const resUser = await fetch(`${API_URL}/registrar/Usuario`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: formData.nome,
          cpf: formData.cpf,
          tipo: formData.tipo
        })
      });

      const dadosUser = await resUser.json();

      if (!resUser.ok) {
        throw new Error(dadosUser.erro || dadosUser.message || 'Falha ao criar usuário base no banco.');
      }

      // Se for Operador, registra também na tabela Operador com o setor
      if (formData.tipo === 'Operador') { 
        const resOp = await fetch(`${API_URL}/registrar/Operador`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            cpf: formData.cpf,
            setor: formData.setor
          })
        });

        const dadosOp = await resOp.json();

        if (!resOp.ok) {
          throw new Error(dadosOp.erro || dadosOp.message || 'Falha ao registrar setor do operador.');
        }
      }

      setStatus({ loading: false,msg: 'Cadastro Realizado Com Sucesso', error: false });
      setTimeout(() => onBack(), 2000);

    } catch (error) {
      setStatus({ loading: false, msg: 'Erro: ' + error.message, error: true });
    }
  };

  const inputStyle = {
    width: '100%', padding: '12px', marginBottom: '10px',
    borderRadius: '8px', border: '1px solid #ccc', boxSizing: 'border-box'
  };

  const btnStyle = {
    backgroundColor: '#4b0082', color: 'white', border: 'none',
    padding: '15px', borderRadius: '12px', fontWeight: 'bold',
    cursor: 'pointer', width: '100%'
  };

  return (
    <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '25px', width: '350px', boxShadow: '0 10px 30px rgba(0,0,0,0.3)', fontFamily: 'sans-serif' }}>
      <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', padding: 0, marginBottom: '10px' }}>← Voltar</button>
      <h2 style={{ color: '#4b0082', textAlign: 'center', marginTop: 0 }}>Novo Cadastro</h2>

      {status.msg && (
        <div style={{ backgroundColor: status.error ? '#ffcccc' : '#ccffcc', color: status.error ? '#cc0000' : '#006600', padding: '10px', borderRadius: '8px', textAlign: 'center', marginBottom: '15px', fontWeight: 'bold' }}>
          {status.msg}
        </div>
      )}

      <form onSubmit={handleRegistro}>
        <input placeholder="Nome Completo" style={inputStyle} onChange={(e) => setFormData({...formData, nome: e.target.value})} required />
        <input placeholder="CPF (apenas números)" style={inputStyle} maxLength="11" onChange={(e) => setFormData({...formData, cpf: e.target.value})} required />
        
        {/* 2. Adicionado o disabled e required aqui */}
        <select 
          style={inputStyle} 
          value={formData.tipo}
          onChange={(e) => setFormData({...formData, tipo: e.target.value})}
          required
        >
          <option value="" disabled>Selecione um tipo...</option>
          <option value="Operador">Funcionário</option>
          <option value="Almoxarife">Almoxarife</option>
          <option value="RH">ADM / Supervisor</option>
        </select>

        {formData.tipo === 'Operador' && (
          <input placeholder="Setor" style={inputStyle} onChange={(e) => setFormData({...formData, setor: e.target.value})} required />
        )}

        <button type="submit" style={btnStyle} disabled={status.loading}>
          {status.loading ? 'PROCESSANDO...' : 'FINALIZAR CADASTRO'}
        </button>
      </form>
    </div>
  );
}

export default Register;