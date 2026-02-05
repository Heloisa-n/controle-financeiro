const formulario = document.querySelector('#formulario');

// histórico:
const listaTransacoes = document.querySelector('#lista-transacoes');

// display:
const saldoNoDisplay = document.querySelector('#saldo');
const receitasNoDisplay = document.querySelector('#dinheiro-positivo');
const despesasNoDisplay = document.querySelector('#dinheiro-negativo');

// input:
const inputDescricao = document.querySelector('#descricao');
const inputValor = document.querySelector('#valor');

// botão limpar:
const botaoLimpar = document.querySelector('.btn-limpar');

//listas:
let transacoes = [];

// funções:


function formatarTexto(texto){
    return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
}

function adicionarTransacaoNaLista(transacao) {

    // Define se a classe é 'positivo' ou 'negativo' baseado no valor

    const classe = transacao.valor < 0 ? 'valor_negativo' : 'valor_positivo';
    const sinal = transacao.valor < 0 ? '-' : '+';

    // criação da lista:
    
    const li = document.createElement('li');
    li.classList.add(classe);
    listaTransacoes.appendChild(li);
        
    // Formata o valor para moeda brasileira (R$)

    const valorFormatado = Math.abs(transacao.valor).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });

    //insere as informações no li e cria um span:

    li.innerHTML = `

    <div class= container_historico_display>
    ● ${transacao.nome} <span> ${sinal} ${valorFormatado}</span>
    </div>

    <div class="container_historico_botoes">
    <button class="btn_historico_excluir" onclick="removerTransacao(${transacao.id})">Excluir</button>
    </div>

    `;

}

function borracha() {
    listaTransacoes.innerHTML = ''; // Limpa a lista antes de desenhar
    transacoes.forEach(adicionarTransacaoNaLista);
    atualizarValoresDoDisplay();
}

function removerTransacao(id) {
   
    transacoes = transacoes.filter(transacao => transacao.id !== id);
    
    borracha(); 
}

function atualizarValoresDoDisplay() {

    const valores = transacoes.map(valor => valor.valor);
    
    // Cálculos matemáticos
    const total = valores.reduce((acc, item) => acc + item, 0);
    const receitas = valores.filter(item => item > 0).reduce((acc, item) => acc + item, 0);
    const despesas = Math.abs(valores.filter(item => item < 0).reduce((acc, item) => acc + item, 0));

    //função p/ moeda brasileira:

    const formatar = (valor) => valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    // Atualiza o HTML com os nomes das variáveis que você criou
    saldoNoDisplay.innerText = `${formatar(total)}`;
    receitasNoDisplay.innerText = `+ ${formatar(receitas)}`;
    despesasNoDisplay.innerText = `- ${formatar(despesas)}`;
}

// eventos:

formulario.addEventListener('submit', (e) => {

    e.preventDefault();

    const nomeDaTransacao = inputDescricao.value.trim();
    const valorDaTransacao = inputValor.value.trim();

    if (nomeDaTransacao.trim() === '' || Number(valorDaTransacao) === 0) {
    alert('Por favor, insira um nome válido e um valor diferente de zero!');
    return;
    }   

    // filtros:
    const textoFiltrado = formatarTexto(nomeDaTransacao)
    const nomeDuplicado = transacoes.some(checarNome => checarNome.nome === textoFiltrado);

    if (nomeDuplicado) {
        alert(`A transação "${textoFiltrado}" já está na lista!`);
        formulario.reset();
        return;
    }

     //objetos: 

    const novaTransacao = {
        id: Date.now(), //"indice"
        nome: textoFiltrado,
        valor: Number(valorDaTransacao)
    };

    transacoes.push(novaTransacao);

    borracha();

    // Limpa os campos após adicionar
    formulario.reset();
    inputDescricao.focus()
    
    console.log('Nome:', nomeDaTransacao, 'Valor:', valorDaTransacao);

});

botaoLimpar.addEventListener('click', () => {
    formulario.reset();
});

