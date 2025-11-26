const API_URL = 'http://localhost:3000/api';

// Sistema de Abas
document.addEventListener('DOMContentLoaded', () => {
    setupTabs();
    loadAllData();
    setupForms();
    setDefaultDates();
});

function setupTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.dataset.tab;

            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            button.classList.add('active');
            document.getElementById(tabId).classList.add('active');
        });
    });
}

function setDefaultDates() {
    const today = new Date().toISOString().split('T')[0];
    document.querySelectorAll('input[type="date"][name="data"]').forEach(input => {
        if (!input.value) input.value = today;
    });
}

// Sistema de Notificações
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Configurar Formulários
function setupForms() {
    setupRegistroDiarioForm();
    setupExamesForm();
    setupTreinosForm();
    setupRefeicoesForm();
    setupMetasForm();
    setupDoencasForm();
    setupRemediosForm();
}

// ===== REGISTRO DIÁRIO =====
function setupRegistroDiarioForm() {
    const form = document.getElementById('form-registro-diario');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        try {
            const response = await fetch(`${API_URL}/registro-diario`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                showToast('Registro diário adicionado com sucesso!');
                form.reset();
                setDefaultDates();
                loadRegistroDiario();
            }
        } catch (error) {
            showToast('Erro ao adicionar registro', 'error');
            console.error(error);
        }
    });
}

async function loadRegistroDiario() {
    try {
        const response = await fetch(`${API_URL}/registro-diario`);
        const registros = await response.json();
        const lista = document.getElementById('lista-registro-diario');

        if (registros.length === 0) {
            lista.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📝</div><div class="empty-state-text">Nenhum registro diário ainda</div></div>';
            return;
        }

        lista.innerHTML = registros.map(registro => `
            <div class="item-card">
                <div class="item-header">
                    <div class="item-title">${formatDate(registro.data)}</div>
                    <button onclick="deleteItem('registro-diario', ${registro.id})" class="btn-delete">Excluir</button>
                </div>
                <div class="item-body">
                    ${registro.peso ? `<div class="item-field"><span class="item-field-label">Peso:</span><span class="item-field-value">${registro.peso} kg</span></div>` : ''}
                    ${registro.pressao_arterial ? `<div class="item-field"><span class="item-field-label">Pressão:</span><span class="item-field-value">${registro.pressao_arterial}</span></div>` : ''}
                    ${registro.temperatura ? `<div class="item-field"><span class="item-field-label">Temperatura:</span><span class="item-field-value">${registro.temperatura}°C</span></div>` : ''}
                    ${registro.humor ? `<div class="item-field"><span class="item-field-label">Humor:</span><span class="item-field-value"><span class="badge badge-info">${registro.humor}</span></span></div>` : ''}
                    ${registro.nivel_energia ? `<div class="item-field"><span class="item-field-label">Energia:</span><span class="item-field-value">${registro.nivel_energia}/10</span></div>` : ''}
                    ${registro.horas_sono ? `<div class="item-field"><span class="item-field-label">Sono:</span><span class="item-field-value">${registro.horas_sono}h - ${registro.qualidade_sono || 'N/A'}</span></div>` : ''}
                    ${registro.sintomas ? `<div class="item-field"><span class="item-field-label">Sintomas:</span><span class="item-field-value">${registro.sintomas}</span></div>` : ''}
                    ${registro.observacoes ? `<div class="item-field"><span class="item-field-label">Observações:</span><span class="item-field-value">${registro.observacoes}</span></div>` : ''}
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Erro ao carregar registros diários:', error);
    }
}

// ===== EXAMES =====
function setupExamesForm() {
    const form = document.getElementById('form-exames');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(form);

        try {
            const response = await fetch(`${API_URL}/exames`, {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                showToast('Exame adicionado com sucesso!');
                form.reset();
                loadExames();
            }
        } catch (error) {
            showToast('Erro ao adicionar exame', 'error');
            console.error(error);
        }
    });
}

async function loadExames() {
    try {
        const response = await fetch(`${API_URL}/exames`);
        const exames = await response.json();
        const lista = document.getElementById('lista-exames');

        if (exames.length === 0) {
            lista.innerHTML = '<div class="empty-state"><div class="empty-state-icon">🔬</div><div class="empty-state-text">Nenhum exame registrado ainda</div></div>';
            return;
        }

        lista.innerHTML = exames.map(exame => `
            <div class="item-card">
                <div class="item-header">
                    <div>
                        <div class="item-title">${exame.titulo}</div>
                        ${exame.tipo ? `<span class="badge badge-info">${exame.tipo}</span>` : ''}
                    </div>
                    <button onclick="deleteItem('exames', ${exame.id})" class="btn-delete">Excluir</button>
                </div>
                <div class="item-body">
                    ${exame.data_exame ? `<div class="item-field"><span class="item-field-label">Data:</span><span class="item-field-value">${formatDate(exame.data_exame)}</span></div>` : ''}
                    ${exame.arquivo ? `<div class="item-field"><span class="item-field-label">Arquivo:</span><span class="item-field-value"><a href="/uploads/${exame.arquivo}" target="_blank" class="file-link">📎 Ver arquivo</a></span></div>` : ''}
                    ${exame.observacoes ? `<div class="item-field"><span class="item-field-label">Observações:</span><span class="item-field-value">${exame.observacoes}</span></div>` : ''}
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Erro ao carregar exames:', error);
    }
}

// ===== TREINOS =====
function setupTreinosForm() {
    const form = document.getElementById('form-treinos');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        try {
            const response = await fetch(`${API_URL}/treinos`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                showToast('Treino adicionado com sucesso!');
                form.reset();
                setDefaultDates();
                loadTreinos();
            }
        } catch (error) {
            showToast('Erro ao adicionar treino', 'error');
            console.error(error);
        }
    });
}

