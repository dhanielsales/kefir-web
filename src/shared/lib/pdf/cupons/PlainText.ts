import { Client, Order, Trader } from '../types';
import { centralizeText, formatAddress, formatAmount, formatProductsHeader, includeSpace, justifiyText, alingRightText } from './utils'

export const createTextPlainContent = (order: Order, client: Client, trader: Trader) => {
  const header = formatHeader(client, trader)
  const footer = formatFooter(order, trader)
  const orderProducts = formatProducts(order)

  const invoiceTextPlain = `${header}${orderProducts}${footer}`;

    return invoiceTextPlain;
};

function formatHeader(client: Client, trader: Trader, maxCharLine = 43) {
  const header = `
${centralizeText(trader.name)}

${client.name ? `Nome: ${client.name.substring(0, Number(maxCharLine - 6))}`: ""}
${client.phone ? `Telefone: ${client.phone}`: ""}
${client.address ? `Endereço: ${formatAddress(client.address, 10)}`: ""}
`

  return header
}

function formatProducts(order: Order, maxCharLine = 43) {
  let orderProducts = `
${'-'.repeat(maxCharLine)}
${centralizeText(`PEDIDO #${order.id}`)}
${'-'.repeat(maxCharLine)}
${formatProductsHeader()}
`;

  order.products.forEach((product) => {
    const productAmount = formatAmount(Number(product.amount).toFixed(2));
    const productAmountTotalAmount = formatAmount((Number(product.amount) * product.quantity).toFixed(2));

    const productData = `# ${formatAddress(product.name.toLowerCase(), 2)}\n`;

    const formatedProduct = alingRightText(`${product.quantity}${includeSpace(2)}${productAmount}${includeSpace(2)}${productAmountTotalAmount}\n`)

    orderProducts += productData + formatedProduct;
  });

  return orderProducts;
}

function formatFooter(order: Order, trader: Trader) {
//   const footer = `
// ${justifiyText('Total Produtos:', `${formatAmount(Number(order.total).toFixed(2))}`)}
// ${justifiyText('Subtotal:', `${formatAmount(Number(order.subtotal).toFixed(2))}`)}
// ${justifiyText('Total a pagar:', `${formatAmount(Number(order.subtotal).toFixed(2))}`)}
// ${justifiyText('Forma de pagamento:',`${order.paymentMethod.substring(0, 17)}`)}

// *CONTROLE DE PEDIDO PARA SIMPLES
// CONFERÊNCIA

// *ATENÇÃO: Em caso de desacordo com o TIPO
// solicitado, entre em contato conosco para
// procedimento de TROCA, NÃO abra a embalagem
// ou utilize o starter enviado erroneamente,
// pois nesse caso haverá PERDA DE GARANTIA de
// novo envio.

// O valor cobrado refere-se INTEGRALMENTE as
// DESPESAS POSTAIS e ao serviço de ASSESSORIA
// DE CULTIVO. Não trabalhamos com VENDA,
// enviamos o Starter como DOAÇÃO, MEDIANTE
// SOLICITAÇÃO DO SERVIÇO DE ASSESSORIA.

// ${centralizeText(`${trader.name.toUpperCase()} - ${trader.site}`)}
// .
// `

const footer = `
${justifiyText('Total Produtos:', `${formatAmount(Number(order.total).toFixed(2))}`)}
${justifiyText('Subtotal:', `${formatAmount(Number(order.subtotal).toFixed(2))}`)}
${justifiyText('Total a pagar:', `${formatAmount(Number(order.subtotal).toFixed(2))}`)}
${justifiyText('Forma de pagamento:',`${order.paymentMethod.substring(0, 17)}`)}

${centralizeText(`${trader.name.toUpperCase()} - ${trader.site}`)}
.
`

  return footer
}
