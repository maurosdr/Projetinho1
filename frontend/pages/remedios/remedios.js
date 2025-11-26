// Remédios JavaScript

document.addEventListener('DOMContentLoaded', () => {
    setupForm();
    loadRemedios();
});

function setupForm() {
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
                document.querySelector('input[name="ativo"]').checked = true;
                loadRemedios();
            } else {
                showToast('Erro ao adicionar remédio', 'error');
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
            lista.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">💊</div>
                    <div class="empty-state-text">Nenhum remédio registrado ainda</div>
                </div>
            `;
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
                    <button onclick="deleteRemedio(${remedio.id})" class="btn btn-danger btn-small">Excluir</button>
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

async function deleteRemedio(id) {
    const deleted = await deleteItem('remedios', id);
    if (deleted) {
        loadRemedios();
    }
}
