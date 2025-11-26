// Histórico completo - JavaScript

let todosRegistros = [];
let registrosFiltrados = [];

document.addEventListener('DOMContentLoaded', () => {
    carregarHistoricoCompleto();
    setupFiltros();
});

function setupFiltros() {
    const btnAplicar = document.getElementById('btn-aplicar-filtros');
    btnAplicar.addEventListener('click', aplicarFiltros);
}

async function carregarHistoricoCompleto() {
    try {
        const lista = document.getElementById('lista-historico');
        lista.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">⏳</div>
                <div class="empty-state-text">Carregando histórico...</div>
            </div>
        `;

        // Buscar dados de todos os endpoints
        const [registrosDiarios, exames, treinos, refeicoes, metas, doencas, remedios] = await Promise.all([
            fetch(`${API_URL}/registro-diario`).then(r => r.json()),
            fetch(`${API_URL}/exames`).then(r => r.json()),
            fetch(`${API_URL}/treinos`).then(r => r.json()),
            fetch(`${API_URL}/refeicoes`).then(r => r.json()),
            fetch(`${API_URL}/metas`).then(r => r.json()),
            fetch(`${API_URL}/doencas`).then(r => r.json()),
            fetch(`${API_URL}/remedios`).then(r => r.json())
        ]);

        // Consolidar todos os registros com tipo e data
        todosRegistros = [
            ...registrosDiarios.map(r => ({ ...r, tipo: 'registro-diario', icone: '📋', tipoLabel: 'Registro Diário', dataRef: r.data })),
            ...exames.map(r => ({ ...r, tipo: 'exames', icone: '🔬', tipoLabel: 'Exame', dataRef: r.data_exame })),
            ...treinos.map(r => ({ ...r, tipo: 'treinos', icone: '💪', tipoLabel: 'Treino', dataRef: r.data })),
            ...refeicoes.map(r => ({ ...r, tipo: 'refeicoes', icone: '🍽️', tipoLabel: 'Refeição', dataRef: r.data })),
            ...metas.map(r => ({ ...r, tipo: 'metas', icone: '🎯', tipoLabel: 'Meta', dataRef: r.data_inicio })),
            ...doencas.map(r => ({ ...r, tipo: 'doencas', icone: '🏥', tipoLabel: 'Doença', dataRef: r.data_diagnostico })),
            ...remedios.map(r => ({ ...r, tipo: 'remedios', icone: '💊', tipoLabel: 'Remédio', dataRef: r.data_inicio }))
        ];

        // Ordenar por data (mais recente primeiro)
        todosRegistros.sort((a, b) => {
            const dataA = new Date(a.dataRef || '1900-01-01');
            const dataB = new Date(b.dataRef || '1900-01-01');
            return dataB - dataA;
        });

        registrosFiltrados = todosRegistros;
        renderizarHistorico();

    } catch (error) {
        console.error('Erro ao carregar histórico:', error);
        showToast('Erro ao carregar histórico', 'error');
    }
}

function aplicarFiltros() {
    const filtroTipo = document.getElementById('filtro-tipo').value;
    const filtroPeriodo = document.getElementById('filtro-periodo').value;

    registrosFiltrados = todosRegistros;

    // Filtrar por tipo
    if (filtroTipo !== 'todos') {
        registrosFiltrados = registrosFiltrados.filter(r => r.tipo === filtroTipo);
    }

    // Filtrar por período
    if (filtroPeriodo !== 'todos') {
        const agora = new Date();
        const diasAtras = {
            '7dias': 7,
            '30dias': 30,
            '90dias': 90,
            'ano': 365
        }[filtroPeriodo];

        const dataLimite = new Date();
        dataLimite.setDate(agora.getDate() - diasAtras);

        registrosFiltrados = registrosFiltrados.filter(r => {
            const dataRegistro = new Date(r.dataRef || '1900-01-01');
            return dataRegistro >= dataLimite;
        });
    }

    renderizarHistorico();
}

function renderizarHistorico() {
    const lista = document.getElementById('lista-historico');
    const totalRegistros = document.getElementById('total-registros');

    totalRegistros.textContent = `${registrosFiltrados.length} registro${registrosFiltrados.length !== 1 ? 's' : ''}`;

    if (registrosFiltrados.length === 0) {
        lista.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📜</div>
                <div class="empty-state-text">Nenhum registro encontrado</div>
            </div>
        `;
        return;
    }

    lista.innerHTML = registrosFiltrados.map(registro => {
        return `
            <div class="item-card">
                <div class="item-header">
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <span style="font-size: 1.5rem;">${registro.icone}</span>
                        <div>
                            <div class="item-title">${registro.tipoLabel}</div>
                            <div style="font-size: 0.875rem; color: var(--text-secondary);">${formatDate(registro.dataRef)}</div>
                        </div>
                    </div>
                </div>
                <div class="item-body">
                    ${renderizarDetalhes(registro)}
                </div>
            </div>
        `;
    }).join('');
}