async function loadTreinos() {
    try {
        const response = await fetch(`${API_URL}/treinos`);
        const treinos = await response.json();
        const lista = document.getElementById('lista-treinos');

        if (treinos.length === 0) {
            lista.innerHTML = '<div class="empty-state"><div class="empty-state-icon">💪</div><div class="empty-state-text">Nenhum treino registrado ainda</div></div>';
            return;
        }

        lista.innerHTML = treinos.map(treino => `
            <div class="item-card">
                <div class="item-header">
                    <div>
                        <div class="item-title">${treino.exercicio}</div>
                        <div class="item-date">${formatDate(treino.data)}</div>
                    </div>
                    <button onclick="deleteItem('treinos', ${treino.id})" class="btn-delete">Excluir</button>
                </div>
                <div class="item-body">
                    ${treino.tipo ? `<div class="item-field"><span class="item-field-label">Tipo:</span><span class="item-field-value"><span class="badge badge-info">${treino.tipo}</span></span></div>` : ''}
                    ${treino.series ? `<div class="item-field"><span class="item-field-label">Séries:</span><span class="item-field-value">${treino.series}x${treino.repeticoes || '?'}</span></div>` : ''}
                    ${treino.peso ? `<div class="item-field"><span class="item-field-label">Peso:</span><span class="item-field-value">${treino.peso} kg</span></div>` : ''}
                    ${treino.duracao ? `<div class="item-field"><span class="item-field-label">Duração:</span><span class="item-field-value">${treino.duracao} min</span></div>` : ''}
                    ${treino.observacoes ? `<div class="item-field"><span class="item-field-label">Observações:</span><span class="item-field-value">${treino.observacoes}</span></div>` : ''}
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Erro ao carregar treinos:', error);
    }
}

// ===== REFEIÇÕES =====
function setupRefeicoesForm() {
    const form = document.getElementById('form-refeicoes');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        try {
            const response = await fetch(`${API_URL}/refeicoes`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                showToast('Refeição adicionada com sucesso!');
                form.reset();
                setDefaultDates();
                loadRefeicoes();
            }
        } catch (error) {
            showToast('Erro ao adicionar refeição', 'error');
            console.error(error);
        }
    });
}

async function loadRefeicoes() {
    try {
        const response = await fetch(`${API_URL}/refeicoes`);
        const refeicoes = await response.json();
        const lista = document.getElementById('lista-refeicoes');

        if (refeicoes.length === 0) {
            lista.innerHTML = '<div class="empty-state"><div class="empty-state-icon">🍽️</div><div class="empty-state-text">Nenhuma refeição registrada ainda</div></div>';
            return;
        }

        lista.innerHTML = refeicoes.map(refeicao => `
            <div class="item-card">
                <div class="item-header">
                    <div>
                        <div class="item-title">${refeicao.tipo_refeicao}</div>
                        <div class="item-date">${formatDate(refeicao.data)}</div>
                    </div>
                    <button onclick="deleteItem('refeicoes', ${refeicao.id})" class="btn-delete">Excluir</button>
                </div>
                <div class="item-body">
                    <div class="item-field"><span class="item-field-label">Alimentos:</span><span class="item-field-value">${refeicao.alimentos}</span></div>
                    ${refeicao.calorias ? `<div class="item-field"><span class="item-field-label">Calorias:</span><span class="item-field-value">${refeicao.calorias} kcal</span></div>` : ''}
                    ${refeicao.proteinas || refeicao.carboidratos || refeicao.gorduras ? `
                        <div class="item-field">
                            <span class="item-field-label">Macros:</span>
                            <span class="item-field-value">
                                ${refeicao.proteinas ? `P: ${refeicao.proteinas}g` : ''}
                                ${refeicao.carboidratos ? `C: ${refeicao.carboidratos}g` : ''}
                                ${refeicao.gorduras ? `G: ${refeicao.gorduras}g` : ''}
                            </span>
                        </div>
                    ` : ''}
                    ${refeicao.observacoes ? `<div class="item-field"><span class="item-field-label">Observações:</span><span class="item-field-value">${refeicao.observacoes}</span></div>` : ''}
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Erro ao carregar refeições:', error);
    }
}

// ===== METAS =====
function setupMetasForm() {
    const form = document.getElementById('form-metas');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        try {
            const response = await fetch(`${API_URL}/metas`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                showToast('Meta adicionada com sucesso!');
                form.reset();
                loadMetas();
            }
        } catch (error) {
            showToast('Erro ao adicionar meta', 'error');
            console.error(error);
        }
    });
}

