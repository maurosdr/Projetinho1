// Refeições JavaScript

document.addEventListener('DOMContentLoaded', () => {
    setupForm();
    loadRefeicoes();
});

function setupForm() {
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
            } else {
                showToast('Erro ao adicionar refeição', 'error');
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
            lista.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">🍽️</div>
                    <div class="empty-state-text">Nenhuma refeição registrada ainda</div>
                </div>
            `;
            return;
        }

        lista.innerHTML = refeicoes.map(refeicao => `
            <div class="item-card">
                <div class="item-header">
                    <div>
                        <div class="item-title">${refeicao.tipo_refeicao}</div>
                        <div class="item-date">${formatDate(refeicao.data)}</div>
                    </div>
                    <button onclick="deleteRefeicao(${refeicao.id})" class="btn btn-danger btn-small">Excluir</button>
                </div>
                <div class="item-body">
                    <div class="item-field"><span class="item-field-label">Alimentos:</span><span class="item-field-value">${refeicao.alimentos}</span></div>
                    ${refeicao.calorias ? `<div class="item-field"><span class="item-field-label">Calorias:</span><span class="item-field-value">${refeicao.calorias} kcal</span></div>` : ''}
                    ${refeicao.proteinas || refeicao.carboidratos || refeicao.gorduras ? `
                        <div class="item-field">
                            <span class="item-field-label">Macros:</span>
                            <span class="item-field-value">
                                ${refeicao.proteinas ? `P: ${refeicao.proteinas}g ` : ''}
                                ${refeicao.carboidratos ? `C: ${refeicao.carboidratos}g ` : ''}
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

async function deleteRefeicao(id) {
    const deleted = await deleteItem('refeicoes', id);
    if (deleted) {
        loadRefeicoes();
    }
}