function renderizarDetalhes(registro) {
    switch (registro.tipo) {
        case 'registro-diario':
            return `
                ${registro.peso ? `<div class="item-field"><span class="item-field-label">Peso:</span><span class="item-field-value">${registro.peso} kg</span></div>` : ''}
                ${registro.pressao_arterial ? `<div class="item-field"><span class="item-field-label">Pressão:</span><span class="item-field-value">${registro.pressao_arterial}</span></div>` : ''}
                ${registro.temperatura ? `<div class="item-field"><span class="item-field-label">Temperatura:</span><span class="item-field-value">${registro.temperatura}°C</span></div>` : ''}
                ${registro.humor ? `<div class="item-field"><span class="item-field-label">Humor:</span><span class="item-field-value"><span class="badge badge-info">${registro.humor}</span></span></div>` : ''}
                ${registro.nivel_energia ? `<div class="item-field"><span class="item-field-label">Energia:</span><span class="item-field-value">${registro.nivel_energia}/10</span></div>` : ''}
                ${registro.horas_sono ? `<div class="item-field"><span class="item-field-label">Sono:</span><span class="item-field-value">${registro.horas_sono}h - ${registro.qualidade_sono || 'N/A'}</span></div>` : ''}
                ${registro.sintomas ? `<div class="item-field"><span class="item-field-label">Sintomas:</span><span class="item-field-value">${registro.sintomas}</span></div>` : ''}
                ${registro.observacoes ? `<div class="item-field"><span class="item-field-label">Observações:</span><span class="item-field-value">${registro.observacoes}</span></div>` : ''}
            `;

        case 'exames':
            return `
                ${registro.titulo ? `<div class="item-field"><span class="item-field-label">Título:</span><span class="item-field-value">${registro.titulo}</span></div>` : ''}
                ${registro.tipo ? `<div class="item-field"><span class="item-field-label">Tipo:</span><span class="item-field-value"><span class="badge badge-primary">${registro.tipo}</span></span></div>` : ''}
                ${registro.arquivo ? `<div class="item-field"><span class="item-field-label">Arquivo:</span><span class="item-field-value">📎 ${registro.arquivo}</span></div>` : ''}
                ${registro.observacoes ? `<div class="item-field"><span class="item-field-label">Observações:</span><span class="item-field-value">${registro.observacoes}</span></div>` : ''}
            `;

        case 'treinos':
            return `
                ${registro.tipo ? `<div class="item-field"><span class="item-field-label">Tipo:</span><span class="item-field-value"><span class="badge badge-success">${registro.tipo}</span></span></div>` : ''}
                ${registro.exercicio ? `<div class="item-field"><span class="item-field-label">Exercício:</span><span class="item-field-value">${registro.exercicio}</span></div>` : ''}
                ${registro.series ? `<div class="item-field"><span class="item-field-label">Séries x Repetições:</span><span class="item-field-value">${registro.series} x ${registro.repeticoes || 'N/A'}</span></div>` : ''}
                ${registro.peso ? `<div class="item-field"><span class="item-field-label">Peso:</span><span class="item-field-value">${registro.peso} kg</span></div>` : ''}
                ${registro.duracao ? `<div class="item-field"><span class="item-field-label">Duração:</span><span class="item-field-value">${registro.duracao} min</span></div>` : ''}
                ${registro.observacoes ? `<div class="item-field"><span class="item-field-label">Observações:</span><span class="item-field-value">${registro.observacoes}</span></div>` : ''}
            `;

        case 'refeicoes':
            return `
                ${registro.tipo_refeicao ? `<div class="item-field"><span class="item-field-label">Tipo:</span><span class="item-field-value"><span class="badge badge-warning">${registro.tipo_refeicao}</span></span></div>` : ''}
                ${registro.alimentos ? `<div class="item-field"><span class="item-field-label">Alimentos:</span><span class="item-field-value">${registro.alimentos}</span></div>` : ''}
                ${registro.calorias ? `<div class="item-field"><span class="item-field-label">Calorias:</span><span class="item-field-value">${registro.calorias} kcal</span></div>` : ''}
                ${registro.proteinas || registro.carboidratos || registro.gorduras ? `
                    <div class="item-field">
                        <span class="item-field-label">Macros:</span>
                        <span class="item-field-value">
                            ${registro.proteinas ? `P: ${registro.proteinas}g` : ''}
                            ${registro.carboidratos ? `C: ${registro.carboidratos}g` : ''}
                            ${registro.gorduras ? `G: ${registro.gorduras}g` : ''}
                        </span>
                    </div>
                ` : ''}
                ${registro.observacoes ? `<div class="item-field"><span class="item-field-label">Observações:</span><span class="item-field-value">${registro.observacoes}</span></div>` : ''}
            `;

        case 'metas':
            return `
                ${registro.titulo ? `<div class="item-field"><span class="item-field-label">Título:</span><span class="item-field-value">${registro.titulo}</span></div>` : ''}
                ${registro.descricao ? `<div class="item-field"><span class="item-field-label">Descrição:</span><span class="item-field-value">${registro.descricao}</span></div>` : ''}
                ${registro.tipo ? `<div class="item-field"><span class="item-field-label">Tipo:</span><span class="item-field-value"><span class="badge badge-info">${registro.tipo}</span></span></div>` : ''}
                ${registro.valor_alvo || registro.valor_atual ? `
                    <div class="item-field">
                        <span class="item-field-label">Progresso:</span>
                        <span class="item-field-value">${registro.valor_atual || 0} / ${registro.valor_alvo || 0} ${registro.unidade || ''}</span>
                    </div>
                ` : ''}
                ${registro.status ? `<div class="item-field"><span class="item-field-label">Status:</span><span class="item-field-value"><span class="badge badge-${registro.status === 'Concluída' ? 'success' : registro.status === 'Em Andamento' ? 'warning' : 'secondary'}">${registro.status}</span></span></div>` : ''}
                ${registro.data_fim ? `<div class="item-field"><span class="item-field-label">Data Fim:</span><span class="item-field-value">${formatDate(registro.data_fim)}</span></div>` : ''}
            `;

        case 'doencas':
            return `
                ${registro.nome ? `<div class="item-field"><span class="item-field-label">Nome:</span><span class="item-field-value">${registro.nome}</span></div>` : ''}
                ${registro.gravidade ? `<div class="item-field"><span class="item-field-label">Gravidade:</span><span class="item-field-value"><span class="badge badge-${registro.gravidade === 'Leve' ? 'success' : registro.gravidade === 'Moderada' ? 'warning' : 'danger'}">${registro.gravidade}</span></span></div>` : ''}
                ${registro.tratamento_atual ? `<div class="item-field"><span class="item-field-label">Tratamento:</span><span class="item-field-value">${registro.tratamento_atual}</span></div>` : ''}
                ${registro.ativa !== undefined ? `<div class="item-field"><span class="item-field-label">Ativa:</span><span class="item-field-value"><span class="badge badge-${registro.ativa ? 'danger' : 'success'}">${registro.ativa ? 'Sim' : 'Não'}</span></span></div>` : ''}
                ${registro.observacoes ? `<div class="item-field"><span class="item-field-label">Observações:</span><span class="item-field-value">${registro.observacoes}</span></div>` : ''}
            `;

        case 'remedios':
            return `
                ${registro.nome ? `<div class="item-field"><span class="item-field-label">Nome:</span><span class="item-field-value">${registro.nome}</span></div>` : ''}
                ${registro.dosagem ? `<div class="item-field"><span class="item-field-label">Dosagem:</span><span class="item-field-value">${registro.dosagem}</span></div>` : ''}
                ${registro.frequencia ? `<div class="item-field"><span class="item-field-label">Frequência:</span><span class="item-field-value">${registro.frequencia}</span></div>` : ''}
                ${registro.horarios ? `<div class="item-field"><span class="item-field-label">Horários:</span><span class="item-field-value">${registro.horarios}</span></div>` : ''}
                ${registro.prescrito_por ? `<div class="item-field"><span class="item-field-label">Prescrito por:</span><span class="item-field-value">${registro.prescrito_por}</span></div>` : ''}
                ${registro.data_fim ? `<div class="item-field"><span class="item-field-label">Data Fim:</span><span class="item-field-value">${formatDate(registro.data_fim)}</span></div>` : ''}
                ${registro.ativo !== undefined ? `<div class="item-field"><span class="item-field-label">Ativo:</span><span class="item-field-value"><span class="badge badge-${registro.ativo ? 'success' : 'secondary'}">${registro.ativo ? 'Sim' : 'Não'}</span></span></div>` : ''}
                ${registro.observacoes ? `<div class="item-field"><span class="item-field-label">Observações:</span><span class="item-field-value">${registro.observacoes}</span></div>` : ''}
            `;

        default:
            return '<div class="item-field"><span class="item-field-label">Detalhes não disponíveis</span></div>';
    }
}
