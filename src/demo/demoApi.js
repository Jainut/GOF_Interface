export const demoEnabled = import.meta.env.MODE === 'demo';

export const demoOperator = {
  cpf: '00000000001',
  matricula: '00000000001',
  nome: 'Marina Costa',
  setor: 'MONTAGEM',
  cargo: 'Operadora de montagem',
  empresa: 'GOF Project',
  status: 'Ativo Operacional',
  tipo: 'OPERADOR'
};

const staff = {
  almoxarife: { cpf: '00000000002', nome: 'Lucas Rocha', tipo: 'ALMOXARIFE', setor: 'MONTAGEM' },
  admin: { cpf: '00000000003', nome: 'Júlia Alves', tipo: 'ADMIN', setor: 'MONTAGEM' }
};
const users = [demoOperator, ...Object.values(staff)];
const cards = [{ id: 1, codigo_uid: 'DEMO-01', user_cpf: demoOperator.cpf, ativo: true, usuario: demoOperator }];
const tools = [
  { id: 1, tipo: 'Torquímetro', categoria: 'Medição', total: 8 },
  { id: 2, tipo: 'Megômetro', categoria: 'Medição', total: 4 },
  { id: 3, tipo: 'Chave combinada', categoria: 'Ferramentas manuais', total: 12 },
  { id: 4, tipo: 'Cinta de elevação', categoria: 'Movimentação', total: 6 }
];
const loans = [
  { id: 1, items: [{ ferramenta_id: 1, quantidade: 1 }], withdrawn: new Date(Date.now() - 3600000).toISOString() },
  { id: 2, items: [{ ferramenta_id: 3, quantidade: 1 }], withdrawn: new Date(Date.now() - 86400000).toISOString(), returned: new Date(Date.now() - 7200000).toISOString() }
];

const toolName = (id) => tools.find((tool) => tool.id === id)?.tipo;
const activeLoans = () => loans.filter((loan) => !loan.returned);
const available = (tool) => tool.total - activeLoans().flatMap((loan) => loan.items)
  .filter((item) => item.ferramenta_id === tool.id)
  .reduce((quantity, item) => quantity + item.quantidade, 0);

const routes = {
  'GET /listar/Ferramentas': () => tools.map((tool) => ({
    ...tool,
    ferramenta_estoque: [{ quantidade: available(tool) }]
  })),
  'GET /listar/Ativos': () => activeLoans().map((loan) => ({
    id: loan.id,
    usuario: demoOperator,
    data_retirada: loan.withdrawn,
    item_emprestimo: loan.items.map((item) => ({
      ...item,
      ferramenta: { tipo: toolName(item.ferramenta_id) }
    }))
  })),
  'GET /listar/Emprestimos': () => [...loans].reverse().map((loan) => ({
    emprestimo_id: loan.id,
    usuario: demoOperator,
    data_retirada: loan.withdrawn,
    ferramenta_status: loan.returned ? 'Devolvido' : 'Emprestado',
    ferramentas: loan.items.map((item) => ({
      ...item,
      tipo_ferramenta: toolName(item.ferramenta_id)
    }))
  })),
  'GET /listar/Devolucoes': () => [...loans].reverse().filter((loan) => loan.returned)
    .flatMap((loan) => loan.items.map((item) => ({
      devolucao_id: loan.id,
      nome_usuario: demoOperator.nome,
      setor_usuario: demoOperator.setor,
      tipo_ferramenta: toolName(item.ferramenta_id),
      data_devolucao: loan.returned,
      status: 'Devolvido'
    }))),
  'GET /listar/Usuarios': () => users.map((user) => ({
    ...user, cartao_nfc: cards.find((card) => card.user_cpf === user.cpf) ?? null
  })),
  'GET /listar/CartoesNFC': () => cards,
  'POST /login/almoxarife': () => ({ token: 'demo-almoxarife', usuario: staff.almoxarife }),
  'POST /login/admin': () => ({ token: 'demo-admin', usuario: staff.admin }),
  'POST /registrar/Emprestimo': ({ user_cpf, ferramentas }) => {
    if (user_cpf !== demoOperator.cpf || !ferramentas?.length) {
      return { status: 400, message: 'Identifique o operador e selecione uma ferramenta.' };
    }
    const totals = new Map();
    for (const { ferramenta_id, quantidade } of ferramentas) {
      const tool = tools.find(({ id }) => id === ferramenta_id);
      const total = (totals.get(ferramenta_id) ?? 0) + quantidade;
      if (!tool || !Number.isInteger(quantidade) || quantidade < 1 || total > available(tool)) {
        return { status: 409, message: 'Quantidade indisponível no estoque.' };
      }
      totals.set(ferramenta_id, total);
    }
    const id = loans.length + 1;
    loans.push({ id, items: ferramentas, withdrawn: new Date().toISOString() });
    return { status: 201, emprestimo_id: id };
  },
  'POST /registrar/Devolucao': ({ emprestimo_id, user_cpf }) => {
    const loan = activeLoans().find(({ id }) => id === emprestimo_id);
    if (!loan || user_cpf !== demoOperator.cpf) {
      return { status: 404, message: 'Empréstimo ativo não encontrado.' };
    }
    loan.returned = new Date().toISOString();
    return { emprestimo_id };
  },
  'POST /cadastrar/Usuario': ({ cpf, nome, tipo, setor }) => {
    if (users.some((user) => user.cpf === cpf)) {
      return { status: 409, message: 'CPF já cadastrado.' };
    }
    users.push({ cpf, nome, tipo, setor });
    return { status: 201, cpf };
  },
  'POST /cadastrar/CartaoNFC': ({ user_cpf, codigo_uid }) => {
    const usuario = users.find(({ cpf }) => cpf === user_cpf);
    if (!usuario || cards.some((card) => card.codigo_uid === codigo_uid || card.user_cpf === user_cpf)) {
      return { status: 409, message: 'Usuário inexistente ou cartão já vinculado.' };
    }
    cards.push({ id: cards.length + 1, codigo_uid, user_cpf, ativo: true, usuario });
    return { status: 201, codigo_uid };
  }
};

export const demoActivity = new EventTarget();
export const demoSocket = new EventTarget();

export function simulateCard() {
  demoSocket.dispatchEvent(new CustomEvent('nfcAuth', { detail: { operador: demoOperator } }));
  demoActivity.dispatchEvent(new CustomEvent('entry', {
    detail: { method: 'Socket.IO', path: 'nfcAuth', body: { operador: demoOperator } }
  }));
}

export function demoRequest(path, { method = 'GET', body } = {}) {
  const handler = routes[`${method} ${path}`];
  const input = body ? JSON.parse(body) : undefined;
  const result = handler?.(input) ?? { status: 404, message: 'Rota indisponível na demonstração.' };
  const status = result.status ?? 200;
  const visibleInput = input ? Object.fromEntries(Object.entries(input).filter(([key]) => key !== 'senha')) : undefined;
  const visibleResult = path.startsWith('/login/') ? { usuario: result.usuario } : result;
  demoActivity.dispatchEvent(new CustomEvent('entry', {
    detail: { method, path, status, input: visibleInput, body: visibleResult }
  }));
  return Response.json(result, { status });
}
