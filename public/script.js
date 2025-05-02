document.addEventListener("DOMContentLoaded", () => {
    const formBusca = document.getElementById("formBusca");
  
    if (formBusca) {
      formBusca.addEventListener("submit", async (e) => {
        e.preventDefault();
  
        const modalidade = document.getElementById("modalidade").value;
        const equipe = document.getElementById("equipe").value;
        const jogador = document.getElementById("jogador").value;
  
        console.log("✅ Enviando busca com:", { modalidade, equipe, jogador });
  
        const res = await fetch("http://localhost:3000/api/buscar", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ modalidade, equipe, jogador })
        });
  
        const data = await res.json();
        console.log("📦 Resposta recebida:", data);
  
        const resultadoDiv = document.getElementById("resultado");
  
        if (Array.isArray(data)) {
          resultadoDiv.innerHTML = data.map(item => `
            <div class="card">
              <h3>${item.jogador}</h3>
              <p><strong>Modalidade:</strong> ${item.modalidade}</p>
              <p><strong>Equipe:</strong> ${item.equipe}</p>
              <p><strong>Estatísticas:</strong> ${item.estatisticas}</p>
            </div>
          `).join('');
        } else {
          resultadoDiv.innerHTML = `<p>${data.message}</p>`;
        }
      });
    }
  });
  