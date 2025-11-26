// Doenças JavaScript

document.addEventListener('DOMContentLoaded', () => {
    setupForm();
    loadDoencas();
});

function setupForm() {
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
                showToast('Doença registrada com sucesso!');
                form.reset();
                document.querySelector('input[name="ativa"]').checked = true;
                loadDoencas();
            } else {
                showToast('Erro ao registrar doença', 'error');
            }
        } catch (error) {
            showToast('Erro ao registrar doença', 'error');
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
            lista.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">🏥</div>
                    <div class="empty-state-text">Nenhuma doença registrada</div>
                </div>
            `;
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
                        <button onclick="deleteDoenca(${doenca.id})" class="btn btn-danger btn-small">Excluir</button>
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

async function deleteDoenca(id) {
    const deleted = await deleteItem('doencas', id);
    if (deleted) {
        loadDoencas();
    }
}
