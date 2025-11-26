// Pacientes JavaScript

let currentPatientId = null;
let currentHistoryTab = 'registros';

document.addEventListener('DOMContentLoaded', () => {
    loadPacientes();
    setupForm();
    setupHistoryTabs();
});

function setupForm() {
    const form = document.getElementById('form-paciente');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        try {
            const response = await fetch(`${API_URL}/pacientes`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                showToast('Paciente adicionado com sucesso!');
                form.reset();
                loadPacientes();
            } else {
                showToast('Erro ao adicionar paciente', 'error');
            }
        } catch (error) {
            showToast('Erro ao adicionar paciente', 'error');
            console.error(error);
        }
    });
}

async function loadPacientes() {
    try {
        const response = await fetch(`${API_URL}/pacientes`);
        const pacientes = await response.json();
        const lista = document.getElementById('lista-pacientes');

        if (pacientes.length === 0) {
            lista.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">👥</div>
                    <div class="empty-state-text">Nenhum paciente cadastrado ainda</div>
                </div>
            `;
            return;
        }

        lista.innerHTML = pacientes.map(paciente => `
            <div class="item-card patient-card" onclick="showPatientHistory(${paciente.id})">
                <div class="item-header">
                    <div>
                        <div class="item-title">${paciente.nome}</div>
                        ${paciente.tipo_sanguineo ? `<span class="badge badge-danger">${paciente.tipo_sanguineo}</span>` : ''}
                    </div>
                    <button onclick="event.stopPropagation(); deletePaciente(${paciente.id})" class="btn btn-danger btn-small">Excluir</button>
                </div>
                <div class="item-body">
                    ${paciente.data_nascimento ? `<div class="item-field"><span class="item-field-label">Nascimento:</span><span class="item-field-value">${formatDate(paciente.data_nascimento)}</span></div>` : ''}
                    ${paciente.email ? `<div class="item-field"><span class="item-field-label">Email:</span><span class="item-field-value">${paciente.email}</span></div>` : ''}
                    ${paciente.telefone ? `<div class="item-field"><span class="item-field-label">Telefone:</span><span class="item-field-value">${paciente.telefone}</span></div>` : ''}
                    ${paciente.cpf ? `<div class="item-field"><span class="item-field-label">CPF:</span><span class="item-field-value">${paciente.cpf}</span></div>` : ''}
                    ${paciente.observacoes ? `<div class="item-field"><span class="item-field-label">Observações:</span><span class="item-field-value">${paciente.observacoes}</span></div>` : ''}
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Erro ao carregar pacientes:', error);
    }
}

async function deletePaciente(id) {
    const deleted = await deleteItem('pacientes', id);
    if (deleted) {
        loadPacientes();
    }
}

async function showPatientHistory(patientId) {
    currentPatientId = patientId;

    try {
        const response = await fetch(`${API_URL}/pacientes/${patientId}`);
        const paciente = await response.json();

        document.getElementById('modal-patient-name').textContent = `Histórico de ${paciente.nome}`;
        document.getElementById('patient-history-modal').style.display = 'flex';

        loadPatientHistory('registros');
    } catch (error) {
        console.error('Erro ao carregar paciente:', error);
    }
}

function closePatientHistory() {
    document.getElementById('patient-history-modal').style.display = 'none';
    currentPatientId = null;
}

function setupHistoryTabs() {
    const tabs = document.querySelectorAll('.history-tab-btn');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const tabType = tab.dataset.tab;
            loadPatientHistory(tabType);
        });
    });
}

async function loadPatientHistory(type) {
    if (!currentPatientId) return;

    const content = document.getElementById('history-content');
    content.innerHTML = `
        <div class="empty-state">
            <div class="empty-state-icon">⏳</div>
            <div class="empty-state-text">Carregando histórico...</div>
        </div>
    `;

    try {
        let endpoint = '';
        let displayFunc = null;

        switch(type) {
            case 'registros':
                endpoint = 'registro-diario';
                displayFunc = displayRegistros;
                break;
            case 'exames':
                endpoint = 'exames';
                displayFunc = displayExames;
                break;
            case 'treinos':
                endpoint = 'treinos';
                displayFunc = displayTreinos;
                break;
            case 'refeicoes':
                endpoint = 'refeicoes';
                displayFunc = displayRefeicoes;
                break;
            case 'metas':
                endpoint = 'metas';
                displayFunc = displayMetas;
                break;
            case 'doencas':
                endpoint = 'doencas';
                displayFunc = displayDoencas;
                break;
            case 'remedios':
                endpoint = 'remedios';
                displayFunc = displayRemedios;
                break;
        }

        const response = await fetch(`${API_URL}/${endpoint}?paciente_id=${currentPatientId}`);
        const data = await response.json();

        if (data.length === 0) {
            content.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📭</div>
                    <div class="empty-state-text">Nenhum registro encontrado</div>
                </div>
            `;
            return;
        }

        if (displayFunc) {
            content.innerHTML = displayFunc(data);
        }
    } catch (error) {
        console.error('Erro ao carregar histórico:', error);
        content.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">❌</div>
                <div class="empty-state-text">Erro ao carregar histórico</div>
            </div>
        `;
    }
}

function displayRegistros(registros) {
    return registros.map(r => `
        <div class="item-card">
            <div class="item-header">
                <div class="item-title">${formatDate(r.data)}</div>
            </div>
            <div class="item-body">
                ${r.peso ? `<div class="item-field"><span class="item-field-label">Peso:</span><span class="item-field-value">${r.peso} kg</span></div>` : ''}
                ${r.pressao_arterial ? `<div class="item-field"><span class="item-field-label">Pressão:</span><span class="item-field-value">${r.pressao_arterial}</span></div>` : ''}
                ${r.humor ? `<div class="item-field"><span class="item-field-label">Humor:</span><span class="item-field-value">${r.humor}</span></div>` : ''}
            </div>
        </div>
    `).join('');
}

function displayExames(exames) {
    return exames.map(e => `
        <div class="item-card">
            <div class="item-header">
                <div class="item-title">${e.titulo}</div>
                <span class="item-date">${formatDate(e.data_exame)}</span>
            </div>
        </div>
    `).join('');
}

function displayTreinos(treinos) {
    return treinos.map(t => `
        <div class="item-card">
            <div class="item-header">
                <div class="item-title">${t.exercicio}</div>
                <span class="item-date">${formatDate(t.data)}</span>
            </div>
        </div>
    `).join('');
}

function displayRefeicoes(refeicoes) {
    return refeicoes.map(r => `
        <div class="item-card">
            <div class="item-header">
                <div class="item-title">${r.tipo_refeicao}</div>
                <span class="item-date">${formatDate(r.data)}</span>
            </div>
        </div>
    `).join('');
}

function displayMetas(metas) {
    return metas.map(m => `
        <div class="item-card">
            <div class="item-header">
                <div class="item-title">${m.titulo}</div>
            </div>
        </div>
    `).join('');
}

function displayDoencas(doencas) {
    return doencas.map(d => `
        <div class="item-card">
            <div class="item-header">
                <div class="item-title">${d.nome}</div>
            </div>
        </div>
    `).join('');
}

function displayRemedios(remedios) {
    return remedios.map(r => `
        <div class="item-card">
            <div class="item-header">
                <div class="item-title">${r.nome}</div>
            </div>
        </div>
    `).join('');
}

// Fechar modal ao clicar fora
document.getElementById('patient-history-modal')?.addEventListener('click', (e) => {
    if (e.target.id === 'patient-history-modal') {
        closePatientHistory();
    }
});