async function loadMetas() {
    try {
        const response = await fetch(`${API_URL}/metas`);
        const metas = await response.json();
        const lista = document.getElementById('lista-metas');

        if (metas.length === 0) {
            lista.innerHTML = '<div class="empty-state"><div class="empty-state-icon">🎯</div><div class="empty-state-text">Nenhuma meta definida ainda</div></div>';
            return;
        }

        lista.innerHTML = metas.map(meta => {
            const progresso = meta.valor_alvo > 0 ? Math.min((meta.valor_atual / meta.valor_alvo) * 100, 100) : 0;
            const statusBadge = {
                'em_andamento': 'badge-info',
                'concluida': 'badge-success',
                'pausada': 'badge-warning',
                'cancelada': 'badge-danger'
            };

            return `
                <div class="item-card">
                    <div class="item-header">
                        <div>
                            <div class="item-title">${meta.titulo}</div>
                            ${meta.tipo ? `<span class="badge badge-info">${meta.tipo}</span>` : ''}
                            <span class="badge ${statusBadge[meta.status] || 'badge-info'}">${meta.status.replace('_', ' ')}</span>
                        </div>
                        <button onclick="deleteItem('metas', ${meta.id})" class="btn-delete">Excluir</button>
                    </div>
                    <div class="item-body">
                        ${meta.descricao ? `<div class="item-field"><span class="item-field-label">Descrição:</span><span class="item-field-value">${meta.descricao}</span></div>` : ''}
                        ${meta.valor_alvo ? `
                            <div class="item-field">
                                <span class="item-field-label">Progresso:</span>
                                <span class="item-field-value">${meta.valor_atual || 0} / ${meta.valor_alvo} ${meta.unidade || ''}</span>
                            </div>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${progresso}%">${progresso.toFixed(0)}%</div>
                            </div>
                        ` : ''}
                        ${meta.data_inicio || meta.data_fim ? `
                            <div class="item-field">
                                <span class="item-field-label">Período:</span>
                                <span class="item-field-value">${meta.data_inicio ? formatDate(meta.data_inicio) : '?'} até ${meta.data_fim ? formatDate(meta.data_fim) : '?'}</span>
                            </div>
                        ` : ''}
                    </div>
                </div>
            `;
        }).join('');
    } catch (error) {
        console.error('Erro ao carregar metas:', error);
    }
}

// ===== DOENÇAS =====
function setupDoencasForm() {
    const form = document.getElementById('form-doencas');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        data.ativa = data.ativa ? 1 : 0;

        try {
            const response = await fetch(`${API_URL}/doencas`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                showToast('Doença adicionada com sucesso!');
                form.reset();
                document.querySelector('input[name="ativa"]').checked = true;
                loadDoencas();
            }
        } catch (error) {
            showToast('Erro ao adicionar doença', 'error');
            console.error(error);
        }
    });
}

