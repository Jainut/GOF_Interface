import React from 'react';

export default function Login({ 
  TSEA, perfil, setPerfil, statusBiometria, videoRef, progressoEscaneamento, 
  ligarWebcam, iniciarEscanerManual, entrarNoPainelManualmente, desligarWebcam,
  cpfAlmoxarife, setCpfAlmoxarife, senhaLoginAlmoxarife, setSenhaLoginAlmoxarife, entrarComoAlmoxarife,
  senhaSuperAdmin, setSenhaSuperAdmin, entrarComoSuperAdmin
}) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{ backgroundColor: TSEA.vermelho, padding: '20px', textAlign: 'center', color: 'white' }}>
        <h2 style={{ margin: 0 }}>TSEA ENERGIA</h2>
      </header>
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '15px' }}>
        <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '8px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', width: '100%', maxWidth: '380px', borderTop: `5px solid ${TSEA.vermelho}`, textAlign: 'center' }}>
          
          {!perfil && (
            <>
              <h4 style={{ margin: '0 0 20px 0' }}>CONTROLE DE ACESSO MÓVEL</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <button onClick={() => setPerfil('func')} style={{ padding: '15px', background: TSEA.vermelho, color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Acessar Totem Operacional</button>
                <button onClick={() => setPerfil('adm')} style={{ padding: '15px', background: TSEA.cinzaEscuro, color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Área do Almoxarife (ADM)</button>
                <button onClick={() => setPerfil('superadmin')} style={{ padding: '15px', background: TSEA.vermelho, color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Administrador Geral (MASTER)</button>
              </div>
            </>
          )}

          {perfil === 'func' && (
            <div>
              <h5>Validação Biométrica Móvel</h5>
              <div style={{ width: '180px', height: '180px', backgroundColor: '#111', borderRadius: '50%', margin: '0 auto 20px auto', position: 'relative', overflow: 'hidden', border: `4px solid ${statusBiometria === 'sucesso' ? 'green' : TSEA.vermelho}`, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {statusBiometria === 'desligado' && <div style={{ color: '#666', fontSize: '28px' }}>Câmera</div>}
                <video ref={videoRef} autoPlay playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', transform: 'scaleX(-1)' }} />
                {statusBiometria === 'escanear' && (
                  <>
                    <div style={{ position: 'absolute', width: '100%', height: '3px', backgroundColor: TSEA.vermelho, top: `${progressoEscaneamento}%`, left: 0 }} />
                    <div style={{ position: 'absolute', bottom: '5px', color: '#fff', fontSize: '10px', background: 'rgba(0,0,0,0.7)', padding: '2px 6px' }}>Mapeando: {progressoEscaneamento}%</div>
                  </>
                )}
                {statusBiometria === 'sucesso' && <div style={{ position: 'absolute', width: '100%', height: '100%', backgroundColor: 'rgba(46,125,50,0.9)', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', fontWeight: 'bold' }}>Permitido</div>}
              </div>

              {statusBiometria === 'desligado' && <button onClick={ligarWebcam} style={{ width: '100%', padding: '12px', background: TSEA.vermelho, color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold' }}>Habilitar Câmera</button>}
              {statusBiometria === 'camera_ativa' && <button onClick={iniciarEscanerManual} style={{ width: '100%', padding: '12px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold' }}>Reconhecer Rosto</button>}
              {statusBiometria === 'sucesso' && <button onClick={entrarNoPainelManualmente} style={{ width: '100%', padding: '14px', background: TSEA.vermelho, color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold' }}>Entrar no Sistema</button>}
              <button onClick={() => { desligarWebcam(); setPerfil(null); setStatusBiometria('desligado'); }} style={{ marginTop: '15px', background: 'none', border: 'none', color: TSEA.vermelho, fontWeight: 'bold', cursor: 'pointer' }}>← Voltar</button>
            </div>
          )}

          {perfil === 'adm' && (
            <div>
              <h5>Acesso Restrito Almoxarifado</h5>
              <input type="text" placeholder="CPF do Almoxarife" value={cpfAlmoxarife} onChange={(e) => setCpfAlmoxarife(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '6px', border: `1px solid ${TSEA.cinzaMedio}`, textAlign: 'center', marginBottom: '10px', boxSizing: 'border-box' }} />
              <input type="password" placeholder="Senha ADM" value={senhaLoginAlmoxarife} onChange={(e) => setSenhaLoginAlmoxarife(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '6px', border: `1px solid ${TSEA.cinzaMedio}`, textAlign: 'center', marginBottom: '15px', boxSizing: 'border-box' }} />
              <button onClick={entrarComoAlmoxarife} style={{ width: '100%', padding: '12px', background: TSEA.vermelho, color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold' }}>Acessar Painel</button>
              <button onClick={() => setPerfil(null)} style={{ marginTop: '15px', background: 'none', border: 'none', color: TSEA.vermelho, fontWeight: 'bold', cursor: 'pointer' }}>← Voltar</button>
            </div>
          )}

          {perfil === 'superadmin' && (
            <div>
              <h5>Acesso Master Geral</h5>
              <input type="password" placeholder="Senha Master" value={senhaSuperAdmin} onChange={(e) => setSenhaSuperAdmin(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '6px', border: `1px solid ${TSEA.cinzaMedio}`, textAlign: 'center', marginBottom: '15px', boxSizing: 'border-box' }} />
              <button onClick={entrarComoSuperAdmin} style={{ width: '100%', padding: '12px', background: TSEA.vermelho, color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold' }}>Entrar como Admin Admin</button>
              <button onClick={() => setPerfil(null)} style={{ marginTop: '15px', background: 'none', border: 'none', color: TSEA.vermelho, fontWeight: 'bold', cursor: 'pointer' }}>← Voltar</button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}