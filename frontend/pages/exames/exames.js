// Exames JavaScript

document.addEventListener('DOMContentLoaded', () => {
    setupForm();
    loadExames();
});

function setupForm() {
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
            } else {
                showToast('Erro ao adicionar exame', 'error');
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
            lista.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">🔬</div>
                    <div class="empty-state-text">Nenhum exame registrado ainda</div>
                </div>
            `;
            return;
        }

        lista.innerHTML = exames.map(exame => `
            <div class="item-card">
                <div class="item-header">
                    <div>
                        <div class="item-title">${exame.titulo}</div>
                        ${exame.tipo ? `<span class="badge badge-info">${exame.tipo}</span>` : ''}
                    </div>
                    <button onclick="deleteExame(${exame.id})" class="btn btn-danger btn-small">Excluir</button>
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

async function deleteExame(id) {
    const deleted = await deleteItem('exames', id);
    if (deleted) {
        loadExames();
    }
}
