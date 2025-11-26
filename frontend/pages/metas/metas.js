// Metas JavaScript

document.addEventListener('DOMContentLoaded', () => {
    setupForm();
    loadMetas();
});

function setupForm() {
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
                showToast('Meta criada com sucesso!');
                form.reset();
                loadMetas();
            } else {
                showToast('Erro ao criar meta', 'error');
            }
        } catch (error) {
            showToast('Erro ao criar meta', 'error');
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
            lista.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">🎯</div>
                    <div class="empty-state-text">Nenhuma meta definida ainda</div>
                </div>
            `;
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
                        <button onclick="deleteMeta(${meta.id})" class="btn btn-danger btn-small">Excluir</button>
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

async function deleteMeta(id) {
    const deleted = await deleteItem('metas', id);
    if (deleted) {
        loadMetas();
    }
}