async function loadDoencas() {
    try {
        const response = await fetch(`${API_URL}/doencas`);
        const doencas = await response.json();
        const lista = document.getElementById('lista-doencas');

        if (doencas.length === 0) {
            lista.innerHTML = '<div class="empty-state"><div class="empty-state-icon">🏥</div><div class="empty-state-text">Nenhuma doença registrada</div></div>';
            return;
        }

        lista.innerHTML = doencas.map(doenca => {
            const gravidadeBadge = {
                'Leve': 'badge-success',
                'Moderada': 'badge-warning',
                'Grave': 'badge-danger'
            };

            return `
                <div class="item-card">
                    <div class="item-header">
                        <div>
                            <div class="item-title">${doenca.nome}</div>
                            ${doenca.gravidade ? `<span class="badge ${gravidadeBadge[doenca.gravidade] || 'badge-info'}">${doenca.gravidade}</span>` : ''}
                            ${doenca.ativa ? '<span class="badge badge-warning">Ativa</span>' : '<span class="badge badge-success">Inativa</span>'}
                        </div>
                        <button onclick="deleteItem('doencas', ${doenca.id})" class="btn-delete">Excluir</button>
                    </div>
                    <div class="item-body">
                        ${doenca.data_diagnostico ? `<div class="item-field"><span class="item-field-label">Diagnóstico:</span><span class="item-field-value">${formatDate(doenca.data_diagnostico)}</span></div>` : ''}
                        ${doenca.tratamento_atual ? `<div class="item-field"><span class="item-field-label">Tratamento:</span><span class="item-field-value">${doenca.tratamento_atual}</span></div>` : ''}
                        ${doenca.observacoes ? `<div class="item-field"><span class="item-field-label">Observações:</span><span class="item-field-value">${doenca.observacoes}</span></div>` : ''}
                    </div>
                </div>
            `;
        }).join('');
    } catch (error) {
        console.error('Erro ao carregar doenças:', error);
    }
}

// ===== REMÉDIOS =====
function setupRemediosForm() {
    const form = document.getElementById('form-remedios');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        data.ativo = data.ativo ? 1 : 0;

        try {
            const response = await fetch(`${API_URL}/remedios`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                showToast('Remédio adicionado com sucesso!');
                form.reset();
                document.querySelector('#form-remedios input[name="ativo"]').checked = true;
                loadRemedios();
            }
        } catch (error) {
            showToast('Erro ao adicionar remédio', 'error');
            console.error(error);
        }
    });
}

async function loadRemedios() {
    try {
        const response = await fetch(`${API_URL}/remedios`);
        const remedios = await response.json();
        const lista = document.getElementById('lista-remedios');

        if (remedios.length === 0) {
            lista.innerHTML = '<div class="empty-state"><div class="empty-state-icon">💊</div><div class="empty-state-text">Nenhum remédio registrado ainda</div></div>';
            return;
        }

        lista.innerHTML = remedios.map(remedio => `
            <div class="item-card">
                <div class="item-header">
                    <div>
                        <div class="item-title">${remedio.nome}</div>
                        ${remedio.dosagem ? `<span class="badge badge-info">${remedio.dosagem}</span>` : ''}
                        ${remedio.ativo ? '<span class="badge badge-success">Ativo</span>' : '<span class="badge badge-warning">Inativo</span>'}
                    </div>
                    <button onclick="deleteItem('remedios', ${remedio.id})" class="btn-delete">Excluir</button>
                </div>
                <div class="item-body">
                    ${remedio.frequencia ? `<div class="item-field"><span class="item-field-label">Frequência:</span><span class="item-field-value">${remedio.frequencia}</span></div>` : ''}
                    ${remedio.horarios ? `<div class="item-field"><span class="item-field-label">Horários:</span><span class="item-field-value">${remedio.horarios}</span></div>` : ''}
                    ${remedio.data_inicio ? `<div class="item-field"><span class="item-field-label">Início:</span><span class="item-field-value">${formatDate(remedio.data_inicio)}</span></div>` : ''}
                    ${remedio.data_fim ? `<div class="item-field"><span class="item-field-label">Fim:</span><span class="item-field-value">${formatDate(remedio.data_fim)}</span></div>` : ''}
                    ${remedio.prescrito_por ? `<div class="item-field"><span class="item-field-label">Prescrito por:</span><span class="item-field-value">${remedio.prescrito_por}</span></div>` : ''}
                    ${remedio.observacoes ? `<div class="item-field"><span class="item-field-label">Observações:</span><span class="item-field-value">${remedio.observacoes}</span></div>` : ''}
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Erro ao carregar remédios:', error);
    }
}

// Funções auxiliares
function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('pt-BR');
}

async function deleteItem(endpoint, id) {
    if (!confirm('Tem certeza que deseja excluir este item?')) return;

    try {
        const response = await fetch(`${API_URL}/${endpoint}/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            showToast('Item removido com sucesso!');
            loadAllData();
        }
    } catch (error) {
        showToast('Erro ao remover item', 'error');
        console.error(error);
    }
}

function loadAllData() {
    loadRegistroDiario();
    loadExames();
    loadTreinos();
    loadRefeicoes();
    loadMetas();
    loadDoencas();
    loadRemedios();
}
