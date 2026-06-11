// Dentro do seu componente de Login(props) ou Login({ setUsuarioLogado })
const handleEntrar = () => {
  // Exemplo de lógica de login simulada para testes rápidos:
  if (login === 'admin' && senha === '123') {
    setUsuarioLogado({ nome: 'Diretoria TSEA', tipo: 'ADMIN', matricula: 'RE-00001' });
  } else if (login === 'operador' && senha === '123') {
    setUsuarioLogado({ nome: 'Marcos Oliveira', tipo: 'OPERADOR', matricula: 'RE-40922', cargo: 'Soldador Especialista', setor: 'SOLDA', status: 'Ativo' });
  } else if (login === 'almoxarife' && senha === '123') {
    setUsuarioLogado({ nome: 'Sérgio Almoxarife', tipo: 'ALMOXARIFE', matricula: 'RE-11022' });
  } else {
    alert("Usuário ou senha incorretos!");
  }
};